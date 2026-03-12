# Testing Guide

This is the current testing workflow for the cleaned iGRAIL branch.

## Why There Are Multiple Commands

Different commands catch different classes of mistakes:

- `pnpm lint` catches style issues and some framework misuse
- `pnpm typecheck` catches type contract drift
- `pnpm test -- --runInBand` exercises the Jest suite
- `pnpm build` verifies that App Router and production-only rules still hold
- `pnpm validate` is the main all-in-one pre-flight command

## Daily Developer Loop

Use this loop while building features:

```bash
pnpm lint
pnpm typecheck
pnpm test -- --runInBand
```

Run `pnpm build` before handing work off or shipping anything substantial.

## Pre-Merge Checklist

```bash
pnpm validate
pnpm build
```

Why both?

- `pnpm validate` covers type checking, linting, and tests
- `pnpm build` catches production-only framework issues that do not always appear in tests

## Manual Testing Suggestions

After the automated checks pass, verify these flows manually:

1. Public homepage loads without console spam or layout breakage.
2. Login redirects correctly for unauthenticated admin navigation.
3. Admin article create/edit/delete flows still work.
4. Media upload, preview, and delete actions still work.
5. Feed fallbacks behave sensibly when FreshRSS is absent.

## Expected Noise Versus Real Failures

Some warnings are environmental rather than application bugs:

- stale `baseline-browser-mapping` data
- missing optional integration credentials in local environments

Treat build failures, auth regressions, and API authorization issues as blocking. Treat cosmetic or data-age warnings as follow-up items unless they affect functionality.
