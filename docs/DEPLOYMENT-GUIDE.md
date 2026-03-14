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

## GitHub-First Production Flow

This repo now supports a cleaner deployment path:

1. Work on a feature branch.
2. Open a pull request into `main`.
3. Let the `Tests` workflow pass in GitHub.
4. Merge the PR into `main`.
5. GitHub automatically triggers the production Vercel deployment after the `Tests` workflow has already succeeded on that merged commit.

For students:

- this keeps deployment decisions attached to Git history
- it avoids the "tests are green locally, but I deployed something else" problem
- it makes the deploy commit explicit, reviewable, and easy to roll back

## Required GitHub Settings

The workflow file alone is not enough. Set this in the GitHub repository settings:

1. Protect the `main` branch.
2. Require pull requests before merging.
3. Require the status checks from the `Tests` workflow before merge.
4. Optionally require one review approval if you want a human gate before production.

If your Vercel project is also using direct Git-based auto-deploys, disable that path or you will create duplicate production deployments.

## Local Pre-Merge Flow

1. Confirm your working tree is intentional.
2. Run `pnpm validate`.
3. Run `pnpm build`.
4. Push your branch and open the PR.
5. After merge, run the post-deployment checklist.

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
