# Session Issues - 2025-11-12

**Reported By:** JdM
**Date:** 2025-11-12
**Last Updated:** 2025-11-13
**Status:** 6 of 15 Issues Resolved

---

## ✅ Session Completion Summary (2025-11-13)

**Resolved This Session:**
1. ✅ Avatar display with fallback handler
2. ✅ Banner stats now dynamic with real-time Supabase data
3. ✅ Policy URLs validated and updated
4. ✅ Orange outline removed from policy cards
5. ✅ Cursor pointer added to policy categories
6. ✅ Media Vault grid optimized to 8 columns

**Pending Issues:**
- #1: Supabase schema cache for `summary` column (SQL ready)
- #2: Image upload broken (Storage bucket needs creation)
- #5: Featured article (needs article marked as featured in DB)
- #7: Orange button color refinement (awaiting selection)
- #10-15: Feature requests (video curation, signup, metadata editor, etc.)

**Next Session Priorities:**
1. Fix Supabase schema cache and Storage bucket
2. Mark article as featured for dynamic display
3. Choose final orange button color
4. Begin video curation system or simple signup screen

---

## 🔴 Critical Issues (Blocking Core Functionality)

### 1. **Supabase Schema Cache Error - `summary` Column**
**Severity:** Critical
**Impact:** Cannot publish articles

```
❌ Error: Could not find the 'summary' column of 'articles' in the schema cache
Code: PGRST204
```

**Notes:**
- Same issue as `read_time_minutes` column
- Supabase PostgREST schema cache not refreshed
- **Action:** Need to reload schema cache in Supabase dashboard

---

### 2. **Cannot Upload Images for New Post**
**Severity:** Critical
**Impact:** Cannot add images to articles

**Notes:**
- Media upload functionality broken
- Blocks article creation workflow
- **Action:** Investigate upload endpoint and permissions

---

### 3. ✅ **Avatar Not Appearing (caustic-sam)** - RESOLVED
**Severity:** High
**Impact:** GitHub avatar integration not working
**Status:** ✅ Fixed 2025-11-13

**Solution:**
- Added `onError` fallback handler in Header component
- Manual avatar URL update via SQL
- Sign out/in triggers OAuth avatar save
- Files: `components/Header.tsx:88-91`
- Commit: `96a648d`

---

## 🟡 High Priority Issues

### 4. ✅ **Banner Card Numbers Not Updating** - RESOLVED
**Severity:** High
**Impact:** Static data on homepage
**Status:** ✅ Fixed 2025-11-13

**Solution:**
- Created `/api/stats` endpoint with Supabase integration
- Real-time counts: articles, authors, weekly updates
- Automatic trend calculation (+/- vs 7 days ago)
- 5-minute cache, loading skeletons, graceful fallback
- Files: `app/api/stats/route.ts` (NEW), `app/page.tsx:39-40,92-113,273-294`
- Commit: `a08d807`

---

### 5. **Dr. Chen Article Still Static**
**Severity:** High
**Impact:** Featured article not dynamic despite code changes

**Notes:**
- Dynamic article fetching implemented but not working
- Falls back to mock data (Dr. Sarah Chen)
- **Action:** Debug API endpoint and article fetching

---

### 6. ✅ **Policy Links Returning 404** - RESOLVED
**Severity:** High
**Impact:** Broken user experience
**Status:** ✅ Fixed 2025-11-13

**Solution:**
- Validated all 4 policy URLs via WebFetch
- Updated Singapore Digital Identity URL (403 → working)
- Updated African Union Strategy URL (more specific)
- All links now verified and functional
- File: `lib/mockData.ts:22,44`
- Commit: `b6f7952`

---

## 🟢 Medium Priority Issues

### 7. **Orange Button Color Needs Refinement**
**Severity:** Medium
**Impact:** Design polish

**Request:**
> "The orange button looks good but let's choose the exact color. Maybe spend time pondering color swatches."

**Current:** `bg-orange-500 hover:bg-orange-600`
**Action:** Provide color swatch options for selection

---

### 8. ✅ **Policy Card Orange Outline** - RESOLVED
**Severity:** Medium
**Impact:** Visual clarity
**Status:** ✅ Fixed 2025-11-13

**Solution:**
- Removed `border-2 border-orange-500` from policy cards
- Cards now functional and clickable, so outline removed
- File: `app/page.tsx:211`
- Commit: `96a648d`

---

### 9. ✅ **Mouse Cursor Not Changing on Policy Feed Categories** - RESOLVED
**Severity:** Low
**Impact:** UX polish
**Status:** ✅ Fixed 2025-11-13

**Solution:**
- Added `cursor-pointer` class to policy category tabs
- Improved UX clarity for clickable elements
- File: `app/page.tsx:189`
- Commit: `96a648d`

---

## 🔵 Feature Requests

### 10. **Video Insights Curation System**
**Severity:** Medium
**Priority:** P2

**Request:**
> "Video Insights should have a way for us to showcase a video from YouTube or wherever. These should also be scheduled."

**Requirements:**
- Manual video curation interface
- YouTube URL input
- Scheduling capability
- Admin UI in Studio

**Estimated Time:** 2-3 hours

---

### 11. **System-Wide Scheduling System**
**Severity:** High
**Priority:** P1

**Question:**
> "DO WE NEED A SYSTEM SCHEDULING SYSTEM?"

**Use Cases:**
- Article publishing (already identified)
- Video showcasing
- Policy updates
- Content rotation

**Options:**
1. Supabase pg_cron (database-level)
2. Vercel Cron Jobs (API-level)
3. GitHub Actions (external scheduler)

**Recommendation:** Yes - implement Supabase pg_cron for unified scheduling

**Estimated Time:** 3-4 hours

---

### 12. **Simple Signup Screen + Backend User Creation**
**Severity:** Medium
**Priority:** P2

**Request:**
> "Let's build a simple signup screen and allow me to create users on the backend for testing. We will wire it up fully later. For now I just need a desired username and password to create test users and RBAC."

**Requirements:**
- Basic signup form (username + password)
- Admin interface to create test users
- RBAC role assignment
- No OAuth for now (manual testing only)

**Estimated Time:** 1-2 hours

---

### 13. ✅ **Media Vault Thumbnail Size** - RESOLVED
**Severity:** Low
**Priority:** P3
**Status:** ✅ Fixed 2025-11-13

**Solution:**
- Responsive grid: 2→4→6→8 columns based on screen size
- Compact design with smaller padding and typography
- Icon-only download button for space efficiency
- Full filename on hover via tooltip
- File: `app/admin/media/page.tsx:233-279`
- Commit: `7cf4d47`

---

### 14. **Media Metadata Editor**
**Severity:** Medium
**Priority:** P2

**Request:**
> "When I click on an image I want to be taken to a WordPress-like screen where I can add extra metadata. Right now I can only download the image. This may be a monitor feature."

**Requirements:**
- Click image → open metadata editor
- Fields: alt text, caption, description, tags
- WordPress-style interface
- Save to database

**Estimated Time:** 2-3 hours

---

## 🚨 Epic-Level Work Identified

### 15. **Article/Post Creation Module Overhaul**
**Severity:** Critical
**Priority:** P0

**Quote:**
> "Basically the whole new post/article (is it a module) experience needs major work. Probably its own epic."

**Known Issues:**
- Schema cache errors (`read_time_minutes`, `summary`)
- Image upload broken
- Publishing failures
- Scheduling non-functional

**Scope:**
- Fix all Supabase schema issues
- Rebuild image upload flow
- Implement proper error handling
- Add field validation
- Improve UX throughout

**Recommendation:** Create dedicated epic in Jira
**Estimated Time:** 8-12 hours (full overhaul)

---

## 📊 Priority Matrix

| Issue | Severity | Effort | Priority | Blocker? |
|-------|----------|--------|----------|----------|
| #1 - Schema cache (summary) | Critical | 10m | P0 | YES |
| #2 - Image upload broken | Critical | 1-2h | P0 | YES |
| #15 - Article creation epic | Critical | 8-12h | P0 | YES |
| #3 - Avatar not showing | High | 30m | P1 | No |
| #4 - Banner numbers static | High | 2-3h | P1 | No |
| #5 - Dr. Chen still static | High | 30m | P1 | No |
| #6 - Policy link 404s | High | 1h | P1 | No |
| #11 - Scheduling system | High | 3-4h | P1 | No |
| #7 - Button color | Medium | 30m | P2 | No |
| #8 - Orange outline | Medium | 5m | P2 | No |
| #10 - Video curation | Medium | 2-3h | P2 | No |
| #12 - Signup screen | Medium | 1-2h | P2 | No |
| #14 - Media metadata | Medium | 2-3h | P2 | No |
| #13 - Thumbnail size | Low | 15m | P3 | No |
| #9 - Cursor hover | Low | 5m | P3 | No |

---

## 🎯 Recommended Tonight's Work

### Option A: Fix Blockers (2-3 hours)
1. Fix Supabase schema cache (10 mins)
2. Debug and fix image upload (1-2 hours)
3. Fix avatar display (30 mins)
4. Quick wins: orange outline, cursor hover (10 mins)

### Option B: Quick Wins + Scheduling Foundation (3-4 hours)
1. Fix Supabase schema cache (10 mins)
2. Fix Dr. Chen dynamic article issue (30 mins)
3. Fix avatar display (30 mins)
4. Remove orange outline (5 mins)
5. Implement scheduling system foundation (2-3 hours)

### Option C: Focus on Article Creation Epic (3-4 hours)
1. Fix all schema cache issues (30 mins)
2. Rebuild image upload flow (1-2 hours)
3. Fix article publishing (1 hour)
4. Add proper error handling (30 mins)

---

## 🔧 Technical Notes

### Supabase Schema Cache Issues
This is recurring. Need to:
1. Check all columns exist in production database
2. Create migration script for missing columns
3. Add schema validation to CI/CD
4. Document reload process

### Image Upload Investigation Needed
Possible causes:
- Supabase Storage permissions
- Missing RLS policies
- Upload route misconfiguration
- File size limits

### Avatar Display Debug
Check:
1. Is `avatar_url` being saved to database?
2. Is avatar URL accessible (CORS)?
3. Is image component rendering correctly?
4. Console errors in browser?

---

**Next Steps:**
1. Prioritize fixes with user
2. Create Jira epic for article creation overhaul
3. Execute highest priority items
4. Document all fixes

---

**Created:** 2025-11-12
**Session:** Evening QA Follow-up
