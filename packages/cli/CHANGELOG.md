# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-rc.0](https://github.com/twreporter/congress-dashboard-monorepo/compare/lawmaker-cli@2.1.0-rc.4...lawmaker-cli@3.0.0-rc.0) (2026-02-13)

### Bug Fixes

- **cli:** add defensive filtering for incomplete transfer records ([15acc3d](https://github.com/twreporter/congress-dashboard-monorepo/commit/15acc3dfee627e737738a3e22ee15354a08d15d1))
- **cli:** enforce council metadata consistency and unique object IDs ([73fb3be](https://github.com/twreporter/congress-dashboard-monorepo/commit/73fb3bedd00236df9dedc2ae4caeaeec8ab998e3))
- **cli:** normalize council date formatting and member pagination ([e239cd2](https://github.com/twreporter/congress-dashboard-monorepo/commit/e239cd266ca479782dc25d7c459f19b19bbff190))

- feat(cli)!: add council feed-algolia pipeline ([d39fdcb](https://github.com/twreporter/congress-dashboard-monorepo/commit/d39fdcbc649f7cadc685686c32c1c19972493474))

### BREAKING CHANGES

- feed-algolia now requires a subcommand.

Restructure `feed-algolia` into `legislative-yuan` and `council` subcommands,
and complete the council ingestion flow (fetch -> transfer -> upload).

Changes:

- add council command options: `--council-name`, `--councilor`, `--council-topic`, `--council-bill`
- add council config and validation
- add council GraphQL iterators and model types
- add council Algolia record types and upload functions
- add council transfer functions and integrate into command flow
- update Dockerfile default args to `feed-algolia legislative-yuan`
- update README examples

Migration:

- before: `yarn lawmaker feed-algolia --meeting-term 11`
- after: `yarn lawmaker feed-algolia legislative-yuan --meeting-term 11`

# [2.1.0-rc.4](https://github.com/twreporter/congress-dashboard-monorepo/compare/lawmaker-cli@2.1.0-rc.3...lawmaker-cli@2.1.0-rc.4) (2026-02-11)

**Note:** Version bump only for package lawmaker-cli

# [2.1.0-rc.3](https://github.com/twreporter/congress-dashboard-monorepo/compare/lawmaker-cli@2.1.0-rc.2...lawmaker-cli@2.1.0-rc.3) (2026-02-11)

**Note:** Version bump only for package lawmaker-cli

# [2.1.0-rc.2](https://github.com/twreporter/congress-dashboard-monorepo/compare/lawmaker-cli@2.1.0-rc.1...lawmaker-cli@2.1.0-rc.2) (2026-02-11)

**Note:** Version bump only for package lawmaker-cli

# [2.1.0-rc.1](https://github.com/twreporter/congress-dashboard-monorepo/compare/lawmaker-cli@2.1.0-rc.0...lawmaker-cli@2.1.0-rc.1) (2026-02-11)

**Note:** Version bump only for package lawmaker-cli

# [2.1.0-rc.0](https://github.com/twreporter/congress-dashboard-monorepo/compare/lawmaker-cli@2.0.0...lawmaker-cli@2.1.0-rc.0) (2026-02-11)

### Bug Fixes

- **frontend:** address comments ([98ee786](https://github.com/twreporter/congress-dashboard-monorepo/commit/98ee7867f72991ee6c8b82f3be401ef89285a410))

### Features

- **cli:** support LAWMAKER\_\* env defaults ([132e2b4](https://github.com/twreporter/congress-dashboard-monorepo/commit/132e2b4d0c28b6d86e651dff2d547e4bdcb2faf9))

# [2.0.0](https://github.com/twreporter/congress-dashboard-monorepo/compare/lawmaker-cli@2.0.0-rc.0...lawmaker-cli@2.0.0) (2025-10-20)

**Note:** Version bump only for package lawmaker-cli

# [2.0.0-rc.0](https://github.com/twreporter/congress-dashboard-monorepo/compare/lawmaker-cli@1.1.0...lawmaker-cli@2.0.0-rc.0) (2025-10-14)

### Code Refactoring

- **cli:** rename term->meetingTerm and session->sessionTerm ([d91d72d](https://github.com/twreporter/congress-dashboard-monorepo/commit/d91d72db77c72bad4fb6bb25ddaec2ec8778e519))

- feat(cli)!: replace --yesterday/updatedAfter with --meeting-term and --session-term ([347106f](https://github.com/twreporter/congress-dashboard-monorepo/commit/347106f0c79aa68a631aecb856c493af6d9a1a07))

### BREAKING CHANGES

- feed-algolia CLI options were reworked.
  Update your scripts to use --meeting-term/--session-term instead of the removed flags.
- **cli:** Algolia record fields have been renamed and updated,
  clients must update queries accordingly.

# [1.1.0](https://github.com/twreporter/congress-dashboard-monorepo/compare/lawmaker-cli@1.1.0-rc.0...lawmaker-cli@1.1.0) (2025-08-13)

**Note:** Version bump only for package lawmaker-cli

# 1.1.0-rc.0 (2025-08-12)

### Bug Fixes

- **cli:** update src/graphql.ts. Add missing `date` field ([634293c](https://github.com/twreporter/congress-dashboard-monorepo/commit/634293c61da7c535f9038bee840d504aae181144))
- **cli:** update transfer.tsx. Add `objectID` field in speech record ([56195b7](https://github.com/twreporter/congress-dashboard-monorepo/commit/56195b7ece7f2e2ab5d3ad25e52aa2feda31601e))

### Features

- add packages/cli ([75fcc34](https://github.com/twreporter/congress-dashboard-monorepo/commit/75fcc34a2816f9c588943f8c7660f8e37fbbed73))
