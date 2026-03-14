# Jira Import Notes

**Date:** March 14, 2026  
**Project:** iGRAIL (`IG`)

## Outcome

The import of the deployment game plan largely worked.

Created issues:

- `IG-1` epic
- `IG-2` through `IG-16` tasks

## What Went Wrong

The import log in [JIRA Import Errrors.txt](/Users/jm/Projects/iGRAIL/docs/jira/JIRA%20Import%20Errrors.txt) shows repeated warnings like:

- "The version Infrastructure doesn't exist in this project and can't be added"
- "The version Backend doesn't exist in this project and can't be added"
- "The version Integrations doesn't exist in this project and can't be added"

## Most Likely Cause

The CSV included a `Component/s` column, but Jira appears to have interpreted or mapped those values against a project configuration that does not currently contain the referenced metadata.

In plain English:

- the issues were created
- the categorization metadata did not land the way the CSV intended

## Next Fix

Before the next Jira import, choose one path and stick to it:

1. pre-create the required components or versions in Jira
2. remove the `Component/s` column from the CSV
3. remap the column during import to a field that actually exists in the `IG` project

## Why This Note Exists

For students:

- successful partial imports can hide structural problems
- if you do not write down the warning immediately, the same mismatch usually repeats on the next import
- operational notes like this are part of engineering memory, not administrative clutter
