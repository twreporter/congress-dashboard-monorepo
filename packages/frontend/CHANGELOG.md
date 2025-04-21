# Changelog

## 0.0.4-beta.1, 2025-04-21

### Notable Changes

- chore
  - update @twreporter packages

### Commits

- [[`1fb227e184`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1fb227e184)] - **chore(frontend)**: update @twreporter packages (Lucien)

## 0.0.4-beta.0, 2025-04-21

### Notable Changes

- chore
  - update @twreporter packages

### Commits

- [[`0339513a82`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0339513a82)] - **chore(frontend)**: update @twreporter packages (Lucien)

## 0.0.3, 2025-04-16

### Notable Changes

- feat
  - add filter modal for sidebar
  - add abort signal for server fetch
  - improve tooltip positioning and behavior
  - refactor Legislator and Topic components and styles
  - refactor content page layout and improve filter handling
  - legislator page statistics style
  - click arrow scroll into view
  - use mock data
  - move common components to components folder
  - legislator page logic
  - separate topic style
  - improve param validation
  - custom hook and component for topic page
  - topic page filter
  - move filter modal to component
  - scroll animation
  - get top topic from graphql
  - get topic data from graphql
  - export function and change variable name
  - topic page basic layout
  - move filter button to button folder
- fix
  - apply rwd style for sidebar gap
  - fix type import
  - change legislator route to lawmaker
  - fix defects for legislator page
  - change filter option naming value to key
  - topic page defect
  - use data from api for legislator page
  - use data from api for topic page
  - topic fetch for server
  - filter count for topic page
  - handle onClick on IconButton
  - style defects in sidebar & filter modal
  - fix legislator graphql column
  - use fetch for client SWR
  - use constants route
  - SSR req set connection header `close`
  - use `keystoneFetch` in SSR
  - fetch data with `localhost` in SSR
  - extend timeout to 30000ms
  - add node options to yarn start
  - fix AggregateError `ETIMEDOUT` when fetching data
  - type import and declare
  - filter modal default value and remove href duplicated slash
  - fix comments and add constants
  - fix typo
  - fix topics route
- chore
  - update @twreporter packages

### Commits

- [[`229723bf76`](https://github.com/twreporter/congress-dashboard-monorepo/commit/229723bf76)] - **fix(frontend)**: sidebar gap rwd (Aylie Chou)
- [[`be816e72cb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/be816e72cb)] - **fix(frontend)**: fix type import (Lucien)
- [[`bb00aeb706`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bb00aeb706)] - **fix(frontend)**: update changelog (Lucien)
- [[`3f09ccc0c0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3f09ccc0c0)] - **fix(frontend)**: update changelog (Lucien)
- [[`e527697212`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e527697212)] - **fix(frontend)**: handle onClick on IconButton (Lucien)
- [[`dfb8d1c176`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dfb8d1c176)] - **fix(frontend)**: filter count for topic page (Lucien)
- [[`d7a674a153`](https://github.com/twreporter/congress-dashboard-monorepo/commit/d7a674a153)] - **fix(frontend)**: topic fetch for server (Lucien)
- [[`e95ef23242`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e95ef23242)] - **chore(frontend)**: update @twreporter packages (Lucien)
- [[`45bc91c4bb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/45bc91c4bb)] - **feat(frontend)**: use data from api for topic page (Lucien)
- [[`7ea2ebcc38`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7ea2ebcc38)] - **feat(frontend)**: use data from api for legislator page (Lucien)
- [[`1152f5b461`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1152f5b461)] - **fix(frontend)**: topic page defect (Lucien)
- [[`7d9f6b8f69`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7d9f6b8f69)] - **fix(frontend)**: change filter option naming value to key (Lucien)
- [[`ed353d93b8`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ed353d93b8)] - **fix(frontend)**: fix defects for legislator page (Lucien)
- [[`ec2597dba1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ec2597dba1)] - **feat(frontend)**: change legislator route to lawmaker (Lucien)
- [[`bd9122363a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bd9122363a)] - **fix(frontend)**: card width defect in width < 375px (Aylie Chou)
- [[`5cbcc3cea1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5cbcc3cea1)] - **fix(frontend)**: add error UI in filter modal (Aylie Chou)
- [[`3f475756bd`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3f475756bd)] - **fix(frontend)**: fix card animation in dashboard (Aylie Chou)
- [[`16163b80a3`](https://github.com/twreporter/congress-dashboard-monorepo/commit/16163b80a3)] - **fix(frontend)**: add animation & loading in filter (Aylie Chou)
- [[`c0cbf7c64c`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c0cbf7c64c)] - **fix(frontend)**: defects in sidebar filter modal (Aylie Chou)
- [[`82d5d714b9`](https://github.com/twreporter/congress-dashboard-monorepo/commit/82d5d714b9)] - **fix(frontend)**: use constants route (Lucien)
- [[`cb060bb1a7`](https://github.com/twreporter/congress-dashboard-monorepo/commit/cb060bb1a7)] - **fix(frontend)**: use fetch for client SWR (Lucien)
- [[`ace7874861`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ace7874861)] - **fix(frontend)**: fix legislator qraphql column (Lucien)
- [[`89a37ce926`](https://github.com/twreporter/congress-dashboard-monorepo/commit/89a37ce926)] - **fix(frontend)**: SSR req close connenction direclty (Aylie Chou)
- [[`b60aed354e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b60aed354e)] - **fix(frontend)**: remove console.log (Aylie Chou)
- [[`1b929e9158`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1b929e9158)] - **fix(frontend)**: use `keystoneFetch` in SSR (Aylie Chou)
- [[`7766d09095`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7766d09095)] - **fix(frontend)**: fetch data with `localhost` in SSR (Aylie Chou)
- [[`bf10278e64`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bf10278e64)] - **feat(frontend)**: add abort signal for server fetch (Lucien)
- [[`8d56eb0195`](https://github.com/twreporter/congress-dashboard-monorepo/commit/8d56eb0195)] - **fix(frontend)**: extend timeout to 30000ms (Lucien)
- [[`34cfa2c26b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/34cfa2c26b)] - **fix(frontend)**: add node options to yarn start (Lucien)
- [[`ffd48a9fc1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ffd48a9fc1)] - **fix(frontend)**: AggregateError `ETIMEDOUT` (Aylie Chou)
- [[`ac8f5d7ee9`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ac8f5d7ee9)] - **fix(frontend)**: use correct import path (Aylie Chou)
- [[`cb8f96c4ea`](https://github.com/twreporter/congress-dashboard-monorepo/commit/cb8f96c4ea)] - **fix(frontend)**: resolving conflicts (Aylie Chou)
- [[`0a799c60ca`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0a799c60ca)] - **feat(frontend)**: add filter modal for sidebar (Aylie Chou)
- [[`5b1e25f317`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5b1e25f317)] - **fix(frontend)**: type import and declare (Lucien)
- [[`ded2440eae`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ded2440eae)] - **fix(frontend)**: filter modal dafault value and remove href duplicated slash (Lucien)
- [[`f6fe20745b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f6fe20745b)] - Merge remote-tracking branch 'upstream/dev' into feature/topic-page (Lucien)
- [[`e1b53b2d37`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e1b53b2d37)] - **fix(frontend)**: fix comments and add constants (Lucien)
- [[`9176e6156a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/9176e6156a)] - **fix(frontend)**: fix typo (Lucien)
- [[`af8ca5dd2b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/af8ca5dd2b)] - **feat(frontend)**: improve tooltip positioning and behavior (Lucien)
- [[`5b69410fde`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5b69410fde)] - **feat(frontend)**: remove unused custom hook (Lucien)
- [[`18cde540e2`](https://github.com/twreporter/congress-dashboard-monorepo/commit/18cde540e2)] - **feat(frontend)**: refactor Legislator and Topic components and styles (Lucien)
- [[`2d51088a09`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2d51088a09)] - **feat(frontend)**: refactor content page layout and improve filter handling (Lucien)
- [[`1a24de06a7`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1a24de06a7)] - **feat(frontend)**: legislator page statistics style (Lucien)
- [[`4ccba07fba`](https://github.com/twreporter/congress-dashboard-monorepo/commit/4ccba07fba)] - **feat(frontend)**: click arrow scroll into view (Lucien)
- [[`c3b2658a3a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c3b2658a3a)] - **feat(frontend)**: use mock data (Lucien)
- [[`83414e594b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/83414e594b)] - **feat(frontend)**: move common components to components folder (Lucien)
- [[`6fd8111397`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6fd8111397)] - **feat(frontend)**: legislator page logic (Lucien)
- [[`76a9ed3cd4`](https://github.com/twreporter/congress-dashboard-monorepo/commit/76a9ed3cd4)] - **feat(frontend)**: separate topic style (Lucien)
- [[`5c824accef`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5c824accef)] - **feat(frontend)**: improve param validation (Lucien)
- [[`dccbecf053`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dccbecf053)] - **feat(frontend)**: custom hook and component for topic page (Lucien)
- [[`dc038e166d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dc038e166d)] - **feat(frontend)**: topic page filter (Lucien)
- [[`62772a6232`](https://github.com/twreporter/congress-dashboard-monorepo/commit/62772a6232)] - **feat(frontend)**: move filter modal to component (Lucien)
- [[`a8a14f9d95`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a8a14f9d95)] - **feat(frontend)**: scroll animation (Lucien)
- [[`7847c8d863`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7847c8d863)] - **feat(frontend)**: get top topic from graphql (Lucien)
- [[`4c6656aa0a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/4c6656aa0a)] - **feat(frontend)**: get topic data from graphql (Lucien)
- [[`89e1146efb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/89e1146efb)] - **feat(frontend)**: export function and change variable name (Lucien)
- [[`d71c715ce0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/d71c715ce0)] - **feat(frontend)**: topic page basic layout (Lucien)
- [[`2c25ac8681`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2c25ac8681)] - **fix(frontend)**: fix topics route (Lucien)
- [[`1058b17d6e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1058b17d6e)] - **feat(frontend)**: move filter button to button folder (Lucien)

## 0.0.2, 2025-03-25

### Notable Changes

- feat
  - add `/api/graphql` endpoint
  - add sidebar components & stories
  - add search bar to header & hamburger menu
  - add speech page
    - custom button for congress dashboard
    - add rwd toolbar
    - add storybook stories
    - add scrolling animation
    - scroll context useCallback
  - add `pino` logger & support stackdriver log
  - add header max top and hidden print for toolbar
- fix
  - import type with type-only import
  - copy public env when cloud build
  - remove unused code
  - utils font family
- chore
  - remove unused files in `public` folder
  - move server only env to cloud run env
  - update @twreporter packages

### Commits

- [[`20842818db`](https://github.com/twreporter/congress-dashboard-monorepo/commit/20842818db)] - **fix**: import type with type-only import (Aylie Chou)
- [[`5586f5e09f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5586f5e09f)] - **fix**: defects (Aylie Chou)
- [[`71901b318c`](https://github.com/twreporter/congress-dashboard-monorepo/commit/71901b318c)] - **fix**: copy public env when cloud build (Aylie Chou)
- [[`41001affd3`](https://github.com/twreporter/congress-dashboard-monorepo/commit/41001affd3)] - **fix(frontend)**: address defects (Aylie Chou)
- [[`0782c3608c`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0782c3608c)] - Merge remote-tracking branch 'upstream/dev' into fix/frontend-speech-defetc-2 (Lucien)
- [[`b49a571776`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b49a571776)] - **fix(frontend)**: utils font family (Lucien)
- [[`c2aba513e3`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c2aba513e3)] - **fix(frontend)**: remove unused code (Lucien)
- [[`a819911f4d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a819911f4d)] - **fix(frontend)**: fix defects (Lucien)
- [[`fc9977e1e1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/fc9977e1e1)] - **fix**: `build-storybook` failed (Aylie Chou)
- [[`f62b14be26`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f62b14be26)] - **fix**: remove unused files (Aylie Chou)
- [[`1a3432c3f7`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1a3432c3f7)] - **fix**: add `pino` logger & support stackdriver log (Aylie Chou)
- [[`81b0cc293b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/81b0cc293b)] - **fix**: `party` type incorrect (Aylie Chou)
- [[`3bdba60ae3`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3bdba60ae3)] - **chore**: remove server only env (Aylie Chou)
- [[`eefdf85699`](https://github.com/twreporter/congress-dashboard-monorepo/commit/eefdf85699)] - **fix**: error is of type unknow & update env file (Aylie Chou)
- [[`7038005be0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7038005be0)] - **fix(frontend)**: review comments (Aylie Chou)
- [[`e96a8adfb1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e96a8adfb1)] - **feat**: add `/api/graphql` endpoint (Aylie Chou)
- [[`7fbcd57147`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7fbcd57147)] - Merge remote-tracking branch 'upstream/dev' into fix/frontend-speech-defetc-1 (Lucien)
- [[`3979b03610`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3979b03610)] - **fix(frontend)**: add header max top and hidden print for toolbar (Lucien)
- [[`313563e4eb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/313563e4eb)] - **fix(frontend)**: remove inline comment in css (Aylie Chou)
- [[`3f26ed73eb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3f26ed73eb)] - **chore(frontend)**: sync dev (Lucien)
- [[`f3c1fffce4`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f3c1fffce4)] - **fix(frontend)**: import path and type declare (Lucien)
- [[`342727a1e0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/342727a1e0)] - **fix(frontend)**: fix comments (Lucien)
- [[`f46bbb784d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f46bbb784d)] - **chore(frontend)**: update @twreporter packages (Lucien)
- [[`1d6f0fe498`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1d6f0fe498)] - **feat(frontend)**: scroll context useCallback (Lucien)
- [[`1560b5c368`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1560b5c368)] - **feat(frontend)**: speech page scroll behavior (Lucien)
- [[`f48ae4667e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f48ae4667e)] - **feat(frontend)**: eslint config (Lucien)
- [[`e0562549fa`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e0562549fa)] - **feat(frontend)**: add mobile toolbar (Lucien)
- [[`bc39bc4944`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bc39bc4944)] - **feat(frontend)**: add storybook (Lucien)
- [[`da871645b0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/da871645b0)] - **feat(frontend)**: speech page desktop tool bar (Lucien)
- [[`c516f05c7e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c516f05c7e)] - **feat(frontend)**: speech page components (Lucien)
- [[`6ebc74a982`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6ebc74a982)] - **feat(frontend)**: custom button for congress dashboard (Lucien)
- [[`6d2d137b83`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6d2d137b83)] - **fix(frontend)**: build failed problem (Aylie Chou)
- [[`c7a8f86d32`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c7a8f86d32)] - **fix(frontend)**: use correct icon in `titleSection` (Aylie Chou)
- [[`82e2ba5930`](https://github.com/twreporter/congress-dashboard-monorepo/commit/82e2ba5930)] - **chore(frontend)**: update @twreporter packages (Aylie Chou)
- [[`5c2d6a14cb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5c2d6a14cb)] - **fix(frontend)**: style defects in home page (Aylie Chou)
- [[`83b44ebddb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/83b44ebddb)] - **fix(frontend)**: add horizontal gap for interaction (Aylie Chou)
- [[`f04ed98ee6`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f04ed98ee6)] - **feat**: add sidebar components & stories (Aylie Chou)
- [[`f5c959c355`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f5c959c355)] - **feat**: add search bar to header & hamburger menu (Aylie Chou)

## 0.0.1, 2025-03-07

### Notable Changes

- feat
  - add storybook configs
  - add selector components for single & multi selection
    - add storybook stories
  - add header & footer component
    - add scrolling animation
  - add filter modal component
    - add storybook stories
  - add `use-window-width` hook
    - support SSR
  - add navigation link constants
  - add responsive tag display
  - add index page
- fix
  - using @ for import routes
- chore
  - add configs for monorepo cross import
  - update @twreporter packages
  - add `.env.development` in codebase
  - rename `lib` to `utils`
  - build `shared` lib with `tsup`
  - update dependency version

### Commits

- [[`493a5a5948`](https://github.com/twreporter/congress-dashboard-monorepo/commit/493a5a5948)] - **fix(frontend)**: remove comments (Aylie Chou)
- [[`2f87305c32`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2f87305c32)] - **fix(frontend)**: add `tooltip`, `note`, `skeleton` (Aylie Chou)
- [[`1e0f2b5863`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1e0f2b5863)] - **fix**: remove `console.log` (Aylie Chou)
- [[`56d17b868a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/56d17b868a)] - **fix**: Loadable import but not used error (Aylie Chou)
- [[`99c9c7dd9d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/99c9c7dd9d)] - **fix**: add build config for `shared` (Aylie Chou)
- [[`82defda30a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/82defda30a)] - **chore(shared)**: update for monorepo cross import (Lucien)
- [[`43cb602a90`](https://github.com/twreporter/congress-dashboard-monorepo/commit/43cb602a90)] - **feat**: add index page components (Aylie Chou)
- [[`672c4d8860`](https://github.com/twreporter/congress-dashboard-monorepo/commit/672c4d8860)] - **fix**: typo in comment (Aylie Chou)
- [[`a62b31af93`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a62b31af93)] - **fix**: hd function bar width (Aylie Chou)
- [[`a50483fc27`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a50483fc27)] - **fix**: styles defects in dashboard page (Aylie Chou)
- [[`91ed548951`](https://github.com/twreporter/congress-dashboard-monorepo/commit/91ed548951)] - **fix(frontend)**: change ref name for better reading (Lucien)
- [[`1fdd18d35d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1fdd18d35d)] - **fix(frontend)**: header bottom line and filter modal header fixed (Lucien)
- [[`90eca80c94`](https://github.com/twreporter/congress-dashboard-monorepo/commit/90eca80c94)] - Merge remote-tracking branch 'upstream/dev' into feature/frontend-selector-all (Lucien)
- [[`6ea5ecec5d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6ea5ecec5d)] - **feat(frontend)**: update multi selector storybook (Lucien)
- [[`3c77d39ceb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3c77d39ceb)] - **fix(frontend)**: dropdown prefix icon and filter modal footer (Lucien)
- [[`08cee70122`](https://github.com/twreporter/congress-dashboard-monorepo/commit/08cee70122)] - **feat(frontend)**: muti selector default all logic (Lucien)
- [[`3164218e94`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3164218e94)] - **fix(frontend)**: footer link and header style (Lucien)
- [[`1f9d934e3b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1f9d934e3b)] - **fix(frontend)**: fix import type and footer prop type (Lucien)
- [[`36b21d64e0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/36b21d64e0)] - **feat(frontend)**: add selector and fiter button for storybook (Lucien)
- [[`397844b3fe`](https://github.com/twreporter/congress-dashboard-monorepo/commit/397844b3fe)] - **fix(frontend)**: remove unused code and fix style (Lucien)
- [[`b8be1d2441`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b8be1d2441)] - **chore(frontend)**: sync dev (Lucien)
- [[`10d3341d44`](https://github.com/twreporter/congress-dashboard-monorepo/commit/10d3341d44)] - **fix(frontend)**: fix comments (Lucien)
- [[`21ef2f130a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/21ef2f130a)] - **feat(frontend)**: add responsive for tag display (Lucien)
- [[`d39ca86e50`](https://github.com/twreporter/congress-dashboard-monorepo/commit/d39ca86e50)] - **feat(frontend)**: add throttle and style fix (Lucien)
- [[`45257a6bf6`](https://github.com/twreporter/congress-dashboard-monorepo/commit/45257a6bf6)] - **feat(frontend)**: refactor selector for better maintenance and readability (Lucien)
- [[`c3fc693b86`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c3fc693b86)] - **feat(frontend)**: filter modal (Lucien)
- [[`cbd99c08fa`](https://github.com/twreporter/congress-dashboard-monorepo/commit/cbd99c08fa)] - **feat(frontend)**: selector component (Lucien)
- [[`60d6ef387e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/60d6ef387e)] - **feat(frontend)**: header and tab behavior version3 (Lucien)
- [[`ea233dd5f4`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ea233dd5f4)] - **feat(frontend)**: header and tab behavior version2 (Lucien)
- [[`a88df499f6`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a88df499f6)] - **feat(frontend)**: header and tab scroll behavior (Lucien)
- [[`f5f8dc4ae6`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f5f8dc4ae6)] - **feat(frontend)**: navigation link constants (Lucien)
- [[`7e5c69b460`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7e5c69b460)] - **feat(frontend)**: footer component (Lucien)
- [[`961a92d039`](https://github.com/twreporter/congress-dashboard-monorepo/commit/961a92d039)] - **feat(frontend)**: header storybook (Lucien)
- [[`a82ca412d4`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a82ca412d4)] - **fix(frontend)**: give getServerSnapshot for SSR at useWindowWidth hook (Lucien)
- [[`1b8f2d992e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1b8f2d992e)] - **feat(frontend)**: header component (Lucien)
- [[`21a735a3e8`](https://github.com/twreporter/congress-dashboard-monorepo/commit/21a735a3e8)] - **feat(frontend)**: add z-index enum for styling (Lucien)
- [[`7717e23af1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7717e23af1)] - **feat(frontend)**: use-window-width hook (Lucien)
- [[`7fb36069c1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7fb36069c1)] - **fix(frontend)**: using @ for import route (Lucien)
- [[`1f171de621`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1f171de621)] - **fix(frontend)**: remove default margin and padding (Lucien)
- [[`e1d791f127`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e1d791f127)] - **chore**: update @twreporter packages (Aylie Chou)
- [[`bb0aa42762`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bb0aa42762)] - **chore(frontend)**: update @twreporter packages (Aylie Chou)
- [[`f707962154`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f707962154)] - **chore(frontend)**: add `.env.development` in codebase (Aylie Chou)
- [[`c5a3e368f7`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c5a3e368f7)] - **fix(frontend)**: rename `lib` to `utils` (Aylie Chou)
- [[`dbe3092ca2`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dbe3092ca2)] - **fix(frontend)**: arrage storybook (Aylie Chou)
- [[`3cdbdd0587`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3cdbdd0587)] - **fix(frontend)**: add fonts & fix style problems (Aylie Chou)
- [[`26bd76d460`](https://github.com/twreporter/congress-dashboard-monorepo/commit/26bd76d460)] - **fix(frontend)**: defects in index page (Aylie Chou)
- [[`9969e7dfef`](https://github.com/twreporter/congress-dashboard-monorepo/commit/9969e7dfef)] - **chore**: update monorepo related config (Aylie Chou)
- [[`b31a1ca02d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b31a1ca02d)] - **fix**: .stories files fail at commit stage (Aylie Chou)
- [[`f332f4d9b0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f332f4d9b0)] - **fix**: use correct shared package version (Aylie Chou)
- [[`26a80b8de8`](https://github.com/twreporter/congress-dashboard-monorepo/commit/26a80b8de8)] - **fix**: build `shared` lib with `tsup` (Aylie Chou)
- [[`6ff95ff493`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6ff95ff493)] - **chore**: update `shared` package version (Aylie Chou)
- [[`f7174adc0f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f7174adc0f)] - **fix**: missing eslint config file (Aylie Chou)
- [[`493a5a5948`](https://github.com/twreporter/congress-dashboard-monorepo/commit/493a5a5948)] - **fix(frontend)**: remove comments (Aylie Chou)
- [[`2f87305c32`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2f87305c32)] - **fix(frontend)**: add `tooltip`, `note`, `skeleton` (Aylie Chou)
- [[`1e0f2b5863`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1e0f2b5863)] - **fix**: remove `console.log` (Aylie Chou)
- [[`56d17b868a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/56d17b868a)] - **fix**: Loadable import but not used error (Aylie Chou)
- [[`99c9c7dd9d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/99c9c7dd9d)] - **fix**: add build config for `shared` (Aylie Chou)
- [[`82defda30a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/82defda30a)] - **chore(shared)**: update for monorepo cross import (Lucien)
- [[`43cb602a90`](https://github.com/twreporter/congress-dashboard-monorepo/commit/43cb602a90)] - **feat**: add index page components (Aylie Chou)
- [[`6f8ad4aa06`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6f8ad4aa06)] - **feat**: add storybook configs (Aylie Chou)
