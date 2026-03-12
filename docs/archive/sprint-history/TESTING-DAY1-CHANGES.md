# Day 1 Changes - Manual Testing Script (Hybrid: Local + Vercel)
**Date:** December 26, 2025
**Purpose:** Verify Quick Posts removal, login flow, and simplified authentication

---

## Testing Strategy

We'll use a **hybrid approach** for maximum efficiency:

- 🏠 **Local (localhost:3000):** UI, navigation, non-auth features
- ☁️ **Vercel Preview:** OAuth login, auth flow, middleware protection

**Why?** OAuth requires a public URL. Rather than fight with localhost OAuth setup, we'll use Vercel preview deployments for auth testing only.

---

## Prerequisites

### Part 1: Local Testing Setup
- [ ] Development server running: `npm run dev`
- [ ] Browser open at http://localhost:3000
- [ ] Browser console accessible (F12)

### Part 2: Vercel Preview Deployment
- [ ] Push your changes to trigger deployment:
  ```bash
  git add .
  git commit -m "test: Day 1 changes - auth simplification"
  git push origin main
  ```
- [ ] Get your preview URL from Vercel:
  - Visit: https://vercel.com/dashboard
  - Find latest deployment
  - Copy preview URL (e.g., `https://www-gailp-prd-xxxxx.vercel.app`)
- [ ] Set environment variable: `PREVIEW_URL="https://your-preview-url.vercel.app"`

**Your Preview URL:** _________________________________

---

## PART A: Local Tests (No Auth Required)

Run these tests on **http://localhost:3000**

---

## Test Suite 1: Quick Posts Feature Removal
**Environment:** 🏠 Local
**Goal:** Verify Quick Posts are hidden and show "Coming Soon"

### Test 1.1: Public Quick Posts Page
1. **Navigate to:** http://localhost:3000/quick-posts
2. **Expected Result:**
   - ✅ See "Coming Soon!" message with rocket icon 🚀
   - ✅ Message says "Quick Posts is a planned feature for our next release (V1.1)"
   - ✅ After 3 seconds, automatically redirects to homepage (/)
3. **Pass/Fail:** ______

**Screenshot opportunity:** The "Coming Soon" page looks nice!

### Test 1.2: Feature Flags Check
1. **Open browser console** (F12 or Cmd+Opt+I)
2. **Run:** `localStorage.getItem('gailp_feature_flags')`
3. **Expected Result:**
   - ✅ Either `null` (using defaults) or JSON object
   - ✅ If JSON exists, `showQuickPosts` should be `false`
   - ✅ `showScheduledPublishing` should be `false`
4. **Pass/Fail:** ______

---

## Test Suite 2: Navigation & UX (No Auth)
**Environment:** 🏠 Local
**Goal:** Ensure site navigation works

### Test 2.1: Header Navigation
**Click through each nav link:**
1. [ ] "Policy Updates" → `/policy-updates`
2. [ ] "Think Tank" → `/blog`
3. [ ] "Global Service Announcement" → `/videos`
4. [ ] "Policy Pulse" → `/policy-pulse`
5. [ ] "Policies" → `/policies`
6. [ ] "About" → `/about`

**All links work?** ______

### Test 2.2: Homepage Loads
1. **Navigate to:** http://localhost:3000
2. **Check for:**
   - [ ] Hero section with rotating stats (if enabled)
   - [ ] Policy feed cards
   - [ ] Featured article (if exists)
   - [ ] Footer with links
3. **Pass/Fail:** ______

### Test 2.3: Article Viewing
1. **Navigate to:** http://localhost:3000/articles
2. **Click any article**
3. **Expected Result:**
   - ✅ Article detail page loads
   - ✅ Title, content, and featured image display
   - ✅ SEO fields visible
4. **Pass/Fail:** ______

---

## Test Suite 3: Console Errors Check (Local)
**Environment:** 🏠 Local
**Goal:** No JavaScript errors

### Test 3.1: Check for Errors
1. **Open browser console** (F12)
2. **Navigate through the app:**
   - Homepage
   - Articles page
   - Policy updates
   - About page
3. **Expected Result:**
   - ✅ No RED errors in console
   - ⚠️ Yellow warnings are OK (but note them)
   - ℹ️ Blue info logs are expected
4. **Any errors found?** ______
5. **If yes, list them:**
   ```


   ```

---

## PART B: Vercel Preview Tests (Auth Required)

Run these tests on your **Vercel Preview URL**

**Before starting:** Make sure you have your preview URL from Vercel dashboard!

---

## Test Suite 4: Middleware Protection
**Environment:** ☁️ Vercel Preview
**Goal:** Verify admin routes are protected

### Test 4.1: Access Admin Without Authentication
1. **Open incognito/private window**
2. **Navigate to:** `https://[your-preview-url]/admin`
3. **Expected Result:**
   - ✅ Redirects to `/login?redirectTo=/admin`
   - ✅ URL bar shows: `.../login?redirectTo=%2Fadmin`
   - ✅ Login page displays with GitHub sign-in button
4. **Pass/Fail:** ______

### Test 4.2: Other Admin Routes Protection
**In the same incognito window:**

1. **Navigate to:** `https://[your-preview-url]/admin/articles/new`
   - ✅ Redirects to `/login?redirectTo=/admin/articles/new`

2. **Navigate to:** `https://[your-preview-url]/admin/media`
   - ✅ Redirects to `/login?redirectTo=/admin/media`

3. **Pass/Fail:** ______

### Test 4.3: Login Page Displays Correctly
**Check the login page contents:**
- [ ] GAILP logo with Globe icon visible
- [ ] "Welcome to GAILP" heading
- [ ] Three feature boxes (Real-time Policy Updates, Expert Analysis, Secure Access)
- [ ] "Sign in with GitHub" button (dark gray/black)
- [ ] Terms of Service text at bottom

**Pass/Fail:** ______

---

## Test Suite 5: OAuth Login Flow
**Environment:** ☁️ Vercel Preview (CRITICAL - Won't work on localhost!)
**Goal:** Complete login and verify redirect behavior

### Test 5.1: GitHub OAuth Login
**Start fresh with incognito window on Vercel preview URL**

1. **Navigate to:** `https://[your-preview-url]/login`
2. **Click** "Sign in with GitHub"
3. **Expected Flow:**
   - ✅ Redirects to GitHub OAuth consent page
   - ✅ Shows permissions request (if first time)
4. **Authorize the app** on GitHub
5. **Expected Result:**
   - ✅ Redirects back to `/auth/callback?code=...`
   - ✅ Then redirects to `/admin` (because you have admin role)
   - ✅ You should see the "Publishing Desk" admin dashboard
6. **Open browser console** - look for logs:
   - `🔄 OAuth callback received`
   - `✅ Redirecting to: /admin`
7. **Pass/Fail:** ______

**Note:** If this fails, check:
- Is your preview URL added to GitHub OAuth app settings?
- Are environment variables set in Vercel dashboard?

### Test 5.2: Verify Session Persistence
**Still on Vercel preview, logged in:**

1. **Refresh the page** (F5)
2. **Expected Result:**
   - ✅ Still logged in (no redirect to login)
   - ✅ Dashboard loads without re-authenticating
3. **Open new tab** and navigate to `https://[your-preview-url]/admin`
4. **Expected Result:**
   - ✅ Dashboard loads immediately (session persists across tabs)
5. **Pass/Fail:** ______

### Test 5.3: Verify Redirect Parameter Works
**Test the redirectTo functionality:**

1. **Log out** (click avatar → Sign Out)
2. **Navigate to:** `https://[your-preview-url]/login?redirectTo=/admin/media`
3. **Sign in with GitHub** again
4. **Expected Result:**
   - ✅ After auth, lands on `/admin/media` (Media Vault page)
   - ✅ NOT the main admin dashboard
5. **Pass/Fail:** ______

---

## Test Suite 6: Admin Quick Posts Redirect
**Environment:** ☁️ Vercel Preview (must be logged in)
**Goal:** Verify admin quick posts shows "Coming Soon"

### Test 6.1: Admin Quick Posts Page
**While logged in to Vercel preview:**

1. **Navigate to:** `https://[your-preview-url]/admin/quick-posts`
2. **Expected Result:**
   - ✅ Shows "Coming Soon!" message
   - ✅ Message says "Quick Posts management is a planned feature for V1.1"
   - ✅ After 3 seconds, redirects to `/admin` dashboard
3. **Pass/Fail:** ______

---

## Test Suite 7: Simplified Roles Verification
**Environment:** ☁️ Vercel Preview (logged in)
**Goal:** Verify only admin role is recognized

### Test 7.1: Check Your User Profile
**While logged in on Vercel preview:**

1. **Look for your avatar/name** in top-right header
2. **Click it** to open user menu
3. **Expected Result:**
   - ✅ Shows your email
   - ✅ Shows "Sign Out" option
4. **Pass/Fail:** ______

### Test 7.2: Verify Admin Capabilities
**Test these admin-only features on Vercel preview:**

1. **Navigate to:** `/admin/articles/new`
   - [ ] Can access article editor
   - [ ] Can see featured image upload section

2. **Navigate to:** `/admin/media`
   - [ ] Can access media vault
   - [ ] Can see upload button

3. **Navigate to:** `/admin/settings`
   - [ ] Can access feature flags settings
   - [ ] Can see toggle switches

**All pass?** ______

### Test 7.3: Admin Navigation Works
1. **On Vercel preview, go to:** `/admin`
2. **Check sidebar/navigation:**
   - [ ] Publishing Desk (dashboard)
   - [ ] New Article button
   - [ ] Media Vault link
   - [ ] Studio link
   - [ ] Settings link
3. **Click each link** - verify they work

**All links work?** ______

### Test 7.4: Sign Out Flow
1. **Click your avatar** in top-right header
2. **Click "Sign Out"**
3. **Expected Result:**
   - ✅ Redirects to homepage (/)
   - ✅ Header now shows "Sign In" button instead of avatar
   - ✅ Cannot access `/admin` anymore (redirects to login)
4. **Pass/Fail:** ______

---

## Test Suite 8: Admin Dashboard Stats
**Environment:** ☁️ Vercel Preview (logged in)
**Goal:** Verify dashboard displays correctly

### Test 8.1: Dashboard Stats Display
1. **Log in and go to:** `/admin`
2. **Check stats at top:**
   - [ ] Total Articles count shows (not 0)
   - [ ] Published count shows
   - [ ] Drafts count shows
3. **Do numbers look reasonable?** ______
4. **Pass/Fail:** ______

---

## Summary & Results

### Test Results Overview
```
LOCAL TESTS:
Test Suite 1 (Quick Posts):        ___/2 passed
Test Suite 2 (Navigation):         ___/3 passed
Test Suite 3 (Console Errors):     ___/1 passed

VERCEL TESTS:
Test Suite 4 (Middleware):         ___/3 passed
Test Suite 5 (OAuth Flow):         ___/3 passed
Test Suite 6 (Admin Quick Posts):  ___/1 passed
Test Suite 7 (Simplified Roles):   ___/4 passed
Test Suite 8 (Dashboard Stats):    ___/1 passed

TOTAL:                             ___/18 passed
```

### Overall Assessment
- [ ] **ALL TESTS PASSED (18/18)** - Ready to move to next phase! 🎉
- [ ] **MOST TESTS PASSED (14-17/18)** - Minor issues to fix
- [ ] **SIGNIFICANT FAILURES (<14/18)** - Need debugging

---

## Environment Check

### Local Development (localhost:3000)
- Works: ✅ UI, navigation, pages, non-auth features
- Doesn't work: ❌ OAuth login (GitHub requires public URL)

### Vercel Preview
- Works: ✅ Everything including OAuth
- Limitation: ⏱️ Requires deployment (1-2 min wait)

---

## Troubleshooting

### "OAuth redirect mismatch" error on Vercel
**Solution:**
1. Go to GitHub → Settings → Developer Settings → OAuth Apps
2. Find your GAILP app
3. Add your Vercel preview URL to "Authorization callback URL"
4. Format: `https://your-preview-url.vercel.app/auth/callback`

### "Environment variable not found" on Vercel
**Solution:**
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your Vercel URL)

### Session not persisting on Vercel
**Check:**
- Cookies are enabled in browser
- Not in "strict" privacy mode
- Supabase project is accessible (not paused)

---

## Issues Found During Testing

**List any bugs, errors, or unexpected behavior:**

1. _______________________________________________________________

2. _______________________________________________________________

3. _______________________________________________________________

---

## Next Steps

**If all tests passed:**
- ✅ Mark Day 1 changes as verified
- ✅ Decide next priority:
  - Option A: Fix broken links (medium priority)
  - Option B: Re-enable RLS (critical priority)
  - Option C: Deploy migration 015 (simplify roles in DB)

**If tests failed:**
- 🔧 Document failures above
- 🔧 Share with Claude for debugging
- 🔧 Re-run failed tests after fixes

---

## Deployment Workflow Going Forward

### For Quick UI/Code Testing
```bash
npm run dev  # Test locally at localhost:3000
```

### For Auth/Security Testing
```bash
git add .
git commit -m "descriptive message"
git push origin main
# Wait ~90 seconds, then test on Vercel preview
```

### Recommendation
- Do most development locally
- Deploy to Vercel 2-3 times per day for auth testing
- Always deploy before major milestones (end of day, before RLS changes, etc.)

---

## Notes & Observations

**Space for your notes while testing:**

```




```

---

**Tester:** _______________
**Date Completed:** _______________
**Time Spent:** _______________ minutes

**Environments Used:**
- [ ] Local (localhost:3000)
- [ ] Vercel Preview: _______________________________
