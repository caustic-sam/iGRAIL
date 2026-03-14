# iGRAIL Deployment Game Plan

**Date:** March 15, 2026  
**Workstream:** iGRAIL Launch Readiness  
**Primary Goal:** Stand up public deployment infrastructure for iGRAIL, remove avoidable LAN dependencies, and prove the GitHub-gated production path with one small safe release.

## Executive Summary

Tomorrow is not a feature day.

Tomorrow is an infrastructure and release-discipline day.

The target outcome is simple:

- iGRAIL has its own Vercel project
- iGRAIL has its own Supabase project strategy
- GitHub is the gate for production deployments
- production secrets live in the correct systems
- one small merge to `main` proves that the deployment path works end to end

If we achieve those five outcomes, the codebase moves from "clean locally" to "operationally shippable."

## Brand Positioning For This Work

iGRAIL is now past the naming phase and into the reliability phase.

That means tomorrow's work should reflect the product identity:

- clear ownership boundaries
- clean deployment discipline
- no shared production infrastructure with unrelated projects
- no hidden local-network assumptions
- no "I think it deployed" workflow

For students:

- a product becomes real when infrastructure, release flow, and rollback thinking are treated as part of the product
- deployment is not a side task after development
- deployment is part of engineering quality

## Decisions To Lock Before Starting

These are the working decisions for tomorrow unless you explicitly change them:

1. iGRAIL gets its own Vercel project.
2. iGRAIL gets its own Supabase production project.
3. iGRAIL also gets a non-production Supabase environment, either as a separate project or a managed branch strategy.
4. GitHub merge-to-`main` is the source of truth for production deploys.
5. LAN-only dependencies are treated as temporary development dependencies, not production architecture.

## Desired End State By End Of Day

By the end of the session, all of this should be true:

- a dedicated Vercel project exists for iGRAIL
- the repo is linked to the correct Vercel project identifiers
- GitHub secrets for Vercel deployment are configured
- Vercel environment variables are configured for the iGRAIL app
- a dedicated Supabase project exists for iGRAIL production
- auth callback URLs are correct for local and production
- at least one published featured article exists for homepage and Think Tank validation
- the FreshRSS production strategy is explicitly chosen:
  - public endpoint
  - tunnel/proxy
  - or deliberate mock fallback until later
- a trivial pull request can be merged and automatically deployed through GitHub

## Workstreams

## 1. Vercel Project Setup

**Objective:** Create a clean deployment target for the application.

### Tasks

- Create a dedicated Vercel project for the iGRAIL repo.
- Confirm the production domain strategy for iGRAIL.
- Capture:
  - `VERCEL_PROJECT_ID`
  - `VERCEL_ORG_ID`
- Generate or confirm a `VERCEL_TOKEN` for GitHub Actions.
- Make sure the Vercel project is not sharing environment variables or domains with unrelated projects.

### Why This Matters

For students:

- Vercel projects are deployment boundaries
- sharing a project across unrelated apps creates config confusion and raises rollback risk
- a dedicated project makes ownership, troubleshooting, and auditing much simpler

## 2. GitHub-As-Gate Release Setup

**Objective:** Ensure production deployment happens only after code has passed through GitHub checks.

### Tasks

- Confirm the updated workflow in `.github/workflows/vercel.yml` is present on the branch that will be merged.
- In GitHub repository settings:
  - protect `main`
  - require pull requests before merge
  - require the `Tests` workflow before merge
  - optionally require approval review
- Confirm Vercel direct Git auto-production is disabled if GitHub Actions is the deployment source of truth.

### Success Signal

When a PR merges into `main`, the `Tests` workflow completes successfully first, and only then does the production Vercel deployment start.

## 3. Supabase Environment Setup

**Objective:** Give iGRAIL a dedicated backend boundary and production-safe configuration.

### Tasks

- Create a dedicated Supabase production project for iGRAIL.
- Choose one non-production path:
  - a separate staging/dev project
  - or Supabase branching if that is the preferred operating model
- Record the correct values for:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Configure auth redirect URLs for:
  - local development
  - production
- Confirm schema parity for the `authors` table and public content fields.

### Important Note

The recent smoke test exposed a schema reality gap:

- parts of the code and schema docs expect an author `title`
- the live environment did not currently expose that field

That means tomorrow should include one explicit schema verification step before calling the backend "ready."

## 4. Public Content Readiness

**Objective:** Make production visually testable with real content.

### Tasks

- Seed at least one published article.
- Mark at least one article as featured.
- Confirm homepage and Think Tank views can render meaningful content.
- If possible, seed a small stable demo dataset for:
  - articles
  - feeds
  - media

### Why This Matters

A deployment that is technically healthy but visually empty is hard to validate.

For students:

- test data is part of release readiness
- without stable content, QA becomes guesswork

## 5. LAN Dependency Review

**Objective:** Decide whether production can safely depend on FreshRSS and similar external systems.

### Current Known Risk

Local testing showed that the current FreshRSS configuration points to a LAN-restricted host and falls back to mock data when unreachable.

### Tomorrow's Decision

Pick one path deliberately:

1. Move FreshRSS to a publicly reachable endpoint.
2. Publish it safely through a tunnel or reverse proxy.
3. Keep mock fallback for now and formally treat FreshRSS as a later infrastructure milestone.

### Recommendation

Do not call the deployment system "done" while production still depends on a private LAN host that Vercel cannot reach.

## 6. First Safe Deployment

**Objective:** Prove the deployment path without risking application behavior.

### Deployment Candidate

Use a tiny documentation-only or copy-only pull request.

Examples:

- one sentence in `README.md`
- one sentence in `docs/DEPLOYMENT-GUIDE.md`

### Required Sequence

1. create feature branch
2. make one tiny safe change
3. run `pnpm validate`
4. run `pnpm build`
5. push branch
6. open PR
7. wait for GitHub tests
8. merge to `main`
9. confirm production deploy starts automatically
10. smoke test production

## Proposed Schedule

## Phase 1: Infrastructure Decisions

**Target:** 45-60 minutes

- create or verify Vercel project
- create or verify Supabase production boundary
- choose non-production Supabase strategy
- confirm whether FreshRSS is staying LAN-bound or moving public

## Phase 2: Secrets And Environment Variables

**Target:** 30-45 minutes

- populate GitHub secrets for deployment
- populate Vercel production environment variables
- verify auth redirect values

## Phase 3: Backend And Content Readiness

**Target:** 45-60 minutes

- verify schema parity
- seed one featured published article
- confirm homepage/blog visual readiness

## Phase 4: Release Gate Proof

**Target:** 30-45 minutes

- make tiny PR
- wait for tests
- merge
- confirm deploy

## Phase 5: Post-Deploy Smoke Test

**Target:** 15-20 minutes

- `/`
- `/login`
- `/api/health`
- one public content page
- one protected route redirect

## Detailed Checklist

## Vercel Checklist

- [ ] Create separate iGRAIL Vercel project
- [ ] Add iGRAIL production domain
- [ ] Capture `VERCEL_PROJECT_ID`
- [ ] Capture `VERCEL_ORG_ID`
- [ ] Generate `VERCEL_TOKEN`
- [ ] Add GitHub secrets
- [ ] Add Vercel environment variables
- [ ] Disable duplicate direct production auto-deploy if GitHub Actions is the official path

## GitHub Checklist

- [ ] Protect `main`
- [ ] Require PR before merge
- [ ] Require `Tests` status checks
- [ ] Optionally require review approval
- [ ] Confirm merge to `main` is the only production release trigger

## Supabase Checklist

- [ ] Create iGRAIL production project
- [ ] Create or choose non-production environment strategy
- [ ] Set local + production auth redirects
- [ ] Verify schema parity for public content
- [ ] Confirm service role key is only used server-side
- [ ] Seed one featured published article

## Dependency Checklist

- [ ] Decide FreshRSS public-access strategy
- [ ] Confirm whether video feed identifiers are valid
- [ ] Decide whether mock fallback is acceptable for first production release

## Production Smoke Checklist

- [ ] Homepage loads
- [ ] Login page loads
- [ ] `/api/health` returns healthy response
- [ ] Public article surface renders real content
- [ ] Admin routes redirect correctly when signed out
- [ ] No surprise production-only auth regression

## Risks

## Risk 1: Duplicate Deploy Paths

If Vercel Git auto-deploy and GitHub Actions both deploy production, releases become ambiguous.

**Mitigation:** Use one source of truth. Prefer GitHub Actions for gated release control.

## Risk 2: LAN-Bound Integrations

If FreshRSS stays on a private network, production deployment can be green while production features silently degrade to mock data.

**Mitigation:** Move it public, tunnel it, or officially defer it.

## Risk 3: Schema Drift

If the live Supabase schema does not match the app assumptions, public pages can fail even when CI passes.

**Mitigation:** verify the live schema before calling deployment complete.

## Risk 4: Empty Production QA Surface

If there is no featured or published content, visual QA cannot confirm that public reading paths truly work.

**Mitigation:** seed a stable minimum dataset.

## Jira Import Follow-Up

The deployment planning epic was imported into Jira on March 14, 2026, and the issues were created successfully as `IG-1` through `IG-16`.

However, the import log in [JIRA Import Errrors.txt](/Users/jm/Projects/iGRAIL/docs/jira/JIRA%20Import%20Errrors.txt) showed a repeated configuration mismatch:

- Jira warned that values like `Infrastructure`, `Backend`, `Integrations`, `Content`, `Maintenance`, and `Release Management` did not exist in the project.

That strongly suggests the CSV field mapping for `Component/s` did not line up with the target Jira project configuration.

Before the next import round, decide one clean fix:

1. create the corresponding Jira components in the `IG` project
2. remove the `Component/s` column from future import files
3. remap that column to a field that actually exists in the project

For tomorrow's deployment session, this is not a blocker to the actual platform work, but it is worth cleaning up before the next planning import so the Jira structure stays intentional.

## Definition Of Done

Tomorrow counts as successful when:

- infrastructure decisions are explicit
- secrets are set correctly
- the release path is GitHub-gated
- production can reach the services it needs
- a tiny PR deploys automatically after merge
- smoke checks pass

## Suggested Close-Out Notes

When tomorrow's session ends, record:

- what was created
- what was deferred
- what still depends on LAN infrastructure
- what environment variables are now managed in Vercel
- whether the first GitHub-gated production deploy succeeded

That note becomes the starting point for the next feature sprint.
