# Policy Sources Status

This note tracks the current shape of policy-source ingestion in iGRAIL.

## Current State

- FreshRSS is the main live aggregation path.
- RSS parsing fallback exists for resilience.
- Mock items still exist so the UI can render during local work or missing integration setup.

## Why The Fallback Layers Matter

For students:

- live integrations fail
- credentials expire
- upstream feeds change format

If the app depends on a single happy path, a demo-friendly feature becomes operationally fragile. The layered fallback approach is intentional defensive engineering.

## Practical Next Improvements

- source health monitoring
- clearer freshness timestamps in the UI
- better source/category mapping rules
- tests around categorization drift
