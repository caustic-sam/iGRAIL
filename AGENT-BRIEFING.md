# Agent Briefing

This file is the short onboarding guide for any coding agent working in iGRAIL.

## Project Snapshot

- Name: iGRAIL
- Purpose: policy intelligence platform for AI, identity, interoperability, and digital governance
- Stack: Next.js 16, React 19, TypeScript, Tailwind 4, Supabase
- Style: code should be readable by prospective students, which means comments should explain non-obvious decisions

## First Files To Read

1. [README.md](/Users/jm/Projects/iGRAIL/README.md)
2. [docs/README.md](/Users/jm/Projects/iGRAIL/docs/README.md)
3. [docs/ARCHITECTURE.md](/Users/jm/Projects/iGRAIL/docs/ARCHITECTURE.md)

## Important Current Conventions

- Request-time route protection lives in [proxy.ts](/Users/jm/Projects/iGRAIL/proxy.ts).
- Admin API authorization lives in [lib/route-guards.ts](/Users/jm/Projects/iGRAIL/lib/route-guards.ts).
- Mock mode is intentional and should remain understandable.
- Normal runtime paths should avoid noisy `console.log` output.
- Comments should teach, especially around auth, React effects, and framework conventions.

## Documentation Policy

Active docs live in `docs/`.

If you find a stale session note, release plan, or one-off investigation:

- move it under `docs/archive/`
- do not leave it in the active root surface
- update an active replacement doc if the old file still contains important instructions

## Before You Finish A Change

Run the standard verification set:

```bash
pnpm validate
pnpm build
```

If your changes are local to one area, lighter checks are acceptable during iteration, but the final handoff should still mention what was and was not verified.
