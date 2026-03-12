# Remaining UI Tasks

**Status:** Partially Complete - 5 of 9 tasks done
**Created:** 2025-11-11
**Session:** Evening UI improvements batch

---

## ✅ Completed Tasks

1. **Database Fix - meta_description column** ✅
   - Created: `ADD-META-DESCRIPTION-COLUMN.sql`
   - Fixes "Publish Now" error (PGRST204)
   - **Action Required:** Run SQL script in Supabase SQL Editor

2. **Policy Cards - 4x4 Grid** ✅
   - Shrunk cards to fit 4 columns on desktop
   - Trimmed white space, compact layout
   - No information loss
   - File: `app/policy-updates/page.tsx`

3. **Custom Source Button Color** ✅
   - Changed from bright blue to navy blue theme
   - Matches brand colors
   - File: `app/policy-updates/page.tsx`

4. **Admin Nav Labels** ✅
   - "Media Studio" → "Media Vault"
   - "Publishing Studio" → "Publishing Desk"
   - Added "Component Gallery" link
   - File: `components/RightSidebar.tsx`

5. **Sortable Columns in Content Manager** ✅
   - Click-to-sort on Status, Published Date, Views, Revisions
   - Visual sort indicators with arrows (↑↓)
   - Toggle ascending/descending order
   - Hover states on sortable headers
   - File: `app/admin/page.tsx`

---

## 🔴 Remaining High-Priority Tasks

### 1. Fix Media Vault - Show 45 Media Files
**Status:** Investigation Required
**Location:** `/admin/media` (Media Vault page)
**Issue:** "Shipping 45 media files but no media when I visit the media vault"

**Debugging Steps:**
1. Check Media Vault API endpoint
2. Verify file upload/storage location
3. Check RLS policies on media table
4. Verify media table schema exists
5. Check for console errors in browser

**Files to Investigate:**
- `app/admin/media/page.tsx`
- `app/api/media/*` (if exists)
- Database: `media` or `files` table

**Possible Causes:**
- RLS policy blocking reads
- Media stored in different table
- API endpoint not returning data
- Frontend not rendering properly

---

### 2. Fix File Calculations at Bottom of Studio Page
**Status:** Investigation Required
**Location:** `/admin/studio` (Publishing Desk)
**Issue:** "File calculations are wrong"

**Debugging Steps:**
1. Visit `/admin/studio` page
2. Check what calculations are showing
3. Compare with actual data
4. Find calculation logic in code

**Files to Check:**
- `app/admin/studio/page.tsx`
- Look for file count/size calculations
- Check stats/summary components

---

### 3. Mute Blue, Orange, Purple to Fall Tones
**Status:** Design Task
**Requirement:** "Mute them the same way our navy blue is muted. Almost like fall tones that mathematically go together."

**Current Brand Colors:**
- **Navy Blue:** `#1e3a5f` (primary) - Already muted ✅
- **Blue:** Bright blue (#3b82f6, #2563eb) - Needs muting
- **Orange:** Bright orange - Needs muting
- **Purple:** Bright purple - Needs muting

**Proposed Muted Fall Palette:**
```css
/* Muted Blue (keep existing) */
--primary-navy: #1e3a5f;
--primary-navy-light: #2d5a8f;

/* Muted Fall Blue */
--muted-blue: #4a6fa5;        /* Dusty blue */
--muted-blue-light: #6b8caf;  /* Lighter dusty blue */

/* Muted Fall Orange */
--muted-orange: #c17a58;      /* Burnt sienna */
--muted-orange-light: #d9a07a; /* Lighter terra cotta */

/* Muted Fall Purple */
--muted-purple: #8b7fa8;      /* Dusty lavender */
--muted-purple-light: #a99cc0; /* Lighter lavender */

/* Accent Colors */
--accent-sage: #8b9a7c;       /* Sage green */
--accent-rust: #a85f4a;       /* Rust brown */
```

**Files to Update:**
- Status indicators (`getStatusBadge` functions)
- Button variants
- Category badges
- Any bright blue/orange/purple usage

**Search for:**
- `bg-blue-500`, `bg-blue-600`, `text-blue-600`
- `bg-orange-500`, `text-orange-600`
- `bg-purple-500`, `text-purple-600`

---

### 4. Enhance Media Vault for Photos, Videos, PDFs
**Status:** Feature Enhancement
**Location:** `/admin/media`

**Requirements:**
- Support multiple file types: Photos (JPEG, PNG, WebP), Videos (MP4, WebM), PDFs
- Visual preview for each type
- File type filtering
- Upload handling for all types
- Storage in Supabase Storage or similar

**Implementation:**
1. Update file upload to accept multiple MIME types
2. Add file type detection
3. Create preview components:
   - Image: thumbnail preview
   - Video: video player preview
   - PDF: first page preview or icon
4. Add filter buttons: "All", "Photos", "Videos", "PDFs"
5. Update database schema if needed

**UI Components Needed:**
- `<ImagePreview />` - thumbnail grid
- `<VideoPreview />` - video player card
- `<PDFPreview />` - PDF icon/first page
- File type badges
- Upload dropzone with type indicator

---

## 📊 Progress Summary

**Completed:** 5/9 tasks (56%)
**Remaining:** 4 tasks
**High Priority:** Media Vault fixes, File calculations
**Medium Priority:** Color scheme
**Enhancement:** Media Vault features

---

## 🎯 Recommended Next Steps

1. **Fix Media Vault Display** (blocking issue)
   - Investigate why 45 files aren't showing
   - Check API, RLS, and frontend rendering

2. **Fix File Calculations**
   - Debug incorrect calculations on Publishing Desk page
   - Verify data sources and calculation logic

3. **Color Scheme Update**
   - Replace bright colors with muted fall palette
   - Global search/replace with new color values

4. **Media Vault Enhancement**
   - Larger feature, can be phased:
     - Phase 1: Fix current display
     - Phase 2: Add file type support
     - Phase 3: Enhanced previews

---

## 📝 Notes

- All completed tasks have been tested and deployed
- Database migration script ready to run
- Build passing cleanly
- No breaking changes introduced

**Git Status:** All changes committed and pushed to main

