# QA Briefing: KAN-77 Release Testing

**Date:** 2025-11-16
**Branch:** `main` (deployed to production)
**Release:** KAN-77 Bug Fixes + Quick Posts Feature
**Status:** Ready for QA Testing

---

## Overview

This release includes **12 bug fixes** from KAN-77 and the **Quick Posts micro-blogging feature**. All code has been merged to `main` and deployed to production.

### Database Migration Required
**IMPORTANT:** Migration `011_add_article_metrics.sql` has been executed in Supabase, adding:
- `view_count` (INTEGER, default 0)
- `revision_count` (INTEGER, default 0)
- `scheduled_for` (TIMESTAMPTZ, nullable)

---

## KAN-77 Fixes Completed (12/12)

### Critical Functionality Fixes

#### ✅ KAN-78: Media Vault Page Refresh
**What was fixed:**
- Media vault now refreshes immediately after uploading images
- Added cache-busting timestamps to image URLs (`?t={timestamp}`)
- Loading state properly set during refresh

**How to test:**
1. Navigate to `/admin/media`
2. Upload a new image (drag & drop or file picker)
3. **VERIFY:** Image appears immediately in grid without manual refresh
4. **VERIFY:** Toast notification shows "Upload complete"

---

#### ✅ KAN-83: Delete Draft Functionality
**What was fixed:**
- Implemented DELETE endpoint at `/api/admin/articles/[id]`
- Dashboard delete button now works with proper error handling
- Toast notifications for delete operations

**How to test:**
1. Navigate to `/admin` (Publishing Desk)
2. Find any draft article
3. Click the red trash icon
4. **VERIFY:** Confirmation dialog appears
5. Confirm deletion
6. **VERIFY:** Toast shows "Deleting article..." then "Article deleted successfully!"
7. **VERIFY:** Article disappears from list immediately
8. **VERIFY:** Dashboard stats update (draft count decreases)

---

#### ✅ KAN-85: Dashboard Refresh After Delete
**What was fixed:**
- Dashboard automatically calls `fetchArticles()` after successful delete
- No manual refresh needed

**How to test:**
1. Note the current article count on dashboard
2. Delete an article (see KAN-83 test)
3. **VERIFY:** Article list updates without page refresh
4. **VERIFY:** Stats cards update (Total Articles count decreases)

---

#### ✅ KAN-86: Scheduled Posts Count
**What was fixed:**
- API now queries `scheduled_for` column from database
- Dashboard stats card shows accurate scheduled post count

**How to test:**
1. Navigate to `/admin`
2. Check "Scheduled" card in stats section
3. **VERIFY:** Count matches number of articles with status='scheduled'
4. Schedule a new article:
   - Go to `/admin/articles/new`
   - Create article, click "Schedule"
   - Pick future date/time
   - Save
5. Return to `/admin`
6. **VERIFY:** Scheduled count incremented by 1

---

#### ✅ KAN-87: Revisions Count Display
**What was fixed:**
- API now queries `revision_count` column
- Dashboard table shows revision count per article

**How to test:**
1. Navigate to `/admin`
2. Look at "Revisions" column in articles table
3. **VERIFY:** Shows numeric count (currently 0 for all articles - this is expected)
4. **NOTE:** Revision tracking increments when articles are edited (future feature)

---

#### ✅ KAN-88: Featured Image Upload
**What was fixed:**
- Added file picker input for featured images
- Uploads to Supabase `media` bucket
- Toast notifications during upload
- URL input still available as fallback

**How to test:**
1. Navigate to `/admin/articles/new`
2. Scroll to "Featured Image" section in right sidebar
3. **VERIFY:** "Choose File" button is visible
4. Click "Choose File"
5. Select an image from your computer
6. **VERIFY:** Toast shows "Uploading image..."
7. **VERIFY:** Toast shows "Image uploaded successfully!"
8. **VERIFY:** Image preview appears in card
9. **VERIFY:** Red X button appears to remove image
10. Click X button
11. **VERIFY:** Image removed, file picker reappears

---

#### ✅ KAN-89: SEO Fields Text Visibility
**What was fixed:**
- Added `text-gray-900` to Meta Title input
- Added `text-gray-900` to Meta Description textarea
- Added `text-gray-900` to Tags input
- All fields now have proper text contrast

**How to test:**
1. Navigate to `/admin/articles/new`
2. Scroll to "SEO Settings" section
3. Type in "Meta Title" field
4. **VERIFY:** Text is clearly visible (dark gray on white)
5. Type in "Meta Description" field
6. **VERIFY:** Text is clearly visible
7. Scroll to "Tags" section
8. Type in tags input field
9. **VERIFY:** Text is clearly visible as you type

---

### Already Working (Verified)

#### ✅ KAN-81: Scheduled Status on Dashboard
**What to verify:**
- Articles with `status='scheduled'` appear in dashboard
- "Scheduled" filter button works

**How to test:**
1. Navigate to `/admin`
2. Click "Scheduled" filter button
3. **VERIFY:** Only scheduled articles display
4. **VERIFY:** Each has blue "scheduled" badge

---

#### ✅ KAN-82: Scheduled Time Column
**What to verify:**
- "Scheduled For" column exists in table
- Shows formatted date for scheduled articles

**How to test:**
1. Navigate to `/admin`
2. Look at table headers
3. **VERIFY:** "Scheduled For" column exists
4. Find a scheduled article
5. **VERIFY:** Shows date like "November 5, 2025" with calendar icon
6. Non-scheduled articles show "—"

---

### Branding Update

#### ✅ KAN-84: "Publishing Desk" Rename
**What was changed:**
- Renamed "Content Manager" → "Publishing Desk" throughout site
- Updated: dashboard header, sidebar navigation, import page

**How to test:**
1. Navigate to `/admin`
2. **VERIFY:** Page title says "Publishing Desk"
3. Look at right sidebar navigation
4. **VERIFY:** Link says "Publishing Desk" (not "Content Manager")
5. Navigate to `/admin/studio`
6. **VERIFY:** "Publishing Desk" label in cards
7. Navigate to `/admin/import/wordpress`
8. **VERIFY:** Success message button says "Go to Publishing Desk"

---

### UI Enhancements

#### ✅ KAN-79: Thumbnail Quick View Modal
**What was added:**
- Click any thumbnail in media vault to open detailed view
- Large image preview
- File metadata display
- Download & Delete actions

**How to test:**
1. Navigate to `/admin/media`
2. **VERIFY:** Thumbnails have subtle hover effect (blue ring on hover)
3. Click any image thumbnail
4. **VERIFY:** Modal opens with dark overlay
5. **VERIFY:** Large image preview displays
6. **VERIFY:** Metadata shows:
   - File Name
   - File Size (formatted: "2.5 MB")
   - File Type (MIME type)
   - Upload date/time (formatted)
   - Full URL (without cache param)
7. **VERIFY:** "Download" button (blue)
8. **VERIFY:** "Delete" button (red)
9. Click Download
10. **VERIFY:** File downloads in new tab
11. Click X button or click outside modal
12. **VERIFY:** Modal closes

---

#### ✅ KAN-80: Delete from Draft Editor
**What was added:**
- Delete button in article edit page
- Confirmation dialog
- Toast notifications
- Auto-redirect to dashboard after delete

**How to test:**
1. Navigate to `/admin`
2. Click "Edit" on any article
3. **VERIFY:** Red "Delete" button appears after "Cancel"
4. **VERIFY:** Visual separator (vertical line) between Delete and action buttons
5. Click "Delete" button
6. **VERIFY:** Confirmation dialog: "Delete '{title}'? This action cannot be undone."
7. Click Cancel
8. **VERIFY:** Nothing happens
9. Click Delete again, confirm
10. **VERIFY:** Toast shows "Deleting article..."
11. **VERIFY:** Toast shows "Article deleted successfully!"
12. **VERIFY:** Redirected to `/admin` dashboard
13. **VERIFY:** Article no longer in list

---

## Quick Posts Feature (Separate Testing)

**Note:** Quick Posts feature is deployed but requires setup. See [DRAFTS-APP-SETUP.md](./DRAFTS-APP-SETUP.md) for configuration.

**Key Pages:**
- `/admin/quick-posts` - Admin management
- `/quick-posts` - Public display
- `/api/webhooks/quick-post` - Webhook endpoint

**Quick Test:**
1. Navigate to `/admin/quick-posts`
2. **VERIFY:** Page loads with empty state or posts list
3. Try creating a post via web form
4. **VERIFY:** Post appears in draft list
5. Click "Publish"
6. **VERIFY:** Status changes to "published"
7. Navigate to `/quick-posts`
8. **VERIFY:** Published post appears

---

## Known Limitations

1. **View Count:** Currently shows 0 for all articles (tracking not implemented)
2. **Revision Count:** Currently shows 0 for all articles (tracking not implemented)
3. **Scheduled Posts:** Need to manually create scheduled articles to test counts
4. **Quick Posts:** Drafts app integration requires manual setup on iPhone

---

## Files Modified (for reference)

### Backend/API:
- `app/api/admin/articles/route.ts` - Added scheduled_for, view_count, revision_count to query
- `app/api/admin/articles/[id]/route.ts` - Added DELETE endpoint

### Frontend/Admin:
- `app/admin/page.tsx` - Delete handler, toast notifications
- `app/admin/articles/new/page.tsx` - Featured image upload, SEO text visibility
- `app/admin/articles/[id]/edit/page.tsx` - Delete button
- `app/admin/media/page.tsx` - Quick view modal, cache-busting
- `app/admin/import/wordpress/page.tsx` - Publishing Desk rename

### Components:
- `components/RightSidebar.tsx` - Publishing Desk rename

### Database:
- `supabase/migrations/011_add_article_metrics.sql` - New columns

---

## Environment Variables

**No changes required** - `.env.local` already contains:
```
QUICK_POST_SECRET="0cf5da61ff96462e42019bf5acd365d39b369aeb41bf981cc2aeada6b0b6ceea"
```

---

## Testing Checklist Summary

### Critical Path Tests:
- [ ] Upload image to media vault → appears immediately
- [ ] Delete article from dashboard → disappears + stats update
- [ ] Upload featured image → shows preview
- [ ] Type in SEO fields → text is visible
- [ ] Click thumbnail in media vault → modal opens
- [ ] Delete article from editor → redirects to dashboard

### Data Integrity Tests:
- [ ] Dashboard stats match actual article counts
- [ ] Scheduled posts count accurate
- [ ] View count displays (even if 0)
- [ ] Revision count displays (even if 0)

### UX Tests:
- [ ] All toast notifications appear
- [ ] Confirmation dialogs show before delete
- [ ] Loading states display during operations
- [ ] "Publishing Desk" appears throughout (not "Content Manager")

---

## Regression Testing

**Areas to check for regressions:**
1. Article creation (draft, publish, schedule) still works
2. Article editing still works
3. Media vault upload/delete still works
4. Dashboard filtering (all, draft, scheduled, published) works
5. Navigation links all work
6. Authentication still works

---

## Rollback Plan

If critical issues found:

```bash
# Revert to previous commit
git revert 06f9578
git push origin main
```

**Previous stable commit:** `0268543` (before KAN-77 fixes)

---

## Support Information

**Database Schema:**
- Articles table includes: `view_count`, `revision_count`, `scheduled_for`
- Quick Posts table exists (if migration run)

**API Endpoints Added:**
- `DELETE /api/admin/articles/[id]` - Delete article

**API Endpoints Modified:**
- `GET /api/admin/articles` - Now returns scheduled_for, view_count, revision_count

---

## Success Criteria

**Release is successful if:**
1. ✅ All 12 KAN-77 tests pass
2. ✅ No TypeScript build errors
3. ✅ No console errors in browser
4. ✅ Dashboard stats accurate
5. ✅ Delete operations work correctly
6. ✅ Media vault operations work correctly
7. ✅ No regressions in existing features

---

## Contact

For questions or issues:
- Check browser console for errors
- Check Vercel deployment logs
- Check Supabase logs for database errors

---

**QA Status:** 🟡 Ready for Testing
**Expected Completion:** End of session
**Deployment Status:** ✅ Live on Production
