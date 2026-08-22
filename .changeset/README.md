# Changesets

This folder holds [changesets](https://github.com/changesets/changesets): one small
Markdown file per user-visible change, describing what changed and how much the
version should move.

## Adding one

```bash
pnpm changeset
```

Pick the bump level, write a sentence aimed at a **consumer** of the package (not
at a reviewer of the diff), and commit the generated file with your work.

Changes that are invisible from outside the package — refactors, test-only edits,
CI tweaks, comment rewrites — need no changeset.

## What happens next

The release workflow collects every pending changeset, opens a "Version Packages"
pull request that applies the bumps and writes `CHANGELOG.md`, and publishes to npm
when that pull request is merged. Nobody runs `npm publish` by hand.

See the semver policy in [CONTRIBUTING.md](../CONTRIBUTING.md#versioning-policy)
for which bump a given change deserves.
