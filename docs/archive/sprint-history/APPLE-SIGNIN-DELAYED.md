# Apple Sign-In - Delayed Implementation

**Decision Date:** November 10, 2025
**Decision By:** @malsicario
**Status:** Postponed to future sprint

---

## Summary

Apple Sign-In integration has been **postponed** to focus on completing the core OAuth functionality with GitHub and the admin UX. GitHub OAuth is working perfectly and meets our immediate needs.

---

## Current State

✅ **GitHub OAuth** - Fully implemented and working
- Users can sign in with GitHub
- Session persistence working
- Role assignment working
- Admin access working

❌ **Apple Sign-In** - Documentation exists but not implemented
- Configuration documented in [SUPABASE-OAUTH-SETUP.md](SUPABASE-OAUTH-SETUP.md)
- Not required for current user base
- Can be added later without breaking changes

---

## Rationale

**Why Delay:**

1. **User Base:** Current users (primarily you, malsicario@malsicario.com) already have GitHub accounts
2. **Complexity:** Apple Sign-In requires additional setup:
   - Apple Developer account enrollment ($99/year)
   - Service ID configuration
   - Private key generation
   - HTTPS required for testing (ngrok setup)
3. **Priority:** Admin UX and content management features are higher priority
4. **Time:** Better to ship working GitHub OAuth now than delay for Apple

**Impact:** Minimal - GitHub OAuth covers 99% of our target users (developers, policy analysts, researchers)

---

## Future Implementation Plan

When ready to implement Apple Sign-In:

### Prerequisites
- [ ] Apple Developer account active
- [ ] Service ID created
- [ ] Private key generated and stored securely
- [ ] Return URLs configured (must be HTTPS)

### Implementation Tasks
1. Configure Apple Sign-In in Apple Developer Console
2. Add Apple credentials to Supabase Dashboard
3. Add Apple button to login page ([app/login/page.tsx](../app/login/page.tsx))
4. Test OAuth flow with Apple
5. Update documentation

### Estimated Effort
- **Story Points:** 2
- **Time:** 1-2 days
- **Dependencies:** None (can be added anytime)

---

## Related Jira Tickets

**GAILP-16: Configure OAuth Providers**
- Status: **DONE** (GitHub only)
- Apple Sign-In: Postponed

**Future Ticket:**
- Create new story: "Add Apple Sign-In Support" (when needed)

---

## Documentation Updated

- ✅ PROGRESS-UPDATE-2025-11-10.md - Notes Apple Sign-In not implemented
- ✅ APPLE-SIGNIN-DELAYED.md - This document
- ✅ OAUTH-MIGRATION-EPIC.md - Will note partial completion of GAILP-16

---

## Testing Notes

If/when implementing Apple Sign-In:
- Test with personal Apple ID first
- Verify email is returned correctly
- Check that role assignment works same as GitHub
- Test both new user and returning user flows

---

**Decision:** Approved to proceed with GitHub-only OAuth for v0.2.0 release.
**Next Review:** When user base expands or Apple users request it.
