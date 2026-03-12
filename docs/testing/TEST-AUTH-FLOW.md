# Auth Flow Notes

This file exists as a short companion to the OAuth testing guide.

## Current Model

- navigation protection happens in [proxy.ts](/Users/jm/Projects/iGRAIL/proxy.ts)
- API authorization happens in [lib/route-guards.ts](/Users/jm/Projects/iGRAIL/lib/route-guards.ts)
- the login page returns through `/auth/callback`

## Why Both Layers Matter

For students:

- a redirect check protects pages
- a route guard protects data and mutations

If you only protect one of those layers, you do not actually have a complete auth boundary.
