# Deployment Guide

This is the current deployment guide for iGRAIL.

## Goal

Ship a build that is:

- type-safe
- lint-clean
- test-clean
- production-build clean

## Pre-Deployment Checks

Run these locally:

```bash
pnpm validate
pnpm build
```

If either fails, stop there. Do not deploy first and diagnose later.

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `QUICK_POST_SECRET`

Optional, depending on features in use:

- `FRESHRSS_API_URL`
- `FRESHRSS_API_USERNAME`
- `FRESHRSS_API_PASSWORD`
- `FRESHRSS_RSS_URL`

## Why Production Needs Extra Attention

For students:

- `pnpm test` does not prove an App Router build will succeed
- `pnpm build` validates server component contracts, route conventions, and production-only code paths
- auth bugs often show up only when the full request pipeline is exercised

That is why the build step is not optional.

## Deployment Flow

1. Confirm your working tree is intentional.
2. Run `pnpm validate`.
3. Run `pnpm build`.
4. Push the branch or deploy through your normal Vercel workflow.
5. Run the post-deployment checklist.

## Post-Deployment Smoke Areas

Verify these paths:

- `/`
- `/login`
- `/admin`
- `/admin/media`
- `/admin/articles/new`
- `/api/health`

If FreshRSS is configured, also verify `/policy-pulse`.

## Known Non-Blocking Warnings

At the time of this cleanup, the main remaining non-blocking warning is stale `baseline-browser-mapping` data. That is worth updating, but it is not the same as a broken deployment.
