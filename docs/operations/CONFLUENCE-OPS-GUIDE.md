# Confluence Operations Guide

Use this only if you are syncing iGRAIL documentation into Confluence.

## Purpose

The repository is the source of truth. Confluence is a publishing target for stakeholders who need a browsable documentation surface outside Git.

That means the safe order is:

1. update the repo document first
2. verify the repo version is correct
3. sync or copy the final version into Confluence

## Operating Rule

Do not edit Confluence first and then try to back-port the changes manually. That creates drift immediately.

## Before Syncing

- confirm the document you are syncing is in the active `docs/` surface, not `docs/archive/`
- make sure product naming is current (`iGRAIL`, not older names)
- remove temporary notes or one-off debugging details

## Good Candidates For Sync

- architecture summaries
- deployment steps
- testing workflow
- current operating procedures

## Bad Candidates For Sync

- archived sprint notes
- temporary troubleshooting journals
- personal handoff notes
- output artifacts copied from tools
