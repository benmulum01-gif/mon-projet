#!/usr/bin/env node
/**
 * Localization checks (run in CI with `npm run check:i18n`):
 *  1. every dictionary has exactly the same keys as messages/en.json;
 *  2. no empty translation;
 *  3. no French value identical to English, unless allow-listed;
 *  4. ICU placeholders ({name}, <tag>) match between languages;
 *  5. no hard-coded user-facing text in JSX (src/app, src/components).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const errors = [];

const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) => (typeof v === "object" && v !== null ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]));

const load = (code) => Object.fromEntries(flatten(JSON.parse(readFileSync(join(root, "messages", `${code}.json`), "utf8"))));
const reference = load("en");
const others = readdirSync(join(root, "messages")).filter((f) => f.endsWith(".json") && f !== "en.json").map((f) => f.slice(0, -5));

// Words that are legitimately identical in English and French.
const SAME_ALLOWED = new Set([
  "Common.actions", "Nav.faq", "Nav.contact", "Footer.copyright", "AppNav.label", "AppNav.conversations",
  "AppShell.openMenu", "Contact.form.message", "Channel.sms", "Channel.whatsapp", "Leads.source", "Leads.columns.source",
  "Leads.form.source", "Leads.form.notes", "Conversations.title", "Conversations.columns.messages",
  "Conversations.composer.body", "Conversations.composer.type", "Automations.editor.body", "Appointments.columns.when",
  "Appointments.form.notes", "Appointments.minutes", "Analytics.source", "Integrations.items.messaging.title",
  "Leads.detail.messagesCount", "Automations.active", "Automations.inactive", "Automations.automationsTitle",
  "Leads.detail.conversations", "Footer.whatsapp",
]);

const placeholders = (s) => [...String(s).matchAll(/\{(\w+)[,}]|<(\w+)>/g)].map((m) => m[1] ?? `<${m[2]}>`).sort().join("|");

for (const code of others) {
  const dict = load(code);
  for (const key of Object.keys(reference)) {
    if (!(key in dict)) errors.push(`[${code}] missing key: ${key}`);
  }
  for (const [key, value] of Object.entries(dict)) {
    if (!(key in reference)) errors.push(`[${code}] unknown key (not in en.json): ${key}`);
    if (typeof value !== "string" || !value.trim()) errors.push(`[${code}] empty translation: ${key}`);
    else if (value === reference[key] && !SAME_ALLOWED.has(key)) errors.push(`[${code}] identical to English (untranslated?): ${key} = "${value}"`);
    if (key in reference && placeholders(value) !== placeholders(reference[key])) errors.push(`[${code}] placeholders differ: ${key}`);
  }
}
for (const [key, value] of Object.entries(reference)) {
  if (typeof value !== "string" || !value.trim()) errors.push(`[en] empty translation: ${key}`);
}

// Hard-coded strings: JSX text nodes and user-facing attributes containing letters.
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith(".tsx") ? [p] : [];
});
const ALLOWED_TEXT = new Set(["SAVAN", "404", "✓", "—", "*", "·"]);
for (const file of [...walk(join(root, "src/app")), ...walk(join(root, "src/components"))]) {
  const source = readFileSync(file, "utf8").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  const rel = relative(root, file);
  for (const match of source.matchAll(/>\s*([^<>{}]*[A-Za-zÀ-ÿ][^<>{}]*?)\s*</g)) {
    const text = match[1].trim();
    if (!text || ALLOWED_TEXT.has(text) || /^[\w.]+\(/.test(text) || /=>|&&|\?\?|\|\|/.test(text) || /^[a-z]+[A-Z]\w*$/.test(text)) continue;
    // Skip TypeScript generics / code fragments that are not inside JSX.
    if (/^(string|number|boolean|typeof|HTML\w*|Record|Promise)\b/.test(text) || /^[)\]]/.test(text) || /^[\w.]+$/.test(text) && text.includes(".")) continue;
    if (text.includes(";") || text.includes("(")) continue;
    errors.push(`[code] hard-coded text in ${rel}: "${text}"`);
  }
  for (const match of source.matchAll(/\b(placeholder|aria-label|title|alt)="([^"]*[A-Za-zÀ-ÿ][^"]*)"/g)) {
    errors.push(`[code] hard-coded ${match[1]} in ${rel}: "${match[2]}"`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n✖ ${errors.length} localization problem(s)`);
  process.exit(1);
}
console.log(`✓ ${Object.keys(reference).length} keys, ${others.length + 1} languages, no hard-coded UI text`);
