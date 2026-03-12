# Site Audit Report

**Generated:** 2025-11-18T17:50:13.755Z

## Summary

- Total Items: 70
- ✅ OK: 50
- ⚠️ Warnings: 20
- ❌ Errors: 0
- 🚧 Not Implemented: 0

## Routes

| Item | Status | Details | Priority |
|------|--------|---------|----------|
| /page.tsx | ✅ OK | Client component | Low |
| /videos | ✅ OK | Server component | Low |
| /quick-posts | ✅ OK | Client component | Low |
| /policy-updates | ✅ OK | Client component | Low |
| /policy-pulse | ✅ OK | Client component | Low |
| /policies | ✅ OK | Client component | Low |
| /login | ✅ OK | Server component | Low |
| /glossary | ✅ OK | Client component | Low |
| /contact | ✅ OK | Client component | Low |
| /components | ✅ OK | Client component | Low |
| /blog | ✅ OK | Client component | Low |
| /auth-test | ✅ OK | Server component | Low |
| /articles | ✅ OK | Client component | Low |
| /admin | ✅ OK | Client component | Low |
| /about | ✅ OK | Server component | Low |
| /articles/:slug | ✅ OK | Client component | Low |
| /auth/debug | ✅ OK | Server component | Low |
| /admin/test | ✅ OK | Server component | Low |
| /admin/studio | ⚠️ WARNING | Contains TODO/FIXME comments | Medium |
| /admin/settings | ✅ OK | Client component | Low |
| /admin/quick-posts | ✅ OK | Client component | Low |
| /admin/media | ✅ OK | Client component | Low |
| /admin/import/wordpress | ✅ OK | Client component | Low |
| /admin/articles/new | ✅ OK | Client component | Low |
| /admin/articles/:id/edit | ✅ OK | Client component | Low |

## API

| Item | Status | Details | Priority |
|------|--------|---------|----------|
| /api/videos | ✅ OK | Methods: GET | Low |
| /api/test-freshrss | ✅ OK | Methods: GET | Low |
| /api/stats | ✅ OK | Methods: GET | Low |
| /api/test-env | ✅ OK | Methods: GET | Low |
| /api/health | ✅ OK | Methods: GET | Low |
| /api/feeds | ✅ OK | Methods: GET | Low |
| /api/articles | ✅ OK | Methods: GET | Low |
| /api/auth-debug | ✅ OK | Methods: GET | Low |
| /api/webhooks/quick-post | ✅ OK | Methods: GET, POST | Low |
| /api/auth/signout | ✅ OK | Methods: POST | Low |
| /api/auth/oauth | ✅ OK | Methods: GET | Low |
| /api/articles/[slug] | ✅ OK | Methods: GET | Low |
| /api/admin/articles | ✅ OK | Methods: GET, POST | Low |
| /api/admin/articles/[id] | ✅ OK | Methods: GET, PUT, DELETE | Low |

## Components

| Item | Status | Details | Priority |
|------|--------|---------|----------|
| WorldClocks.tsx | ⚠️ WARNING | No tests found | Medium |
| RightSidebar.tsx | ⚠️ WARNING | No tests found | Medium |
| RichTextEditor.tsx | ⚠️ WARNING | No tests found | Medium |
| PageHero.tsx | ⚠️ WARNING | No tests found | Medium |
| Navigation.tsx | ⚠️ WARNING | No tests found | Medium |
| Header.tsx | ⚠️ WARNING | No tests found | Medium |
| GlobalFeedStream.tsx | ⚠️ WARNING | No tests found | Medium |
| FeedCard.tsx | ⚠️ WARNING | No tests found | Medium |
| AnimatedGlobe.tsx | ⚠️ WARNING | No tests found | Medium |
| ui/StatusDot.tsx | ⚠️ WARNING | No tests found | Medium |
| ui/Skeleton.tsx | ⚠️ WARNING | No tests found | Medium |
| ui/ComingSoonModal.tsx | ⚠️ WARNING | No tests found | Medium |
| ui/Card.tsx | ⚠️ WARNING | No tests found | Medium |
| ui/Button.tsx | ⚠️ WARNING | No tests found | Medium |
| ui/Avatar.tsx | ⚠️ WARNING | No tests found | Medium |
| widgets/TermOfDay.tsx | ⚠️ WARNING | No tests found | Medium |
| widgets/NISTAssistant.tsx | ⚠️ WARNING | No tests found | Medium |
| widgets/DataBoxes.tsx | ⚠️ WARNING | No tests found | Medium |
| widgets/BreachCounter.tsx | ⚠️ WARNING | No tests found | Medium |

## Migrations

| Item | Status | Details | Priority |
|------|--------|---------|----------|
| 001_auth_setup.sql | ✅ OK | Migration file exists | Low |
| 002_oauth_roles.sql | ✅ OK | Migration file exists | Low |
| 003_wordpress_roles.sql | ✅ OK | Migration file exists | Low |
| 003_wordpress_roles_safe.sql | ✅ OK | Migration file exists | Low |
| 004_cleanup_duplicate_profiles.sql | ✅ OK | Migration file exists | Low |
| 005_fix_articles_schema.sql | ✅ OK | Migration file exists | Low |
| 006_setup_media_storage.sql | ✅ OK | Migration file exists | Low |
| 007_media_storage_policies.sql | ✅ OK | Migration file exists | Low |
| 008_make_bucket_public.sql | ✅ OK | Migration file exists | Low |
| 009_fix_storage_delete_policy.sql | ✅ OK | Migration file exists | Low |
| 010_quick_posts.sql | ✅ OK | Migration file exists | Low |
| 011_add_article_metrics.sql | ✅ OK | Migration file exists | Low |

