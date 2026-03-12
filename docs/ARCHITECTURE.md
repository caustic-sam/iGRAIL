# Architecture Guide

This document explains how iGRAIL is put together and why some parts of the system are intentionally duplicated or defensive.

## High-Level Shape

iGRAIL has two main surfaces:

- the public site, which reads policy and editorial content
- the admin workspace, which creates and manages that content

The repo is a Next.js App Router application, so pages, layouts, and API handlers live in the same `app/` tree.

## Main Folders

- `app/`: routes, server components, client components, and API handlers
- `components/`: reusable UI pieces and feature widgets
- `contexts/`: cross-page client state such as authentication
- `lib/`: shared data access and integration code
- `supabase/`: database-facing SQL and support files

## Request Flow

For students, this is the most important mental model:

1. A browser request enters the app.
2. [proxy.ts](/Users/jm/Projects/iGRAIL/proxy.ts) can redirect broad route groups such as `/admin`.
3. The page or API handler runs.
4. If the handler is an admin API, it also calls [lib/route-guards.ts](/Users/jm/Projects/iGRAIL/lib/route-guards.ts).
5. Data is loaded from Supabase if configured, or from mock fallbacks when configuration is missing.

The proxy and the route guard are both required. The proxy protects navigation. The route guard protects direct API access. Those are different security jobs.

## Authentication And Authorization

- Public auth state on the client is managed by [contexts/AuthContext.tsx](/Users/jm/Projects/iGRAIL/contexts/AuthContext.tsx).
- Navigation protection happens in [proxy.ts](/Users/jm/Projects/iGRAIL/proxy.ts).
- Admin API authorization happens in [lib/route-guards.ts](/Users/jm/Projects/iGRAIL/lib/route-guards.ts).
- Service-role queries are only allowed after the admin guard passes.

That last point matters because the service role bypasses Row Level Security. If you forget the guard, you create a real security bug, not just a code smell.

## Data Strategy

iGRAIL supports two operating modes:

- configured mode, where Supabase and optional integrations are live
- mock mode, where the UI still works with sample data

Mock mode exists for three reasons:

- local UI work should not require a live backend every time
- build environments sometimes lack secrets
- teaching and demos are easier when the app can run in a self-contained way

The tradeoff is that the code needs clear comments so developers know when they are seeing real data versus fallback data.

## External Integrations

- Supabase: database, auth, and storage
- FreshRSS: feed aggregation
- Drafts: quick-post webhook input

Each integration is written so failure degrades gracefully where practical. The goal is to keep the site usable, not perfectly feature-complete, during partial outages or local setup gaps.

## What To Read In Code

If you want the fastest tour:

1. [app/layout.tsx](/Users/jm/Projects/iGRAIL/app/layout.tsx)
2. [app/page.tsx](/Users/jm/Projects/iGRAIL/app/page.tsx)
3. [proxy.ts](/Users/jm/Projects/iGRAIL/proxy.ts)
4. [lib/route-guards.ts](/Users/jm/Projects/iGRAIL/lib/route-guards.ts)
5. [lib/supabase.ts](/Users/jm/Projects/iGRAIL/lib/supabase.ts)
6. [app/api/admin/articles/route.ts](/Users/jm/Projects/iGRAIL/app/api/admin/articles/route.ts)

That sequence shows layout, homepage composition, request protection, server auth boundaries, shared data helpers, and a real admin CRUD route.
