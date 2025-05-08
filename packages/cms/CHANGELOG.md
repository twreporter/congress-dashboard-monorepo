# Changelog

## 1.0.0-rc.8, 2025-05-09

### Notable Changes

- fix
  - add `id` for return data

### Commits

- [[`a41bb3cff5`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a41bb3cff5)] - **fix(cms)**: add `id` for return data (Aylie Chou)

## 1.0.0-rc.7, 2025-05-09

### Notable Changes

- feat
  - add favicon and change site title

### Commits

- [[`c806e3dab3`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c806e3dab3)] - **feat(cms)**: add favicon and change site title (Lucien)

## 1.0.0-rc.6, 2025-05-08

### Notable Changes

- chore
  - update @twreporter packages

### Commits

- [[`bc37ad574e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bc37ad574e)] - **chore(cms)**: update @twreporter packages (Lucien)

## 1.0.0-rc.5, 2025-05-07

### Notable Changes

- chore
  - update @twreporter packages

### Commits

- [[`69a45d8d75`](https://github.com/twreporter/congress-dashboard-monorepo/commit/69a45d8d75)] - **chore(cms)**: update @twreporter packages (Lucien)

## 1.0.0-rc.4, 2025-05-06

### Notable Changes

- fix
  - use connect instead of set for create relationship

### Commits

- [[`cc7a8e3335`](https://github.com/twreporter/congress-dashboard-monorepo/commit/cc7a8e3335)] - **fix(cms)**: use connect instead of set for create relationship (Lucien)

## 1.0.0-rc.3, 2025-05-06

### Notable Changes

- fix
  - set default sort to id for import record

### Commits

- [[`64c898ce72`](https://github.com/twreporter/congress-dashboard-monorepo/commit/64c898ce72)] - **fix(cms)**: set default sort to id for import record (Lucien)

## 1.0.0-rc.2, 2025-05-05

### Notable Changes

- feat
  - add custom sql endpoints for home page fetchers
  - add field & migration for related reporter articles
- fix
  - update alert wording when failed to add twreporter article
  - update default value of twreporter url
  - add `NEXT_PUBLIC` for public env & add .env.dev.public file

### Commits

- [[`f7556f50a4`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f7556f50a4)] - **fix(cms)**: update alert wording when failed (Aylie Chou)
- [[`a6c380ab29`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a6c380ab29)] - **fix(cms)**: update default value of twreporter url (Aylie Chou)
- [[`505d7e8f9b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/505d7e8f9b)] - **fix(cms)**: add `NEXT_PUBLIC` for public env (Aylie Chou)
- [[`0a034fbd79`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0a034fbd79)] - **fix(cms)**: typo (Aylie Chou)
- [[`f8f83f529f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f8f83f529f)] - **fix(cms)**: update type `TopicForLegislator` (Aylie Chou)
- [[`4e7c6aafeb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/4e7c6aafeb)] - **feat(cms)**: add `topNTopicsOfLegislators` endpoint (Aylie Chou)
- [[`661116df76`](https://github.com/twreporter/congress-dashboard-monorepo/commit/661116df76)] - **feat(cms)**: add custom graphql endpoints (Aylie Chou)
- [[`8c2931e5d6`](https://github.com/twreporter/congress-dashboard-monorepo/commit/8c2931e5d6)] - **fix(cms)**: add migration file (Aylie Chou)
- [[`c48310bfa3`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c48310bfa3)] - **fix(cms)**: add alert when add twreporter article (Aylie Chou)
- [[`b3997e72c4`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b3997e72c4)] - **feat(cms)**: add field for related reporter articles (Aylie Chou)

## 1.0.0-rc.1, 2025-04-22

### Notable Changes

- feat
  - related topic upload
  - new columns for legislator & legislativeYuanMember
- fix
  - reset Dockerfile
  - install all dependencies for docker image
  - update Dockerfile to use corepack
  - update Dockerfile with multi stage
  - rename related topic column and add validation for link
  - add `developer_headless_account` role
  - use `includes` instead of `indexOf`
- chore
  - update @twreporter packages
  - update @twreporter/congress-dashboard-shared version
  - sync dev

### Commits

- [[`c2c99d12b7`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c2c99d12b7)] - **chore(cms)**: update @twreporter packages (Lucien)
- [[`4f00f74ee2`](https://github.com/twreporter/congress-dashboard-monorepo/commit/4f00f74ee2)] - **chore(cms)**: update @twreporter/congress-dashboard-shared version (Lucien)
- [[`51ae426634`](https://github.com/twreporter/congress-dashboard-monorepo/commit/51ae426634)] - **fix(cms)**: reset Dockerfile (Lucien)
- [[`40389475bc`](https://github.com/twreporter/congress-dashboard-monorepo/commit/40389475bc)] - **fix(cms)**: set env to development for yarn install at Dockerfile (Lucien)
- [[`593e5bb0a3`](https://github.com/twreporter/congress-dashboard-monorepo/commit/593e5bb0a3)] - **fix(cms)**: install all dependencies for docker image (Lucien)
- [[`70d9a0b738`](https://github.com/twreporter/congress-dashboard-monorepo/commit/70d9a0b738)] - **fix(cms)**: update Dockerfile to use corepack (Lucien)
- [[`e9c2bbef3c`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e9c2bbef3c)] - **fix(cms)**: update Dockerfile with multi stage (Lucien)
- [[`413bc7f3ed`](https://github.com/twreporter/congress-dashboard-monorepo/commit/413bc7f3ed)] - **chore(cms)**: sync dev (Lucien)
- [[`854c87aa00`](https://github.com/twreporter/congress-dashboard-monorepo/commit/854c87aa00)] - **fix(cms)**: rename related topic column and add validation for link (Lucien)
- [[`785de95947`](https://github.com/twreporter/congress-dashboard-monorepo/commit/785de95947)] - **feat(cms)**: new columns for legislator & legislativeYuanMember (Lucien)
- [[`fde82401dd`](https://github.com/twreporter/congress-dashboard-monorepo/commit/fde82401dd)] - **feat(cms)**: related topic upload (Lucien)
- [[`3fab8379b1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3fab8379b1)] - **fix(cms)**: use `includes` instead of `indexOf` (Aylie Chou)
- [[`651f5efb1f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/651f5efb1f)] - **feat(cms)**: add `developer_headless_account` role (Aylie Chou)

## 1.0.0-rc.0, 2025-03-27

### Notable Changes

- feat
  - create lists
    - committee list
    - topic and speech list
    - committeeMember list
    - selected list
    - party list
    - legislative meeting list
    - legislative meeting session list
    - legislator list
    - legislative yuan member list
  - add csv uploader custom field
    - add `papaparse` to read csv file
    - connect legislativeMeeting & fix legislativeYuanMember update logic
    - check slug duplicated for some list
    - add required fields configuration for upload csv
    - add import record list
    - allow admin to delete import record
  - migration files
    - create imageLink migration file
    - create init migration file
  - add `emotion` packages
  - set body limit to 50mb
  - session secret
  - ignore eslintcache
  - use typescript enum for export constants
  - use common eslint & prettier & husky
- fix
  - change speech `content` and `summary` type from string to json
  - add comment for graphql error handling
  - more header & speech option
  - upsert topic with speech
  - add validation for upload data
  - list order and label name and dependency for cms
  - add validation for selected
  - prettier format
  - remove duplicate tsconfig
  - change legislative meeting term to unique
- chore
  - update monorepo related config
  - use @twreporter packages
  - sync dev
  - init cms
    - access-control
    - system user access
  - README & add dockerfile for cms
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
