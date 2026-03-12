# Supabase OAuth Setup

Use this guide to connect GitHub or other providers to iGRAIL through Supabase Auth.

## Core Idea

Supabase handles identity. iGRAIL still needs its own user profile row to understand application roles such as `admin`.

That distinction matters:

- authentication answers “who is this?”
- authorization answers “what may they do?”

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Redirect Shape

The login flow returns through:

```text
/auth/callback?redirectTo=/admin
```

Make sure your Supabase provider settings allow the site URL plus that callback path.

## Validation Steps

1. Sign in through the provider.
2. Confirm the callback succeeds.
3. Confirm a matching `user_profiles` row exists.
4. Confirm an admin user can reach `/admin`.
5. Confirm a non-admin user cannot use admin APIs directly.

## Teaching Note

Many auth bugs are really authorization bugs. A successful OAuth popup does not prove the app is secure. The role checks after sign-in matter just as much as the provider setup.
