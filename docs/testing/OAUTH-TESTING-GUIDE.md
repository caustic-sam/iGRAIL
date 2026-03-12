# OAuth Testing Guide

Use this when you need to verify that Supabase sign-in still works end to end.

## Test Goal

Confirm all of these are true:

- the user can sign in through the provider
- the callback completes successfully
- a session exists after redirect
- protected admin navigation behaves correctly
- admin APIs still enforce role checks

## Manual Flow

1. Start the app with `pnpm dev`.
2. Open `/login`.
3. Sign in through the configured provider.
4. Confirm the app returns through `/auth/callback`.
5. Confirm you land on the intended route, usually `/admin`.

## What To Verify After Sign-In

- the header changes from signed-out to signed-in state
- `/admin` is reachable for an admin user
- `/api/admin/articles` succeeds for an admin user
- `/api/admin/articles` fails for a non-admin or signed-out user

## Teaching Note

OAuth tests are not only UI tests. They are also security tests because the identity handoff must connect correctly to the app’s own role system.
