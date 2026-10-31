# Adding a language

Example: Spanish (`es`).

1. **Code** — add the code to `locales`, `localeNames` and `formattingLocales` in `src/i18n/config.ts`.
2. **Dictionary** — copy `messages/en.json` to `messages/es.json` and translate every value.
   Keep keys, `{placeholders}` and `<tags>` unchanged. Add the new language name under
   `Languages` in **every** dictionary.
3. **Database** — new migration:
   ```sql
   insert into public.locales (code, english_name, native_name) values ('es', 'Spanish', 'Español');
   ```
4. **AI** — add the English name to `LANGUAGE_NAMES` in `src/lib/ai/claude.ts`.
5. **Checks** — `npm run check:i18n` (parity, untranslated values), `npm test`, then
   `npm run test:e2e` after extending the locale lists in `tests/e2e/run.mjs`.
6. **Review** — have a native speaker review the dictionary, then test long labels on mobile.

Routing, the language selector, sitemap/hreflang, formatting, templates (one version per
communication language) and the AI language pickers all derive from `locales` and need no change.
