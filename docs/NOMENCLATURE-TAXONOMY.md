# Nomenclature And Taxonomy

This file records the names that should be treated as canonical in the current iGRAIL codebase.

## Product Name

- Canonical product name: `iGRAIL`
- Expanded label when helpful: `Global Policy Intelligence`

Older names such as `GAILP` and `World Papers` still appear in archived material. They should not be used in active product copy or current operational docs.

## Main User-Facing Sections

| Route | Label | Purpose |
| --- | --- | --- |
| `/policy-updates` | Policy Updates | fast-moving public policy feed |
| `/blog` | Think Tank | editorial analysis and commentary |
| `/videos` | Global Service Announcement | video content |
| `/policy-pulse` | Policy Pulse | live feed aggregation |
| `/policies` | Policies | policy reference surface |
| `/about` | About | project/about page |

## Internal/Admin Language

| Route | Label |
| --- | --- |
| `/admin` | Publishing Desk |
| `/admin/studio` | Studio |
| `/admin/media` | Media Vault |
| `/admin/settings` | Settings |

## Storage And Key Names

Use the iGRAIL name for new browser and application keys.

Example:

- current feature flag storage key: `igrail_feature_flags`

When legacy keys exist, migration code may still read them for compatibility, but new writes should use the iGRAIL form.
