#!/usr/bin/env node
// Lists company/legal fields still to complete in src/config/company.ts.
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("../src/config/company.ts", import.meta.url), "utf8");
const block = src.slice(src.indexOf("export const company"), src.indexOf("} as const;"));
const missing = [];
const stack = [];
for (const line of block.split("\n")) {
  const open = line.match(/^\s*(\w+): \{\s*$/);
  if (open) { stack.push(open[1]); continue; }
  if (/^\s*\},?\s*$/.test(line)) { stack.pop(); continue; }
  for (const m of line.matchAll(/(\w+): null as Maybe/g)) missing.push([...stack, m[1]].join("."));
}
if (missing.length) {
  console.log(`⚠ ${missing.length} legal field(s) to complete in src/config/company.ts before launch:`);
  console.log(missing.map((f) => `  - ${f}`).join("\n"));
  process.exit(process.argv.includes("--strict") ? 1 : 0);
}
console.log("✓ all legal fields completed");
