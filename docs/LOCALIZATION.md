# Localization in SAVAN

## Four separate language settings

They are stored separately and never inferred from one another.

| Setting | Where | Used for |
|---|---|---|
| Interface language | `profiles.ui_locale` + `NEXT_LOCALE` cookie | Menus, buttons, errors, notifications |
| Workspace communication languages | `workspaces.comm_locales`, `workspaces.default_comm_locale` | Which template versions are required; fallback language for prospects |
| Communication language | `leads.preferred_locale`, `conversations.locale` | Automated messages, AI replies, inserted templates |
| Internal AI language | `workspaces.internal_ai_locale` (null = reader's interface language) | AI summaries for the team |

User-entered data (names, emails, notes, messages) is stored as entered and never translated
automatically. Translation of a message is an explicit action; the result is stored in
`message_translations`, and a database trigger forbids rewriting the original.

## Interface language resolution

`src/i18n/resolve-locale.ts` and `src/proxy.ts`:

1. Saved profile preference (signed-in users)
2. Device preference (`NEXT_LOCALE` cookie, one year)
3. Language in the URL
4. Browser `Accept-Language`
5. English

Applied as follows:
- URL without a language (`/`, `/pricing`): full order above, then redirect to `/en/...` or `/fr/...`.
- Application (`/xx/app/...`): the profile preference wins over the URL; a French user opening an
  English link is redirected to the French page.
- Public pages with an explicit language (`/en/pricing`): the URL is honoured, so shared links and
  search-engine results show the language they announce (`hreflang` alternates are declared).

The selector keeps the current page and query string (filters), does not sign the user out,
saves the choice to the cookie and the profile, and asks before discarding unsaved form input.

## Communication language rules

- Templates and automations: conversation language → lead language → workspace default.
  The interface language is never used (`src/lib/automations/render.ts`).
- An automation cannot be activated while its template lacks a version for one of the workspace
  communication languages (enforced by the database). Removing a version or adding a
  communication language deactivates affected automations.
- Automated and AI messages are created as `pending_approval` / `draft`; nothing is sent without a
  human. Channel integrations are not connected yet.
- AI output language defaults per `src/lib/ai/language.ts` and can always be changed per request.

## Formatting

`src/lib/format.ts`: interface language picks conventions (`en-US`, `fr-FR`); the workspace picks
time zone and currency. Timestamps are stored in UTC (`timestamptz`) and rendered in the workspace
time zone. Appointment inputs are read in the workspace time zone.

## Dictionaries

- `messages/en.json` is the reference; TypeScript checks every key used in code against it.
- `npm run check:i18n` enforces parity, flags untranslated values and hard-coded JSX text.
- French typography: narrow no-break space before `? ! : ;`.
- Enum values (`new`, `appointment_booked`…) are stable identifiers in the database; only their
  labels are translated (`LeadStatus`, `Channel`, … namespaces).

## Known gaps

- Supabase Auth emails (confirmation, password reset) use the project's templates and are not yet
  localized. Supabase supports per-language content via `{{ .Data.ui_locale }}` in the templates.
- Password reset screens are not built yet.
- Plan features shown on the pricing page are not enforced per plan in the application.
- Plan prices in `src/config/plans.ts` are placeholders.
