# SAVAN — Intelligent Business Systems

Bilingual (English / French) SaaS that helps businesses turn leads into customers:
leads, pipeline, appointments, conversations, automations with approval, an AI
assistant (Claude) and subscriptions (Stripe).

## Stack

- Next.js 16 (App Router, `src/proxy.ts`), React 19, TypeScript, Tailwind CSS 4
- next-intl 4 — routes `/en/...` and `/fr/...`, dictionaries in `messages/`
- Supabase — Postgres with row-level security, email/password auth
- Claude API (`@anthropic-ai/sdk`) — replies, summaries, translation, template drafts
- Stripe — Checkout, customer portal, webhook

## Getting started

```bash
npm install
npx supabase start            # local Postgres + Auth (Docker)
npx supabase status -o env    # copy ANON_KEY / SERVICE_ROLE_KEY into .env.local
cp .env.example .env.local    # then fill in the values
npm run dev                   # http://localhost:3000
```

Optional keys: `ANTHROPIC_API_KEY` (AI features show "not configured" without it),
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`.
Locally, forward webhooks with `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## Checks

| Command | What it does |
|---|---|
| `npm run check` | typecheck + lint + localization check + unit tests |
| `npm run check:i18n` | same keys in every language, no empty or untranslated value, matching placeholders, no hard-coded UI text |
| `npm test` | unit tests (locale resolution, formatting, template language choice, AI language rules) |
| `npm run test:db` | pgTAP tests: RLS isolation, immutable originals, translation guard on automations |
| `npm run test:e2e` | full journey in both languages on desktop/tablet/mobile (needs `npm run build && npm start` and local Supabase) |

## Documentation

- [docs/LOCALIZATION.md](docs/LOCALIZATION.md) — how languages work in SAVAN
- [docs/ADDING_A_LANGUAGE.md](docs/ADDING_A_LANGUAGE.md) — adding a third language
