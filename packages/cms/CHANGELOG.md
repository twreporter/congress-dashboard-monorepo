# Changelog

## 0.0.2, 2025-03-26

### Notable Changes

- feat
  - connect legislativeMeeting & fix legislativeYuanMember update logic
  - check slug duplicated for some list
  - add csv uploader custom field
  - add papaparse to read csv file
  - use custom field for import record and change speech content and summary type
  - migration file
  - allow admin to delete import record
  - required fields for upload csv
  - add comment for graphql error
  - add emotion packages
  - add import record list
  - set body limit to 50mb
  - session secret
- fix
  - more header & speech option
  - upsert topic with speech
  - fix comments
  - add validation for upload data
- chore
  - sync dev

### Commits

- [[`e04dc0a5c9`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e04dc0a5c9)] - **fix(cms)**: connect legislativeMeeting & fix legislativeYuanMember update logic (Lucien)
- [[`e1b371a3b0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e1b371a3b0)] - **feat(cms)**: check slug duplicated for some list (Lucien)
- [[`c0f508ba2d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c0f508ba2d)] - **fix(cms)**: upsert topic with speech (Lucien)
- [[`a8c7ab99ca`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a8c7ab99ca)] - **fix(cms)**: more header & speech option (Lucien)
- [[`d6bc98d572`](https://github.com/twreporter/congress-dashboard-monorepo/commit/d6bc98d572)] - **fix(cms)**: fix comments (Lucien)
- [[`0bb044ef58`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0bb044ef58)] - Merge remote-tracking branch 'upstream/dev' into feature/cms-upload-2 (Lucien)
- [[`a4814d8e56`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a4814d8e56)] - **feat(cms)**: allow admin to delete import record (Lucien)
- [[`ddc0d509e1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ddc0d509e1)] - **feat(cms)**: migration file (Lucien)
- [[`5008b0fd9d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5008b0fd9d)] - **feat(cms)**: use custom field for import record and change speech content and summary type (Lucien)
- [[`e8eb2c9b16`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e8eb2c9b16)] - **feat(cms)**: add papaparse to read csv file (Lucien)
- [[`e1ca584a09`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e1ca584a09)] - **feat(cms)**: add csv uploader custom field (Lucien)
- [[`e9a06a7d81`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e9a06a7d81)] - **feat(cms)**: required fields for upload csv (Lucien)
- [[`ec36e50e63`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ec36e50e63)] - **fix(cms)**: add validation for upload data (Lucien)
- [[`c6a53870cc`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c6a53870cc)] - **feat(cms)**: add comment for graphql error (Lucien)
- [[`2767337dc8`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2767337dc8)] - **feat(cms)**: session secret (Lucien)
- [[`70642b9e87`](https://github.com/twreporter/congress-dashboard-monorepo/commit/70642b9e87)] - **feat(cms)**: sync dev (Lucien)
- [[`2e9139491d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2e9139491d)] - Merge remote-tracking branch 'upstream/dev' into feature/cms-upload (Lucien)
- [[`abb735d429`](https://github.com/twreporter/congress-dashboard-monorepo/commit/abb735d429)] - **feat(cms)**: set body limit to 50mb (Lucien)
- [[`43dc4d4b51`](https://github.com/twreporter/congress-dashboard-monorepo/commit/43dc4d4b51)] - **feat(cms)**: add import record list (Lucien)
- [[`962e920cb7`](https://github.com/twreporter/congress-dashboard-monorepo/commit/962e920cb7)] - **feat(cms)**: add emotion packages (Lucien)

## 0.0.1, 2025-02-13

### Notable Changes

- feat
  - add legislative-yuan-member options constant
  - ignore eslintcache
  - add imageLink for party and member
  - add city constant
  - create imageLink migration file
  - create committee list
  - create topic and speech list
  - create committeeMember list
  - use legislative yuan member for relation
  - create selected list
  - use typescript enum for export constants
  - create party list
  - create init migration file
  - creat legislative meeting list
  - creat legislative meeting session list
  - create legislator list
  - create legislative yuan member list
  - use common eslint & prettier & husky
- fix
  - list order and label name and dependency for cms
  - add validation for selected
  - prettier format
  - remove duplicate tsconfig
  - change legislative meeting term to unique
- chore
  - update monorepo related config
  - use twreporter repo
  - sync dev
  - init cms
  - access-control
  - system user access
  - change to monorepo
  - READEME & add dockerfile for cms

### Commits

- [[`9969e7dfef`](https://github.com/twreporter/congress-dashboard-monorepo/commit/9969e7dfef)] - **chore**: update monorepo related config (Aylie Chou)
- [[`efe8fbca37`](https://github.com/twreporter/congress-dashboard-monorepo/commit/efe8fbca37)] - **fix(cms)**: list order and label name and dependency for cms (Lucien)
- [[`7c68cbd28f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7c68cbd28f)] - **chore**: use twreporter repo (Lucien)
- [[`434b64072e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/434b64072e)] - **chore**: sync dev (Lucien)
- [[`cb700b8c3d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/cb700b8c3d)] - **fix(cms)**: add validation for selected (Lucien)
- [[`e3f9ad3a71`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e3f9ad3a71)] - **feat(shared)**: use typescript enum for export constants (Lucien)
- [[`7bc71836bc`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7bc71836bc)] - **feat(cms)**: create selected list (Lucien)
- [[`7e72793c09`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7e72793c09)] - **feat(cms)**: use legislative yuan member for relation (Lucien)
- [[`f6b6d624c0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f6b6d624c0)] - **feat(cms)**: create committeeMember list (Lucien)
- [[`e09da297bc`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e09da297bc)] - **feat(cms)**: create topic and speech list (Lucien)
- [[`2c32fa5deb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2c32fa5deb)] - **feat(cms)**: create committee list (Lucien)
- [[`030bcf1769`](https://github.com/twreporter/congress-dashboard-monorepo/commit/030bcf1769)] - **feat(cms)**: create imageLink migration file (Lucien)
- [[`94037d9129`](https://github.com/twreporter/congress-dashboard-monorepo/commit/94037d9129)] - **feat**: add city constant (Lucien)
- [[`bfdb83bbaa`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bfdb83bbaa)] - **feat(cms)**: add imageLink for party and member (Lucien)
- [[`8508af454e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/8508af454e)] - **feat**: ignore eslintcache (Lucien)
- [[`ae9d6f7d95`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ae9d6f7d95)] - **feat(cms)**: add legislative-yuan-member options constant (Lucien)
- [[`481770fba6`](https://github.com/twreporter/congress-dashboard-monorepo/commit/481770fba6)] - **feat**: use common eslint & prettier & husky (Lucien)
- [[`00919f03b9`](https://github.com/twreporter/congress-dashboard-monorepo/commit/00919f03b9)] - **chore**: READEME & add dockerfile for cms (Lucien)
- [[`4bf9fdcb29`](https://github.com/twreporter/congress-dashboard-monorepo/commit/4bf9fdcb29)] - Merge branch 'twreporter:master' into chore/cms (Lucien)
- [[`8a28aa3e82`](https://github.com/twreporter/congress-dashboard-monorepo/commit/8a28aa3e82)] - **chore**: change to monorepo (Lucien)
- [[`35aa65d927`](https://github.com/twreporter/congress-dashboard-monorepo/commit/35aa65d927)] - **feat**: create legislative yuan member list (Lucien)
- [[`be34c54a59`](https://github.com/twreporter/congress-dashboard-monorepo/commit/be34c54a59)] - **feat**: create legislator list (Lucien)
- [[`5c7f17169d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5c7f17169d)] - **fix**:  change legislative meeting term to unique (Lucien)
- [[`9094eecf72`](https://github.com/twreporter/congress-dashboard-monorepo/commit/9094eecf72)] - **feat**: creat legislative meeting session list (Lucien)
- [[`af67aca658`](https://github.com/twreporter/congress-dashboard-monorepo/commit/af67aca658)] - **feat**: creat legislative meeting list (Lucien)
- [[`6c6bd0a42d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6c6bd0a42d)] - **feat**: create init migration file (Lucien)
- [[`462431e030`](https://github.com/twreporter/congress-dashboard-monorepo/commit/462431e030)] - **feat**: create party list (Lucien)
- [[`56e22675a7`](https://github.com/twreporter/congress-dashboard-monorepo/commit/56e22675a7)] - **fix**: remove duplicate tsconfig (Lucien)
- [[`0d5d5c2193`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0d5d5c2193)] - **fix**: prettier format (Lucien)
- [[`8585ec4ee6`](https://github.com/twreporter/congress-dashboard-monorepo/commit/8585ec4ee6)] - **chore**: system user access (Lucien)
- [[`ec12bde1d9`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ec12bde1d9)] - **chore**: access-control (Lucien)
- [[`e8e09268f8`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e8e09268f8)] - **chore**: init cms (Lucien)

