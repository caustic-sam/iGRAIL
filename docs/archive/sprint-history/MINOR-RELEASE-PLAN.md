# Minor Release Plan

**Status:** Planned - Not Started
**Target:** Next focused work session (4.5-6.5 hours)
**Goal:** Comprehensive integration testing + Atlassian sync + versioned release

---

## Overview

Establish baseline quality with full integration test coverage before v1.0. Everything appears to be working, but needs systematic validation.

---

## Phase 1: Integration Testing (3-4 hours)

### 1. Test Environment Setup (30 min)
- [ ] Create/configure test Supabase project
- [ ] Set up test credentials (`.env.test.local`)
- [ ] Configure test database schema
- [ ] Seed test data

### 2. RLS Policy Integration Tests (1 hour)
- [ ] Test `select_own_profile` - users can read own profile
- [ ] Test `update_own_profile` - users can update own profile
- [ ] Test `insert_new_profile` - trigger can create profiles
- [ ] Test unauthorized access (user A cannot read user B's profile)
- [ ] Test admin role assignment and verification
- [ ] Test circular dependency fix (no 500 errors)

Location: `__tests__/integration/rls-policies.test.ts`

### 3. Auth Flow Integration Tests (1 hour)
- [ ] OAuth callback flow
- [ ] Session management
- [ ] Cookie handling
- [ ] Login state visibility in Header
- [ ] Profile fetch after login
- [ ] Logout flow

Location: `__tests__/integration/auth-flows.test.ts`

### 4. Core API Endpoint Tests (1-1.5 hours)
- [ ] `/api/articles` - CRUD operations with RLS
- [ ] `/api/policies` - Read with fallback
- [ ] `/api/videos` - Read with fallback
- [ ] `/api/thoughts` - CRUD operations
- [ ] `/api/feeds` - FreshRSS integration (already has tests)
- [ ] Error handling and edge cases

Location: `__tests__/integration/api-endpoints.test.ts`

### 5. Test Run + Debug (30 min buffer)
- [ ] Run full test suite: `pnpm test`
- [ ] Fix any failures
- [ ] Ensure coverage meets targets
- [ ] Document any known issues

---

## Phase 2: Atlassian Update (1-2 hours)

### 1. Documentation Audit (30 min)
- [ ] List all docs in `/docs` folder
- [ ] Compare with Confluence space content
- [ ] Identify outdated/missing pages
- [ ] Create update priority list

### 2. Confluence Sync (45 min)
- [ ] Update CURRENT-WORK.md equivalent
- [ ] Sync technical documentation
- [ ] Update architecture diagrams (if any)
- [ ] Add test documentation
- [ ] Update session summaries

### 3. Jira Verification (15 min)
- [ ] Confirm Jira project exists
- [ ] Verify issue tracking is set up
- [ ] Link to release milestone

---

## Phase 3: Release Prep (30-45 min)

### 1. Changelog Generation (15 min)
- [ ] Review git log since last release
- [ ] Categorize changes (Features, Fixes, Tests, Docs)
- [ ] Write CHANGELOG.md entry
- [ ] Highlight RLS policy fix and OAuth improvements

### 2. Version Bump (10 min)
- [ ] Update package.json version (TBD → determine current)
- [ ] Update any version constants in code
- [ ] Run build to verify

### 3. Tag and Push (10 min)
- [ ] Create git tag (e.g., `v0.4.0`)
- [ ] Push to remote with tags
- [ ] Create GitHub release notes
- [ ] Deploy to Vercel production

---

## Open Questions (Answer before starting)

1. **Test Database**: Separate Supabase project or shared with dev?
2. **Test Credentials**: Where to store? (`.env.test.local`, CI secrets)
3. **Current Version**: What is it now? (Check package.json)
4. **Next Version**: What should minor release be? (e.g., 0.3.0 → 0.4.0)
5. **Release Branch**: Use `main` or create `release/v0.x.0`?

---

## Success Criteria

- ✅ All integration tests pass
- ✅ RLS policies verified working correctly
- ✅ No 500 errors in auth flows
- ✅ Atlassian Confluence in sync with repo docs
- ✅ Clean build with no errors
- ✅ Version tagged and deployed
- ✅ Changelog documented

---

## Notes

- RLS policy fix (commit 2ad8dfd) resolved circular dependency causing 500 errors
- OAuth fixes (commits 9450ccb, 0a9deac) improved login visibility
- Current `FIX-RLS-POLICIES.sql` has been applied, file now contains "x"
- This is a **minor release** - not yet at v1.0

---

**Created:** 2025-11-11
**Branch:** docs/minor-release-plan
