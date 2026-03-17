# iGRAIL Soft Launch Playbook — March 16, 2026

## Overview

This document covers three parallel workstreams for getting iGRAIL to a credible soft-launch state. It is intended for the code agent, the infra operator (James), and as a content inventory.

---

## TRACK 1: Content Inventory (Ready to Seed)

We have **5 articles** ready to publish. These satisfy **IG-34** ("Publish 3-5 real articles for launch content") and **IG-11** ("Seed at least one published featured article").

| # | Title | Type | Status | Featured? |
|---|-------|------|--------|-----------|
| 1 | NIST's AI Standards Offensive: The Architecture of American AI Dominance | Deep Dive | Ready (HTML file) | **Yes — lead featured** |
| 2 | The Observatory: Global AI Law & Policy Digest — Issue 002 | Weekly Digest | Ready (HTML file) | No |
| 3 | When AI Talks to Your Lawyer: The Heppner Privilege Ruling Explained | Analysis Article | Ready (HTML file) | No |
| 4 | Fifty Experiments: The U.S. State AI Law Patchwork in 2026 | Analysis Article | Ready (HTML file) | No |
| 5 | The Observatory: About & Mission Statement | Institutional Page | Ready (HTML file) | No |

### Supabase Seeding Data

For each article, insert into the `articles` table (or equivalent) with these fields:

**Article 1 — NIST Deep Dive (FEATURED)**
- `title`: "NIST's AI Standards Offensive: The Architecture of American AI Dominance"
- `slug`: "nist-ai-standards-offensive-2026"
- `excerpt`: "On March 6, 2026, NIST laid out its full playbook for shaping global AI standards. Here's what boards, counsel, and compliance leaders need to extract from the 51-slide briefing."
- `category`: "deep-dive"
- `tags`: ["NIST", "AI standards", "ISO/IEC", "CAISI", "compliance"]
- `author`: "The iGRAIL Editorial Desk"
- `published_at`: "2026-03-16T12:00:00Z"
- `is_featured`: true
- `status`: "published"

**Article 2 — Issue 002 Digest**
- `title`: "Weekly Digest — Issue 002: March 6–13, 2026"
- `slug`: "digest-002-march-2026"
- `excerpt`: "EU Council pushes high-risk AI deadlines to 2027–2028, Supreme Court settles AI authorship, Oregon passes chatbot bill with private right of action."
- `category`: "digest"
- `tags`: ["EU AI Act", "Omnibus VII", "Thaler v Perlmutter", "state AI laws"]
- `author`: "The iGRAIL Editorial Desk"
- `published_at`: "2026-03-13T12:00:00Z"
- `is_featured`: false
- `status`: "published"

**Article 3 — Heppner Ruling**
- `title`: "When AI Talks to Your Lawyer: The Heppner Privilege Ruling Explained"
- `slug`: "heppner-ai-privilege-ruling"
- `excerpt`: "A federal judge ruled that conversations with AI chatbots aren't protected by attorney-client privilege. Here's what every legal department needs to know."
- `category`: "analysis"
- `tags`: ["attorney-client privilege", "Heppner", "litigation", "AI tools"]
- `author`: "The iGRAIL Editorial Desk"
- `published_at`: "2026-03-15T12:00:00Z"
- `is_featured`: false
- `status`: "published"

**Article 4 — State AI Law Patchwork**
- `title`: "Fifty Experiments: The U.S. State AI Law Patchwork in 2026"
- `slug`: "us-state-ai-law-patchwork-2026"
- `excerpt`: "Oregon, Washington, Colorado, Arizona — U.S. states are writing AI law faster than Congress. Here's the map of what's happening and why it matters."
- `category`: "analysis"
- `tags`: ["state AI laws", "Oregon", "Colorado", "Washington", "federal preemption"]
- `author`: "The iGRAIL Editorial Desk"
- `published_at`: "2026-03-14T12:00:00Z"
- `is_featured`: false
- `status`: "published"

**Article 5 — About / Mission**
- `title`: "About The Observatory"
- `slug`: "about"
- `excerpt`: "Decision-grade intelligence for boards, counsel, and compliance leaders navigating global AI governance."
- `category`: "institutional"
- `tags`: ["about", "mission"]
- `author`: "The iGRAIL Editorial Desk"
- `published_at`: "2026-03-16T10:00:00Z"
- `is_featured`: false
- `status`: "published"

---

## TRACK 2: Code Agent Instructions — UI Cleanup

These are surgical changes to the Next.js codebase. Execute in priority order. Each maps to a Jira ticket.

### Priority 1: Remove Fake Social Features

**IG-21: Remove Community Chat widget**
- File: Likely `app/(public)/page.tsx` or a component imported there
- Search for: "Community Chat", "PolicyExpert_EU", "DataPolicy_Analyst", "23 online"
- Action: Delete the entire component block. Do not replace with anything.

**IG-22: Remove Policy Pulse social features (Like/Reply)**
- File: Policy Pulse sidebar component
- Search for: "Like", "Reply", "Coming Soon" modal triggers in Policy Pulse
- Action: Remove the Like and Reply buttons. Keep the Policy Pulse content display as read-only. If the content itself is all mock data, remove the entire section.

**IG-23: Remove "Join Community" button and fake newsletter numbers**
- File: Hero section, Newsletter section
- Search for: "Join Community", "15,000+", "Join 15,000+ policy professionals"
- Action: Replace "Join Community" button with "Read The Observatory" linking to the articles/blog page. Replace newsletter section with a simple "Stay Informed" message with a contact email link (e.g., `mailto:contact@cortexai.com`) — no subscriber count, no form until a real backend exists.

**IG-24: Remove Resource Library section**
- File: Homepage, likely near bottom
- Search for: "Policy Resource Library", "Policy Templates", "Research Reports", "Expert Network"
- Action: Delete the entire section. These three features all trigger Coming Soon modals.

### Priority 2: Clean Up Navigation & Routes

**IG-28: Hide routes without content**
- Keep in navigation: `/` (home), `/about`, `/articles` or `/blog`, `/contact`
- Remove from navigation (keep routes but unlink): `/policy-pulse`, `/videos`, `/deck`, `/wren`, `/policies`, `/quick-posts`, `/glossary` (unless it has real content)
- File: Navigation component (likely `components/layout/Navigation.tsx` or similar)
- Action: Comment out or conditionally render nav links for deferred routes. Do NOT delete the route files — just remove them from the visible nav.

**IG-25: Remove test/debug routes from production**
- Routes to remove or gate behind `NODE_ENV === 'development'`:
  - `/auth-test`
  - `/auth/debug`
  - `/api/auth-debug`
  - `/api/test-env`
  - `/api/test-freshrss`
  - `/admin/test`
  - `/app/components`
- Action: Either delete these page files or wrap them in an environment check that returns 404 in production.

### Priority 3: Footer & Polish

**IG-26: Clean up footer**
- Remove all "Coming Soon" links (Live Hub, Resources Library, Policy Database, Digital Identity, AI Governance, Cross-Border Data, Newsletter, Privacy Policy, Terms of Service, Cookie Settings)
- Keep only: links to real pages (Home, Articles/Blog, About, Contact)
- Update copyright from 2025 → 2026
- Remove social media icons/links until real accounts exist
- Add subtle Cortex AI credit: `<small style="opacity: 0.4">Produced by the agentic team at Cortex AI</small>`

**IG-27: Remove Web3/blockchain artifacts**
- Delete or archive: `docs/WEB3-IMPLEMENTATION-PLAN.md`, `scripts/audit-web3-readiness.ts`
- This is housekeeping — not visible to users but cleans the repo.

### Priority 4: Replace Mock Data

**IG-33: Replace homepage mock data**
- File: `app/(public)/page.tsx` and `lib/mockData.ts`
- Search for: `mockPolicies`, `mockArticles`, `mockThoughts`, `mockVideos`, `quickStats`
- Action: Once real articles are seeded in Supabase (Track 1), the API should return real data. Verify the featured article fetch works. For any section still falling back to mock data, either: (a) ensure the Supabase query returns results, or (b) hide that section entirely.
- Specific fake stats to remove: Any hardcoded numbers like "Active Treaties: 12", "Pending Bills: 47", etc.

### Summary Checklist for Code Agent

```
[ ] Remove Community Chat widget (IG-21)
[ ] Remove Policy Pulse Like/Reply buttons (IG-22)
[ ] Replace "Join Community" → "Read The Observatory" (IG-23)
[ ] Remove fake newsletter subscriber count (IG-23)
[ ] Remove Resource Library section (IG-24)
[ ] Hide non-ready routes from nav (IG-28)
[ ] Gate or remove debug routes (IG-25)
[ ] Clean footer: remove Coming Soon links, update © 2026 (IG-26)
[ ] Add Cortex AI footer credit (IG-26)
[ ] Remove Web3 docs (IG-27)
[ ] Verify mock data doesn't show on homepage (IG-33)
```

---

## TRACK 3: Infrastructure Walkthrough

### Step 1: Verify Vercel Project (IG-2)

The project at `i-grail.vercel.app` already exists. Verify:
1. Go to https://vercel.com/dashboard
2. Confirm the project is connected to the correct GitHub repo
3. Note the `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` from Project Settings → General

### Step 2: Environment Variables (IG-3)

In Vercel Project Settings → Environment Variables, ensure these are set:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-side only)
- `NEXT_PUBLIC_SITE_URL` — `https://i-grail.vercel.app` (or custom domain)

**Optional (defer for now):**
- `FRESHRSS_*` variables — skip until FreshRSS is migrated (IG-30)
- `QUICK_POST_SECRET` — skip until quick-posts feature is ready

### Step 3: Supabase Production (IG-7)

If not already done:
1. Create a new Supabase project specifically for iGRAIL production
2. Run the schema migrations from the repo
3. Seed the 5 articles from Track 1 above
4. Verify the featured article API returns data

### Step 4: GitHub Deployment Gate (IG-4, IG-5, IG-6)

1. In GitHub repo Settings → Secrets, add:
   - `VERCEL_TOKEN` (generate from Vercel account settings)
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
2. Protect `main` branch: Settings → Branches → Add rule
   - Require PR before merge
   - Require status checks to pass
3. Disable Vercel's automatic Git deploys (Settings → Git → disconnect or set to preview-only) so GitHub Actions is the single production gate

### Step 5: Cloudflare DNS (IG-29)

If you want a custom domain (e.g., `observatory.i-grail.com` or `i-grail.com`):
1. In Cloudflare, add CNAME record pointing to `cname.vercel-dns.com`
2. In Vercel, add the domain under Project Settings → Domains
3. Set SSL/TLS to Full (Strict) in Cloudflare
4. Verify both apex and www resolve

### Step 6: Smoke Test (IG-14)

1. Create a branch: `git checkout -b launch-cleanup`
2. Apply all code changes from Track 2
3. Push and create PR
4. Verify preview deployment works
5. Merge to main
6. Verify production deployment at `i-grail.vercel.app`
7. Check: homepage loads, featured article shows, no mock data visible, no Coming Soon modals, footer is clean

---

## Launch Day Sequence

1. **James**: Stand up infra (Steps 1-4 above) — 30-60 min
2. **Code Agent**: Apply all Track 2 changes in a single branch — 30-60 min
3. **James**: Seed content into Supabase using Track 1 data — 15-30 min
4. **Code Agent**: PR and merge to main — 5 min
5. **James**: Smoke test production — 10 min
6. **Share**: Post the NIST Deep Dive link on LinkedIn

Total estimated time to launch: **2-3 hours** if everything goes smoothly.

---

*Prepared by the iGRAIL Editorial Desk · March 16, 2026*
*Produced by the agentic team at Cortex AI*
