# Drafts Authentication & Authorization Implementation

**Date**: 2025-01-23
**Status**: ✅ Implemented
**Priority**: 🔴 Security Critical

---

## Overview

Implemented WordPress-style content access control to ensure contributors can only view and edit their own draft articles, while publishers and admins maintain full access to all content.

---

## Implementation Details

### 1. Database Layer: Row Level Security (RLS) Policies

**File**: `supabase/migrations/012_articles_rls_policies.sql`

#### Policies Implemented:

| Policy Name | Operation | Who | Access |
|-------------|-----------|-----|--------|
| `public_read_published_articles` | SELECT | Public | Published articles only |
| `contributors_read_own_drafts` | SELECT | Contributors | Own drafts only |
| `publishers_admins_read_all` | SELECT | Publishers/Admins | All articles |
| `authenticated_users_create_articles` | INSERT | Contributor+ | Can create articles |
| `contributors_update_own_drafts` | UPDATE | Contributors | Own drafts only (cannot publish) |
| `publishers_admins_update_all` | UPDATE | Publishers/Admins | All articles |
| `contributors_delete_own_drafts` | DELETE | Contributors | Own drafts only |
| `publishers_admins_delete_all` | DELETE | Publishers/Admins | All articles |

#### Key Security Features:

✅ **Contributors cannot publish** - They can only keep status as 'draft'
✅ **Contributors cannot edit others' drafts** - Enforced by `author_id` check
✅ **Contributors cannot delete published content** - Only own drafts
✅ **Public cannot access unpublished content** - Only published articles visible

---

### 2. API Layer: Role-Based Filtering

**File**: `app/api/admin/articles/route.ts`

#### GET Endpoint Changes:

**Before**:
```typescript
// All users saw all articles regardless of role
let query = supabase
  .from('articles')
  .select('...')
  .order('updated_at', { ascending: false });
```

**After**:
```typescript
// Role-based filtering
if (userRole === 'contributor') {
  query = query.eq('author_id', session.user.id);

  // Contributors default to drafts only
  if (!statusFilter) {
    query = query.eq('status', 'draft');
  } else if (statusFilter !== 'draft') {
    // Return empty if requesting non-draft statuses
    return NextResponse.json({
      articles: [],
      message: 'Contributors can only view their own drafts',
    });
  }
}
```

#### POST Endpoint Changes:

**Added**:
```typescript
// Set author_id to current user
author_id: session.user.id

// Enforce contributor limitations
if (profile.role === 'contributor' && requestedStatus !== 'draft') {
  return NextResponse.json(
    { error: 'Contributors can only create draft articles. Contact a publisher to publish.' },
    { status: 403 }
  );
}
```

---

## Access Control Matrix

| Role | View Own Drafts | View Others' Drafts | View Published | Create Draft | Publish | Edit Others' | Delete Others' |
|------|-----------------|---------------------|----------------|--------------|---------|--------------|----------------|
| **Reader** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Contributor** | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Publisher** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Testing Guide

### Test Case 1: Contributor Creates Draft
1. Login as contributor
2. Navigate to `/admin/articles/new`
3. Create article with status 'draft'
4. ✅ Should succeed
5. Navigate to `/admin` (Publishing Desk)
6. ✅ Should see only own draft in list

### Test Case 2: Contributor Tries to Publish
1. Login as contributor
2. Navigate to `/admin/articles/new`
3. Create article with status 'published'
4. ❌ Should fail with 403: "Contributors can only create draft articles"

### Test Case 3: Contributor Views Drafts List
1. Login as contributor
2. Navigate to `/admin`
3. ✅ Should see only own drafts
4. Click "All" filter
5. ✅ Should still only see own drafts
6. Click "Published" filter
7. ✅ Should see empty list with message "Contributors can only view their own drafts"

### Test Case 4: Publisher Views All Drafts
1. Login as publisher
2. Navigate to `/admin`
3. Click "Drafts" filter
4. ✅ Should see all drafts from all authors

### Test Case 5: Admin Full Access
1. Login as admin
2. Navigate to `/admin`
3. ✅ Should see all articles (drafts, scheduled, published)
4. Can edit any article
5. Can delete any article

---

## Migration Steps

### To Deploy:

```bash
# 1. Run migration on Supabase
# Navigate to Supabase Dashboard → SQL Editor
# Copy and paste: supabase/migrations/012_articles_rls_policies.sql
# Execute

# 2. Verify RLS is enabled
SELECT relrowsecurity FROM pg_class WHERE relname = 'articles';
# Expected: true

# 3. Check policies created
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'articles';
# Expected: 8 policies

# 4. Test with different user roles
# Create test users with roles: contributor, publisher, admin
# Test access control as per Test Cases above
```

### Rollback Plan:

```sql
-- Disable RLS if needed
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "public_read_published_articles" ON articles;
DROP POLICY IF EXISTS "contributors_read_own_drafts" ON articles;
DROP POLICY IF EXISTS "publishers_admins_read_all" ON articles;
DROP POLICY IF EXISTS "authenticated_users_create_articles" ON articles;
DROP POLICY IF EXISTS "contributors_update_own_drafts" ON articles;
DROP POLICY IF EXISTS "publishers_admins_update_all" ON articles;
DROP POLICY IF EXISTS "contributors_delete_own_drafts" ON articles;
DROP POLICY IF EXISTS "publishers_admins_delete_all" ON articles;
```

---

## Known Issues & Future Improvements

### TODO: Author Name Display
Currently showing "Admin" for all authors:
```typescript
author_name: 'Admin', // TODO: Join with user_profiles to get actual author name
```

**Fix**: Update API to join with user_profiles:
```typescript
.select('id, title, slug, ..., author:user_profiles(full_name, email)')
```

### TODO: Edit Route Protection
The edit route `/admin/articles/[id]/edit` needs similar protection to:
1. Prevent contributors from editing others' drafts
2. Prevent contributors from changing status to 'published'

**Files to update**:
- `app/admin/articles/[id]/edit/page.tsx`
- `app/api/admin/articles/[id]/route.ts` (PUT endpoint)

---

## Security Audit Checklist

- [x] RLS enabled on articles table
- [x] Public cannot access unpublished content
- [x] Contributors restricted to own drafts
- [x] Contributors cannot publish
- [x] Publishers can access all content
- [x] Admins have full access
- [x] Author ID set on article creation
- [x] Role verified on every API request
- [ ] Edit route protected (TODO)
- [ ] Delete route protected (TODO)
- [ ] Author names displayed correctly (TODO)

---

## References

- **Database Schema**: `lib/database/schema.sql:94-140`
- **Auth Types**: `lib/auth/types.ts`
- **Role Capabilities**: `lib/auth/types.ts:24-61`
- **RLS Migration**: `supabase/migrations/012_articles_rls_policies.sql`
- **API Route**: `app/api/admin/articles/route.ts:115-234`

---

**Implementation Status**: ✅ Core functionality complete
**Deployment Status**: ⏳ Ready for migration
**Next Steps**: Deploy to Vercel, run migration on Supabase, test with multiple user roles
