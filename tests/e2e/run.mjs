#!/usr/bin/env node
/**
 * End-to-end localization journey against a running app (default http://localhost:3000)
 * and a local Supabase. Uses the system Playwright install.
 *
 *   npm run build && npm start   # in another terminal
 *   npm run test:e2e
 */
import { createRequire } from "node:module";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const root = new URL("../..", import.meta.url).pathname;
const shots = join(root, "tests/e2e/screenshots");
mkdirSync(shots, { recursive: true });

const flatten = (o) => Object.values(o).flatMap((v) => (typeof v === "object" ? flatten(v) : [v]));
const en = flatten(JSON.parse(readFileSync(join(root, "messages/en.json"), "utf8")));
const fr = new Set(flatten(JSON.parse(readFileSync(join(root, "messages/fr.json"), "utf8"))));
// English UI phrases (2+ words, no placeholders) that must never appear on a French page.
const englishOnly = [...new Set(en)].filter((s) => !fr.has(s) && !/[{<]/.test(s) && s.trim().split(/\s+/).length >= 2);

const failures = [];
let passed = 0;
const check = (cond, message) => (cond ? passed++ : failures.push(message));

const viewports = { desktop: { width: 1366, height: 900 }, tablet: { width: 820, height: 1180 }, mobile: { width: 390, height: 844 } };

async function auditPage(page, label, locale) {
  const result = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    text: document.body.innerText,
    h1: document.querySelectorAll("h1").length,
  }));
  check(result.lang === locale, `${label}: html lang is "${result.lang}", expected "${locale}"`);
  check(result.overflow <= 1, `${label}: horizontal overflow of ${result.overflow}px`);
  check(result.h1 === 1, `${label}: expected exactly one <h1>, found ${result.h1}`);
  check(!result.text.includes("Leads.") && !result.text.includes("Common."), `${label}: raw translation key visible`);
  if (locale === "fr") {
    const leaked = englishOnly.filter((s) => result.text.includes(s));
    check(!leaked.length, `${label}: English text on French page: ${leaked.slice(0, 3).join(" | ")}`);
  }
}

async function auditAllViewports(context, path, locale, name) {
  for (const [vp, size] of Object.entries(viewports)) {
    const page = await context.newPage();
    await page.setViewportSize(size);
    await page.goto(`${BASE}${path}`);
    await auditPage(page, `${name} [${locale}/${vp}]`, locale);
    await page.screenshot({ path: join(shots, `${name}-${locale}-${vp}.png`), fullPage: true });
    await page.close();
  }
}

const browser = await chromium.launch();
try {
  // 1. Browser language detection for anonymous visitors.
  const frVisitor = await browser.newContext({ locale: "fr-FR", extraHTTPHeaders: { "Accept-Language": "fr-FR,fr;q=0.9" } });
  const p1 = await frVisitor.newPage();
  await p1.goto(`${BASE}/`);
  check(new URL(p1.url()).pathname === "/fr", `browser language: expected /fr, got ${p1.url()}`);
  const deVisitor = await browser.newContext({ extraHTTPHeaders: { "Accept-Language": "de-DE" } });
  const p2 = await deVisitor.newPage();
  await p2.goto(`${BASE}/pricing`);
  check(new URL(p2.url()).pathname === "/en/pricing", `fallback: expected /en/pricing, got ${p2.url()}`);

  // 2. Public site in both languages and three viewports.
  for (const locale of ["en", "fr"]) {
    for (const [path, name] of [["", "home"], ["/pricing", "pricing"], ["/industries", "industries"], ["/faq", "faq"], ["/contact", "contact"], ["/sign-up", "sign-up"]]) {
      await auditAllViewports(frVisitor, `/${locale}${path}`, locale, name);
    }
  }

  // 3. Contact form: localized validation, then success.
  await p1.goto(`${BASE}/fr/contact`);
  await p1.getByRole("button", { name: "Envoyer le message" }).click();
  await p1.getByText("Ce champ est obligatoire.").first().waitFor();
  check(await p1.getByText("Saisissez une adresse e-mail valide.").count() === 0, "contact: email error shown before invalid input");
  await p1.getByLabel("Nom complet").fill("Visiteur Test");
  await p1.getByLabel("E-mail").fill("visiteur@example.com");
  await p1.getByLabel("Message").fill("Bonjour, je souhaite une démonstration.");
  await p1.getByRole("button", { name: "Envoyer le message" }).click();
  await p1.getByText("Merci, votre message a bien été envoyé.").waitFor();
  passed++;

  // 4. Sign up in French -> onboarding in French.
  const email = `e2e-${Date.now()}@example.com`;
  const ctx = await browser.newContext({ locale: "fr-FR" });
  const page = await ctx.newPage();
  page.on("dialog", (d) => d.dismiss());
  await page.goto(`${BASE}/fr/sign-up`);
  await page.getByLabel("Nom complet").fill("Camille Martin");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Mot de passe").fill("short");
  await page.getByRole("button", { name: "Créer un compte" }).click();
  await page.getByText("Utilisez au moins 8 caractères.").waitFor();
  check(await page.getByLabel("E-mail").inputValue() === email, "forms: typed input must survive a validation error");
  await page.getByLabel("Mot de passe").fill("motdepasse-solide-42");
  await page.getByRole("button", { name: "Créer un compte" }).click();
  await page.waitForURL("**/fr/app/onboarding");
  await page.getByRole("heading", { name: "Configurez votre espace de travail" }).waitFor();
  await page.getByLabel("Nom de l'entreprise").fill("Atelier Lumière");
  await page.getByRole("checkbox", { name: "Anglais" }).check();
  await page.getByLabel("Langue de communication par défaut").selectOption("fr");
  await page.getByLabel("Fuseau horaire").selectOption("Europe/Paris");
  await page.getByLabel("Devise").selectOption("EUR");
  await page.getByRole("button", { name: "Créer l'espace de travail" }).click();
  await page.waitForURL("**/fr/app");
  await page.getByRole("heading", { name: "Vue d'ensemble" }).waitFor();
  passed++;

  // 5. Leads: localized validation, French number format, data kept as entered.
  await page.goto(`${BASE}/fr/app/leads/new`);
  await page.getByRole("button", { name: "Créer le prospect" }).click();
  await page.getByText("Ce champ est obligatoire.").waitFor();
  passed++;
  const addLead = async (name, locale, value) => {
    await page.goto(`${BASE}/fr/app/leads/new`);
    await page.getByLabel("Nom complet").fill(name);
    await page.getByLabel("Langue préférée").selectOption(locale);
    if (value) await page.getByLabel(/Valeur estimée/).fill(value);
    await page.getByRole("button", { name: "Créer le prospect" }).click();
    await page.waitForURL(/\/fr\/app\/leads\/[0-9a-f-]+\?created=1/);
  };
  await addLead("Jean Dupont", "fr", "1500,50");
  await addLead("Mary Smith", "en", "");
  await page.goto(`${BASE}/fr/app/leads`);
  const listText = await page.locator("main").innerText();
  check(/1\s500,50\s€/.test(listText), "leads: French currency format (1 500,50 €) not found");
  check(listText.includes("Mary Smith") && listText.includes("Jean Dupont"), "leads: names not shown as entered");

  // 6. Template with only a French version: automation cannot be activated.
  await page.goto(`${BASE}/fr/app/automations`);
  await page.locator("#tpl-name").fill("Bienvenue");
  await page.getByRole("button", { name: "Créer le modèle" }).click();
  await page.waitForURL(/automations\/templates\//);
  const templateUrl = page.url();
  const frForm = page.locator('form[lang="fr"]');
  await frForm.getByLabel("Message").fill("Bonjour {{first_name}}, merci de votre intérêt pour {{business_name}} !");
  await frForm.getByRole("button", { name: /Enregistrer la version/ }).click();
  await frForm.getByText("Version enregistrée.").waitFor();
  await page.goto(`${BASE}/fr/app/automations`);
  await page.locator("#auto-name").fill("Accueil des nouveaux prospects");
  await page.getByRole("button", { name: "Créer l'automatisation" }).click();
  await page.getByText("Accueil des nouveaux prospects").first().waitFor();
  check(await page.getByRole("button", { name: /^Activer/ }).isDisabled(), "automation: activation should be blocked while English is missing");
  check(/Manquant\s:\sAnglais/.test(await page.locator("main").innerText()), "automation: missing language not reported");

  // 7. Add the English version, activate, and check the message language follows the lead.
  await page.goto(templateUrl);
  const enForm = page.locator('form[lang="en"]');
  await enForm.getByLabel("Message").fill("Hi {{first_name}}, thanks for your interest in {{business_name}}!");
  await enForm.getByRole("button", { name: /Enregistrer la version/ }).click();
  await enForm.getByText("Version enregistrée.").waitFor();
  await page.goto(`${BASE}/fr/app/automations`);
  await page.getByRole("button", { name: /^Activer/ }).click();
  await page.getByText("Active", { exact: true }).waitFor();
  passed++;
  await addLead("Peter Brown", "en", "");
  await page.goto(`${BASE}/fr/app/conversations`);
  await page.getByRole("link", { name: "Peter Brown" }).click();
  await page.waitForURL(/\/fr\/app\/conversations\/[0-9a-f-]+$/);
  await page.getByRole("heading", { name: "Conversation avec Peter Brown" }).waitFor();
  const convText = await page.locator("main").innerText();
  check(convText.includes("Hi Peter, thanks for your interest in Atelier Lumière!"), "automation: English lead should get the English version while the UI is French");
  check(convText.includes("En attente de validation"), "automation: message should wait for approval");

  // 8. AI without an API key: localized error, nothing generated.
  if (!process.env.ANTHROPIC_API_KEY) {
    await page.getByRole("button", { name: "Suggérer une réponse" }).click();
    await page.getByText("Les fonctions d'IA ne sont pas encore configurées").waitFor();
    passed++;
  }
  const aiLang = await page.getByLabel("Langue de sortie").inputValue();
  check(aiLang === "en", `AI: default output language should follow the lead (en), got ${aiLang}`);

  // 9. Appointment in the business time zone, French formatting.
  await page.goto(`${BASE}/fr/app/appointments`);
  await page.getByLabel("Prospect").selectOption({ label: "Jean Dupont" });
  await page.getByLabel("Date et heure").fill("2026-11-20T10:00");
  await page.getByRole("button", { name: "Planifier le rendez-vous" }).click();
  await page.getByText("Rendez-vous planifié.").waitFor();
  await page.reload();
  check((await page.locator("main").innerText()).includes("20 nov. 2026, 10:00"), "appointments: French date/time in Europe/Paris not found");

  // 10. Unsaved-changes guard on language switch.
  await page.goto(`${BASE}/fr/app/leads/new`);
  await page.getByLabel("Nom complet").fill("Brouillon non enregistré");
  await page.locator("#language-switcher-desktop").selectOption("en");
  await page.waitForTimeout(500);
  check(new URL(page.url()).pathname === "/fr/app/leads/new", "language switch should be cancelled when unsaved changes are declined");

  // 11. Switch language in place: same page, filters kept, still signed in, preference saved.
  await page.goto(`${BASE}/fr/app/leads?status=new&q=Mary`);
  await page.locator("#language-switcher-desktop").selectOption("en");
  await page.waitForURL("**/en/app/leads?**");
  const url = new URL(page.url());
  check(url.searchParams.get("status") === "new" && url.searchParams.get("q") === "Mary", `language switch lost filters: ${page.url()}`);
  await page.getByRole("heading", { name: "Leads" }).waitFor();
  check((await page.locator("main").innerText()).includes("Mary Smith"), "language switch: filtered result missing");
  check(await page.evaluate(() => document.documentElement.lang) === "en", "language switch: html lang not updated");
  check((await page.locator("main").innerText()).includes("New Lead") || (await page.locator("main").innerText()).includes("All statuses"), "English status labels missing");
  await page.goto(`${BASE}/en/app/leads`);
  check(/€1,500\.50/.test(await page.locator("main").innerText()), "English currency format (€1,500.50) not found");

  // Profile preference wins over a French URL inside the app, and over the browser language.
  await page.goto(`${BASE}/fr/app/pipeline`);
  check(new URL(page.url()).pathname === "/en/app/pipeline", `profile preference should redirect /fr/app -> /en/app, got ${page.url()}`);
  await page.goto(`${BASE}/`);
  check(new URL(page.url()).pathname === "/en", `profile preference should win over fr browser language at /, got ${page.url()}`);

  // Persists across sessions: sign out, sign in again from a French page.
  await page.goto(`${BASE}/en/app`);
  await page.locator("aside").getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("**/en");
  await page.goto(`${BASE}/fr/sign-in`);
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Mot de passe").fill("motdepasse-solide-42");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.waitForURL("**/en/app");
  passed++;

  // 12. App screens in both languages and three viewports.
  const appPages = [["", "overview"], ["/leads", "leads"], ["/leads/new", "lead-new"], ["/pipeline", "pipeline"], ["/appointments", "appointments"],
    ["/conversations", "conversations"], ["/automations", "automations"], ["/analytics", "analytics"], ["/integrations", "integrations"],
    ["/settings", "settings"], ["/billing", "billing"]];
  for (const locale of ["en", "fr"]) {
    await page.goto(`${BASE}/${locale === "en" ? "fr" : "en"}/app/settings`);
    await page.locator("#language-switcher-desktop").selectOption(locale);
    await page.waitForURL(`**/${locale}/app/settings`);
    for (const [path, name] of appPages) await auditAllViewports(ctx, `/${locale}/app${path}`, locale, `app-${name}`);
  }
} catch (error) {
  failures.push(`Unexpected error: ${error.message}`);
} finally {
  await browser.close();
}

console.log(`\n${passed} checks passed, ${failures.length} failed`);
if (failures.length) {
  console.log(failures.map((f) => `  ✖ ${f}`).join("\n"));
  process.exit(1);
}
console.log(`Screenshots: ${shots}`);
