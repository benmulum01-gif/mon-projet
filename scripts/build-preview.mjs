#!/usr/bin/env node
/**
 * Builds a static preview of SAVAN for Netlify (drag-and-drop deploy).
 *
 *   npm run preview        # fresh screenshots (build + start + e2e) then zip
 *   npm run preview:zip    # only re-package the existing screenshots
 *
 * Input:  tests/e2e/screenshots/<page>-<locale>-<device>.png (written by the e2e journey)
 * Output: preview/site/ (static gallery) and preview/savan-preview.zip
 *
 * The real application needs a server (accounts, database, AI), so it cannot run
 * from a zip: this preview shows every page as it really renders.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const shotsDir = join(root, "tests/e2e/screenshots");
const outDir = join(root, "preview/site");
const zipPath = join(root, "preview/savan-preview.zip");

const LINKS = {
  repo: "https://github.com/benmulum01-gif/mon-projet/tree/claude/chat-session-dhea9y",
  mockups: "https://claude.ai/artifact/RDGwPNj4mSriw7XLzLEHpx",
  prompts: "https://github.com/benmulum01-gif/mon-projet/blob/claude/chat-session-dhea9y/docs/PROMPTS-MAQUETTES.md",
  compliance: "https://github.com/benmulum01-gif/mon-projet/blob/claude/chat-session-dhea9y/docs/CONFORMITE.md",
};

/** Page id (screenshot prefix) -> group, French label, URL path. */
const PAGES = [
  ["home", "Site public", "Accueil", "/"],
  ["pricing", "Site public", "Tarifs (sur devis)", "/pricing"],
  ["industries", "Site public", "Secteurs", "/industries"],
  ["faq", "Site public", "Questions fréquentes", "/faq"],
  ["contact", "Site public", "Contact et devis", "/contact"],
  ["book", "Site public", "Prendre rendez-vous", "/book"],
  ["sign-up", "Site public", "Créer un compte", "/sign-up"],
  ["consent-banner", "Cookies", "Bandeau cookies", "/"],
  ["consent-details", "Cookies", "Choix par finalité", "/"],
  ["legal-notice", "Pages légales", "Mentions légales", "/legal/notice"],
  ["legal-privacy", "Pages légales", "Politique de confidentialité", "/legal/privacy"],
  ["legal-cookies", "Pages légales", "Politique de cookies", "/legal/cookies"],
  ["legal-terms-of-sale", "Pages légales", "Conditions générales de vente", "/legal/terms-of-sale"],
  ["legal-terms-of-use", "Pages légales", "Conditions générales d'utilisation", "/legal/terms-of-use"],
  ["legal-accessibility", "Pages légales", "Déclaration d'accessibilité", "/legal/accessibility"],
  ["app-overview", "Application", "Vue d'ensemble", "/app"],
  ["app-leads", "Application", "Prospects", "/app/leads"],
  ["app-lead-new", "Application", "Ajouter un prospect", "/app/leads/new"],
  ["app-pipeline", "Application", "Pipeline commercial", "/app/pipeline"],
  ["app-appointments", "Application", "Rendez-vous", "/app/appointments"],
  ["app-conversations", "Application", "Conversations", "/app/conversations"],
  ["app-automations", "Application", "Automatisations", "/app/automations"],
  ["app-analytics", "Application", "Analyses", "/app/analytics"],
  ["app-integrations", "Application", "Intégrations", "/app/integrations"],
  ["app-settings", "Application", "Paramètres", "/app/settings"],
];
const LOCALES = ["fr", "en"];
const DEVICES = [["desktop", "Ordinateur"], ["tablet", "Tablette"], ["mobile", "Mobile"]];

if (!existsSync(shotsDir)) {
  console.error("No screenshots found. Run `npm run preview` (or build, start and `npm run test:e2e`) first.");
  process.exit(1);
}
const available = new Set(readdirSync(shotsDir).filter((f) => f.endsWith(".png")));

rmSync(join(root, "preview"), { recursive: true, force: true });
mkdirSync(join(outDir, "shots"), { recursive: true });

const hasConvert = (() => {
  try {
    execFileSync("convert", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

/** Resize to 1280px wide WebP when ImageMagick is available, otherwise copy the PNG. */
function addShot(file) {
  const src = join(shotsDir, file);
  if (hasConvert) {
    const name = file.replace(/\.png$/, ".webp");
    execFileSync("convert", [src, "-resize", "1280x>", "-quality", "78", join(outDir, "shots", name)]);
    return `shots/${name}`;
  }
  copyFileSync(src, join(outDir, "shots", file));
  return `shots/${file}`;
}

const entries = [];
for (const [id, group, label, path] of PAGES) {
  const shots = {};
  for (const locale of LOCALES) {
    for (const [device] of DEVICES) {
      const file = `${id}-${locale}-${device}.png`;
      if (available.has(file)) shots[`${locale}-${device}`] = addShot(file);
    }
  }
  if (Object.keys(shots).length) entries.push({ id, group, label, path, shots });
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const builtAt = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });
const groups = [...new Set(entries.map((e) => e.group))];

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>SAVAN · Prévisualisation</title>
<style>
:root { --bg:#f6f8fb; --fg:#0f172a; --muted:#475569; --line:#d8dee8; --card:#fff; --accent:#0b5858; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root { --bg:#0f141b; --fg:#e8edf4; --muted:#a7b1c2; --line:#273140; --card:#161d27; --accent:#5fc4c4; color-scheme: dark; } }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--fg); font:16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
.wrap { max-width:1200px; margin:0 auto; padding:24px max(16px, env(safe-area-inset-left)) 64px; }
header h1 { margin:0; font-size:28px; }
header p { margin:6px 0 0; color:var(--muted); max-width:70ch; }
.links { display:flex; flex-wrap:wrap; gap:8px; margin:16px 0 8px; }
.links a { padding:8px 12px; border:1px solid var(--line); border-radius:8px; color:var(--accent); background:var(--card); text-decoration:none; font-weight:600; font-size:14px; }
.controls { position:sticky; top:0; z-index:5; display:flex; flex-wrap:wrap; gap:12px; align-items:center; padding:12px 0; background:var(--bg); border-bottom:1px solid var(--line); }
.controls label { font-size:14px; color:var(--muted); display:flex; gap:6px; align-items:center; }
select { font:inherit; padding:6px 8px; border-radius:6px; border:1px solid var(--line); background:var(--card); color:var(--fg); }
nav.toc { display:flex; flex-wrap:wrap; gap:6px 14px; margin:16px 0; font-size:14px; }
nav.toc a { color:var(--accent); }
h2 { margin:36px 0 12px; font-size:20px; }
.grid { display:grid; gap:20px; grid-template-columns:repeat(auto-fill, minmax(min(100%, 340px), 1fr)); }
figure { margin:0; background:var(--card); border:1px solid var(--line); border-radius:10px; overflow:hidden; display:flex; flex-direction:column; }
figure .frame { height:420px; overflow:auto; background:var(--line); }
figure img { display:block; width:100%; height:auto; }
figcaption { padding:10px 12px; display:flex; flex-wrap:wrap; justify-content:space-between; gap:6px; font-size:14px; }
figcaption code { color:var(--muted); }
figcaption a { color:var(--accent); font-weight:600; }
.missing { padding:24px; color:var(--muted); font-size:14px; }
.note { margin-top:40px; padding:16px; border:1px solid var(--line); border-radius:10px; background:var(--card); color:var(--muted); font-size:14px; }
</style>
</head>
<body>
<div class="wrap">
<header>
  <h1>SAVAN · Prévisualisation</h1>
  <p>Toutes les pages du site et de l'application, telles qu'elles s'affichent réellement, en français et en anglais, sur ordinateur, tablette et mobile. Générée le ${esc(builtAt)}.</p>
  <div class="links">
    <a href="${LINKS.mockups}">Maquettes des directions visuelles</a>
    <a href="${LINKS.prompts}">Prompts ChatGPT des maquettes</a>
    <a href="${LINKS.compliance}">Conformité légale</a>
    <a href="${LINKS.repo}">Code sur GitHub</a>
  </div>
</header>
<div class="controls">
  <label for="locale">Langue <select id="locale"><option value="fr">Français</option><option value="en">English</option></select></label>
  <label for="device">Écran <select id="device">${DEVICES.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select></label>
</div>
<nav class="toc" aria-label="Sections">${groups.map((g) => `<a href="#${esc(g.toLowerCase().replace(/\W+/g, "-"))}">${esc(g)}</a>`).join("")}</nav>
${groups
  .map(
    (g) => `<section id="${esc(g.toLowerCase().replace(/\W+/g, "-"))}"><h2>${esc(g)}</h2><div class="grid">${entries
      .filter((e) => e.group === g)
      .map(
        (e) => `<figure data-shots='${esc(JSON.stringify(e.shots))}'>
  <div class="frame"><img alt="${esc(e.label)}" loading="lazy" src="${esc(Object.values(e.shots)[0])}"></div>
  <figcaption><strong>${esc(e.label)}</strong><code class="path">${esc(e.path)}</code><a class="full" href="${esc(Object.values(e.shots)[0])}">Taille réelle</a></figcaption>
</figure>`,
      )
      .join("")}</div></section>`,
  )
  .join("\n")}
<p class="note">Aperçu statique : les liens, formulaires et comptes ne fonctionnent pas ici. Les contenus marqués « À COMPLÉTER » sont des informations légales encore à renseigner. Les noms, biens et chiffres visibles sont des données de test. Ne pas diffuser publiquement avant la mise en conformité finale.</p>
</div>
<script>
const locale = document.getElementById("locale"), device = document.getElementById("device");
function render() {
  const key = locale.value + "-" + device.value;
  document.querySelectorAll("figure").forEach((fig) => {
    const shots = JSON.parse(fig.dataset.shots), src = shots[key];
    const frame = fig.querySelector(".frame"), link = fig.querySelector(".full");
    if (src) {
      frame.innerHTML = '<img loading="lazy" alt="' + fig.querySelector("strong").textContent + '" src="' + src + '">';
      link.href = src; link.hidden = false;
    } else {
      frame.innerHTML = '<p class="missing">Pas de capture pour cet écran dans cette combinaison.</p>';
      link.hidden = true;
    }
    fig.querySelector(".path").textContent = "/" + locale.value + (fig.dataset.path || "");
  });
  try { localStorage.setItem("savan-preview", key); } catch {}
}
document.querySelectorAll("figure").forEach((fig, i) => (fig.dataset.path = ${JSON.stringify(entries.map((e) => (e.path === "/" ? "" : e.path)))}[i]));
try { const saved = localStorage.getItem("savan-preview"); if (saved) { const [l, d] = saved.split("-"); locale.value = l; device.value = d; } } catch {}
locale.addEventListener("change", render); device.addEventListener("change", render); render();
</script>
</body>
</html>
`;

writeFileSync(join(outDir, "index.html"), html);
// Keep the preview out of search engines (it contains placeholders and test data).
writeFileSync(join(outDir, "robots.txt"), "User-agent: *\nDisallow: /\n");
writeFileSync(join(outDir, "_headers"), "/*\n  X-Robots-Tag: noindex, nofollow\n");

execFileSync("zip", ["-qr", zipPath, "."], { cwd: outDir });
const count = entries.reduce((n, e) => n + Object.keys(e.shots).length, 0);
console.log(`✓ ${entries.length} pages, ${count} captures → ${zipPath}`);
