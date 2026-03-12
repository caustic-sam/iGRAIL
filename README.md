# iGRAIL

Policy intelligence for AI, identity, interoperability, and digital governance.

This repository is intentionally written so a prospective student can learn from it, not just run it. You will find extra comments around authentication boundaries, App Router patterns, fallback logic, and places where framework conventions are easy to misuse.

## What This App Does

iGRAIL combines a public editorial site with a protected publishing workspace:

- Public readers can browse policy updates, analysis, glossary pages, and supporting content.
- Editors can manage articles and media from the `/admin` area.
- The app can run against Supabase or fall back to mock data when credentials are missing.
- FreshRSS can supply live feed data, but the app still renders when that integration is unavailable.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- Supabase for auth, database, and storage
- Jest + ESLint for validation

## Why The Code Is Heavily Commented

The comments are there for learning value:

- Some explain framework rules that are easy to miss, such as why `proxy.ts` and API route guards both exist.
- Some explain React rules, such as why a callback is memoized before an effect depends on it.
- Some explain product decisions, such as why mock mode exists and when it should be used.

If you are studying the codebase, start with the docs index at [docs/README.md](/Users/jm/Projects/iGRAIL/docs/README.md).

## Quick Start

1. Install dependencies.

```bash
pnpm install
```

2. Create local environment variables.

```bash
cp .env.example .env.local
```

3. Start the app.

```bash
pnpm dev
```

4. Open `http://localhost:3000`.

## Environment Variables

These are the important ones for local work:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `FRESHRSS_API_URL`
- `FRESHRSS_API_USERNAME`
- `FRESHRSS_API_PASSWORD`
- `FRESHRSS_RSS_URL`
- `QUICK_POST_SECRET`

If the Supabase public keys are missing, the app will enter mock mode instead of crashing.

## Verification Commands

Use these before merging or deploying:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --runInBand
pnpm validate
pnpm build
```

`pnpm validate` is the main pre-flight command because it runs type checking, linting, and CI-style tests together.

## Project Map

```text
iGRAIL/
├── app/                 # Next.js routes, pages, and API handlers
├── components/          # Shared UI and feature components
├── contexts/            # React context providers such as auth state
├── lib/                 # Data access, guards, helpers, and integrations
├── docs/                # Current documentation plus clearly labeled archives
├── proxy.ts             # Next.js request-time navigation guard
├── next.config.js       # Build/runtime configuration
└── supabase/            # SQL and database support files
```

## Recommended Reading Order

If you are new to the repository:

1. [docs/README.md](/Users/jm/Projects/iGRAIL/docs/README.md)
2. [docs/ARCHITECTURE.md](/Users/jm/Projects/iGRAIL/docs/ARCHITECTURE.md)
3. [AGENT-BRIEFING.md](/Users/jm/Projects/iGRAIL/AGENT-BRIEFING.md)
4. [docs/TESTING-GUIDE.md](/Users/jm/Projects/iGRAIL/docs/TESTING-GUIDE.md)

## Active Documentation

- Architecture: [docs/ARCHITECTURE.md](/Users/jm/Projects/iGRAIL/docs/ARCHITECTURE.md)
- Deployment: [docs/DEPLOYMENT-GUIDE.md](/Users/jm/Projects/iGRAIL/docs/DEPLOYMENT-GUIDE.md)
- Drafts quick-post setup: [docs/DRAFTS-APP-SETUP.md](/Users/jm/Projects/iGRAIL/docs/DRAFTS-APP-SETUP.md)
- Naming conventions: [docs/NOMENCLATURE-TAXONOMY.md](/Users/jm/Projects/iGRAIL/docs/NOMENCLATURE-TAXONOMY.md)
- Testing workflow: [docs/TESTING-GUIDE.md](/Users/jm/Projects/iGRAIL/docs/TESTING-GUIDE.md)
- Agent onboarding: [AGENT-BRIEFING.md](/Users/jm/Projects/iGRAIL/AGENT-BRIEFING.md)

## Notes On Cleanliness

This repository was recently cleaned up to:

- remove tracked backup and export artifacts
- archive dated planning/session documents out of the main surface
- replace the deprecated `middleware.ts` convention with `proxy.ts`
- reduce debug logging from the live application paths

Historical material still exists under `docs/archive/` when it is useful for context, but it should not be treated as the current source of truth.
