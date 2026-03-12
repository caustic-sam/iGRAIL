# Security Audit Findings

This file is the short current summary, not the full historical audit package.

## Recently Addressed

- admin API routes now verify the caller before any service-role query runs
- diagnostic routes are blocked in production
- auth checks use request-bound server clients instead of assuming global auth state

## Still Worth Watching

- service-role usage should stay tightly scoped
- debug or diagnostic routes should remain opt-in and non-public
- route protection must continue to exist at both the navigation layer and the API layer

## Historical Material

The large legacy audit package is preserved under `docs/archive/security-audit-2025-11-03/` for reference.
