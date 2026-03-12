# GAILP: 5-Day Launch Plan
## Target Launch: January 1, 2026

**Generated:** December 26, 2025
**Status:** Pre-Launch Sprint
**Mission:** Transform rapid prototype into production-ready MVP

---

## Executive Summary

### Current State Assessment
- **Code Base:** 101 source files, 206 commits in 2 months
- **Audit Results:** 123 issues identified
  - 🔴 **1 Critical** (RLS Disabled)
  - 🟠 **2 High** (Security & Code Quality)
  - 🟡 **14 Medium** (Links, Features, TODOs)
  - 🟢 **105 Low** (Console.logs, Alt text, etc.)
- **Launch Readiness:** 7.5/10 (Conditional GO)

### Strategic Decisions Made
✅ **Test First, Secure Later** - Fix RLS on Day 3-4
✅ **Simplify Auth** - Only `admin` and `reader` roles for MVP
✅ **Cut for Launch:**
  - Quick Posts webhook integration
  - Scheduled Publishing auto-publish
  - View Count tracking
  - FreshRSS integration

### Launch Criteria
1. ✅ All CRITICAL issues resolved
2. ✅ All HIGH issues resolved
3. ✅ Broken links fixed
4. ✅ Auth working for admin/reader roles
5. ✅ Deployment tested on preview
6. ✅ No console errors on production

---

## Day-by-Day Plan

## 📅 Day 1: Thursday, December 26 (TODAY)
**Theme: Audit & Simplify**

### Morning (9am - 12pm): Feature Simplification
- [ ] **Remove Quick Posts** from navigation and feature flags
- [ ] **Disable Scheduled Publishing UI** in article editor
- [ ] **Hide incomplete features** via feature flags
- [ ] Update README to reflect MVP scope

### Afternoon (1pm - 5pm): Auth Simplification
- [ ] **Simplify user roles** to `admin` and `reader` only
- [ ] Remove `publisher` and `contributor` roles from:
  - Database migration (create new migration)
  - User profiles table
  - Auth context
  - Middleware checks
- [ ] **Fix broken login routes:**
  - Create `/login` page (currently missing)
  - Update all `/login` references
  - Test OAuth flow (GitHub, Google)
- [ ] **Verify middleware protection** for admin routes

### Evening (6pm - 8pm): Documentation
- [ ] Document what was cut for MVP (FEATURES-DEFERRED.md)
- [ ] Update deployment checklist
- [ ] Create post-launch roadmap (V1.1 features)

**📊 End of Day 1 Metrics:**
- Issues resolved: ~20 (links + auth + features)
- Remaining issues: ~103
- Launch readiness: 8.0/10

---

## 📅 Day 2: Friday, December 27
**Theme: Code Cleanup & Testing**

### Morning (9am - 12pm): Code Quality
- [ ] **Fix all TODO comments** (4 found)
- [ ] **Fix FIXME** in audit script
- [ ] **Remove console.log** statements from source (not scripts)
- [ ] **Add author_name join** in admin articles API
- [ ] **Fix component registry count** in Studio page

### Afternoon (1pm - 5pm): UX Polish
- [ ] **Add alt text** to all images (critical accessibility)
  - Priority: public-facing pages first
  - Admin pages can be lower priority
- [ ] **Verify site name consistency** (World Papers vs GAILP)
- [ ] **Test mobile responsiveness** on key pages:
  - Homepage
  - Article detail
  - Admin dashboard

### Evening (6pm - 8pm): Manual Testing Round 1
- [ ] **Follow QA Briefing checklist** (KAN-77)
- [ ] Test critical user flows:
  - ✓ Homepage loads with data
  - ✓ Click article → View detail page
  - ✓ Login as admin → Access dashboard
  - ✓ Create draft article → Save
  - ✓ Upload image → Appears in media vault
  - ✓ Publish article → Appears on frontend
  - ✓ Delete article → Removed from dashboard
- [ ] Document any new bugs found

**📊 End of Day 2 Metrics:**
- Issues resolved: ~60 (code quality + UX)
- Remaining issues: ~63
- Launch readiness: 8.5/10

---

## 📅 Day 3: Saturday, December 28
**Theme: Security & Database**

### Morning (9am - 12pm): RLS Preparation
- [ ] **Review RLS migration** (`012_articles_rls_policies.sql`)
- [ ] **Update RLS policies** for simplified roles (admin/reader only)
- [ ] **Create new migration:** `015_enable_rls_simplified.sql`
- [ ] **Update API routes** to use authenticated Supabase client:
  - `/api/admin/articles` - use service role for admin
  - `/api/articles` - use anon key for public
  - Verify `createServerClient` usage

### Afternoon (1pm - 5pm): Re-enable RLS
- [ ] **Apply RLS migration** to database
- [ ] **Test with different user contexts:**
  - Anonymous user → Can only see published articles
  - Admin user → Can see/edit/delete all articles
- [ ] **Verify API responses:**
  - Public endpoint returns only published
  - Admin endpoint returns all (when authenticated)
- [ ] **Check for RLS errors** in Supabase logs

### Evening (6pm - 8pm): Security Hardening
- [ ] **Test OAuth login flow** end-to-end
- [ ] **Verify middleware protection:**
  - `/admin/*` requires authentication
  - Unauthenticated users redirected to login
- [ ] **Check environment variables** are not exposed
- [ ] **Review security headers** in next.config.js

**📊 End of Day 3 Metrics:**
- Issues resolved: CRITICAL + HIGH (3)
- Remaining issues: ~60 (mostly low priority)
- Launch readiness: 9.0/10 🎯

---

## 📅 Day 4: Sunday, December 29
**Theme: Deployment Dry Run**

### Morning (9am - 12pm): Pre-Deployment
- [ ] **Set environment variables** in Vercel dashboard:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - NEXT_PUBLIC_SITE_NAME="World Papers"
  - NEXT_PUBLIC_SITE_URL="https://malsicario.com"
- [ ] **Run production build** locally:
  ```bash
  npm run build
  npm run start
  ```
- [ ] **Test production build** on localhost:3000

### Afternoon (1pm - 5pm): Preview Deployment
- [ ] **Push to main branch** (triggers Vercel auto-deploy)
- [ ] **Wait for build** to complete
- [ ] **Get preview URL** from Vercel dashboard
- [ ] **Run smoke test:**
  ```bash
  npx tsx scripts/smoke-test.ts https://[preview-url]
  ```
- [ ] **Run full deployment test:**
  ```bash
  DEPLOYMENT_URL=https://[preview-url] npx tsx scripts/test-deployment.ts
  ```

### Evening (6pm - 8pm): Fix Deployment Issues
- [ ] **Review test results** and fix any failures
- [ ] **Check Vercel build logs** for warnings
- [ ] **Test on preview URL:**
  - Login flow
  - Admin dashboard
  - Article viewing
  - Image loading
- [ ] **Monitor Supabase logs** for errors
- [ ] **Re-deploy if needed** and re-test

**📊 End of Day 4 Metrics:**
- Deployment: Preview successful
- All critical paths tested
- Launch readiness: 9.5/10 🚀

---

## 📅 Day 5: Monday, December 30
**Theme: Final Polish & Production Prep**

### Morning (9am - 12pm): Final Testing
- [ ] **Re-run comprehensive audit:**
  ```bash
  npx tsx scripts/pre-launch-audit.ts
  ```
- [ ] **Verify 0 critical issues**
- [ ] **Manual testing round 2:**
  - Test on multiple browsers (Chrome, Firefox, Safari)
  - Test on mobile devices (iOS, Android)
  - Test in incognito mode (cleared cache)
- [ ] **Performance check:**
  - Run Lighthouse audit (target: >80)
  - Check page load times
  - Verify images are optimized

### Afternoon (1pm - 5pm): Documentation & Backup
- [ ] **Update README** with:
  - Live URL
  - Known limitations
  - Post-launch roadmap
- [ ] **Create LAUNCH-NOTES.md** documenting:
  - What shipped
  - What was cut
  - Known issues (non-blocking)
  - Monitoring plan
- [ ] **Backup database:**
  ```sql
  -- In Supabase dashboard, create backup before launch
  ```
- [ ] **Tag release:**
  ```bash
  git tag v1.0.0-rc1
  git push origin v1.0.0-rc1
  ```

### Evening (6pm - 8pm): Production Readiness
- [ ] **Final code review:**
  - No console.log in source
  - No TODO/FIXME in critical paths
  - All environment variables documented
- [ ] **Verify custom domain setup:**
  - malsicario.com added to Vercel
  - DNS records ready (don't point yet)
  - SSL certificate ready
- [ ] **Create rollback plan:**
  - Document how to revert deployment
  - Test rollback procedure on preview
- [ ] **Set up monitoring:**
  - Enable Vercel Analytics
  - Configure error tracking
  - Set up uptime monitoring

**📊 End of Day 5 Metrics:**
- All critical/high issues resolved: ✅
- Deployment tested: ✅
- Documentation complete: ✅
- Launch readiness: 10/10 🎉

---

## 📅 Launch Day: Tuesday, December 31
**Theme: Deploy to Production**

### Pre-Launch Checklist (Morning)
- [ ] ☕ Get coffee, take deep breath
- [ ] **Final smoke test** on preview URL
- [ ] **Review launch checklist** one more time
- [ ] **Have rollback plan ready**
- [ ] **Monitor dashboard open:**
  - Vercel deployment logs
  - Supabase database logs
  - Browser console (in case of errors)

### Launch Sequence (Noon)
```bash
# 1. Final commit
git add .
git commit -m "🚀 v1.0.0 - Initial launch"

# 2. Tag release
git tag v1.0.0
git push origin main
git push origin v1.0.0

# 3. Wait for Vercel deployment (auto-triggered)
# Monitor at: https://vercel.com/dashboard

# 4. Once deployed, point domain
# In Vercel: Add malsicario.com
# In DNS: Update A/CNAME records

# 5. Wait for SSL certificate (5-10 minutes)

# 6. Test production URL
npx tsx scripts/smoke-test.ts https://malsicario.com
```

### Post-Launch Monitoring (First 4 Hours)
- [ ] **Hour 1:** Check every 15 minutes
  - Monitor Vercel Analytics
  - Check Supabase logs for errors
  - Test login flow
  - Test article viewing
- [ ] **Hour 2-4:** Check every 30 minutes
  - Review error logs
  - Monitor performance metrics
  - Check mobile responsiveness
  - Test from different locations (VPN)

### Post-Launch Communication
- [ ] **Announce launch** (wherever appropriate)
- [ ] **Create LAUNCH-RETROSPECTIVE.md**:
  - What went well
  - What was challenging
  - Lessons learned
  - Next steps

---

## 🎯 Success Criteria

### Must Have (Blocking)
- ✅ RLS enabled and working
- ✅ Admin authentication works
- ✅ Articles can be created, published, viewed
- ✅ Images upload and display
- ✅ No critical security vulnerabilities
- ✅ Site accessible at malsicario.com
- ✅ Mobile responsive

### Should Have (Non-blocking)
- ✅ All links work correctly
- ✅ SEO meta tags present
- ✅ Performance score >80
- ✅ No console errors
- ✅ Accessibility score >80

### Nice to Have (Post-launch)
- ⏭️ View count tracking
- ⏭️ Scheduled publishing
- ⏭️ Quick Posts integration
- ⏭️ Advanced analytics
- ⏭️ Email notifications

---

## 🚨 Risk Mitigation

### High-Risk Areas
1. **RLS Re-enablement (Day 3)**
   - Risk: API routes may break
   - Mitigation: Test thoroughly with different user contexts
   - Rollback: Keep 014_disable_rls_temp.sql if needed

2. **OAuth Authentication**
   - Risk: Login flow may fail in production
   - Mitigation: Test in preview environment first
   - Rollback: Disable OAuth, email-only for launch

3. **Domain DNS Propagation**
   - Risk: DNS changes can take hours
   - Mitigation: Prepare DNS records in advance, test with preview URL
   - Rollback: Keep preview URL accessible

### Rollback Procedure
```bash
# If launch fails, immediately:
1. Revert DNS to preview URL
2. Git revert to last known good commit
3. Disable RLS if database issues
4. Document what went wrong
5. Fix in staging, re-test, re-launch
```

---

## 📊 Progress Tracking

### Daily Stand-up Questions
1. What did I complete yesterday?
2. What am I working on today?
3. What blockers do I have?

### Issue Tracker
Use audit-report.json as source of truth:
```bash
# Re-run audit daily
npx tsx scripts/pre-launch-audit.ts

# Track progress
git diff audit-report.json
```

---

## 🎉 Post-Launch (January 1+)

### Week 1 Priorities
1. **Monitor & Stabilize**
   - Review Vercel Analytics daily
   - Fix any critical bugs immediately
   - Monitor Supabase usage/limits

2. **Gather Feedback**
   - Test with real users
   - Document feature requests
   - Prioritize bug fixes

3. **Plan V1.1**
   - Add view count tracking
   - Implement scheduled publishing
   - Consider Web3 integration roadmap

### V1.1 Roadmap (January 15+)
- [ ] Scheduled publishing with cron job
- [ ] View count and article metrics
- [ ] Quick Posts re-integration
- [ ] Enhanced analytics dashboard
- [ ] Performance optimizations
- [ ] Web3 features (per dual-track plan)

---

## 📞 Emergency Contacts

### Critical Resources
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **GitHub Repo:** (your repo URL)
- **DNS Provider:** (your DNS provider)

### Key Files Reference
- `/docs/DEPLOYMENT-GUIDE.md` - Deployment instructions
- `/docs/POST-DEPLOYMENT-CHECKLIST.md` - Testing checklist
- `/docs/QA-BRIEFING-KAN-77.md` - QA testing guide
- `/audit-report.json` - Latest audit results
- `/scripts/pre-launch-audit.ts` - Re-run anytime
- `/scripts/smoke-test.ts` - Quick deployment test
- `/scripts/test-deployment.ts` - Comprehensive test

---

## 💡 Pro Tips

### Stay Focused
- ❌ **Don't:** Add new features during launch week
- ✅ **Do:** Fix bugs, remove broken features, stabilize

### Manage Scope Creep
- ❌ **Don't:** "While I'm here, let me also..."
- ✅ **Do:** Write it down for V1.1, stay on task

### Test Everything Twice
- ❌ **Don't:** "It worked locally, should be fine"
- ✅ **Do:** Test in preview, test in production

### Document As You Go
- ❌ **Don't:** "I'll document this later"
- ✅ **Do:** Update docs immediately while fresh

### Communicate Progress
- ❌ **Don't:** Work in silence, surprise on launch day
- ✅ **Do:** Daily updates, share wins and blockers

---

## 🚀 Let's Ship This!

**Remember:**
- Perfect is the enemy of done
- Launch and iterate
- V1.0 is just the beginning
- You've got this! 💪

---

**Generated:** December 26, 2025
**Next Update:** End of Day 1
**Questions?** Review audit-report.json or run scripts/pre-launch-audit.ts
