# Changelog

## 1.1.0-rc.5

### Patch Changes

- [#224](https://github.com/twreporter/congress-dashboard-monorepo/pull/224) [`f44efe7`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f44efe79a3e78ee638312622330077dfda830aac) Thanks [@liruchen32](https://github.com/liruchen32)! - fix header logo and side bar link hover style

## 1.1.0-rc.4

### Patch Changes

- [#218](https://github.com/twreporter/congress-dashboard-monorepo/pull/218) [`f0f2139`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f0f21399cf0ab9d9e466f049aca69c2e7eac6b13) Thanks [@Aylie-Chou](https://github.com/Aylie-Chou)! - fix defects of swr error state & sidebar filtered legislator could not get top 5 topic problem

## 1.1.0-rc.3

### Patch Changes

- [#215](https://github.com/twreporter/congress-dashboard-monorepo/pull/215) [`ff59a82`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ff59a8232b3dd12af702f0a7f280f2c9fb3aeb6f) Thanks [@liruchen32](https://github.com/liruchen32)! - fix speech page og description

## 1.1.0-rc.3

### Patch Changes

- chore
  - update local, development, staging and prod environment variables

### Commits

- [[`e5ef22b4ee`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e5ef22b4ee)] - **chore(frontend)**: update environment variables (nickhsine)

## 1.1.0-rc.2

### Patch Changes

- [#187](https://github.com/twreporter/congress-dashboard-monorepo/pull/187) [`25947e8`](https://github.com/twreporter/congress-dashboard-monorepo/commit/25947e8335ae5b681942c09ae6924931eb71e916) Thanks [@liruchen32](https://github.com/liruchen32)! - add og image and description

## 1.1.0-rc.1

### Patch Changes

- [#185](https://github.com/twreporter/congress-dashboard-monorepo/pull/185) [`7dae6b1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7dae6b138cfa3ab0d7d031bd6fa3361142c5077d) Thanks [@Aylie-Chou](https://github.com/Aylie-Chou)! - This PR adds error state for all swr fetching

## 1.1.0-rc.0

### Notable Changes

- feat
  - Algolia Instant Search

### Commits

- [[`8137c511df`](https://github.com/twreporter/congress-dashboard-monorepo/commit/8137c511df)] - **refactor(frontend)**: refactor type convention. Add @/types/index.ts (nickhsine)
- [[`5b226a3f05`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5b226a3f05)] - **fix(frontend)**: fix body scroll lock failure (nickhsine)
- [[`203e67cddb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/203e67cddb)] - **refactor(frontend)**: use \<AlgoliaInstantSearch> in \<HamburgerMenu> (nickhsine)
- [[`1f812305f1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1f812305f1)] - **fix(frontend)**: fix GitHub Action build failures. Initialize algolia search client only on client (nickhsine)
- [[`6671910971`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6671910971)] - **refactor(frontend)**: get algolia app id and search key from env vars (nickhsine)
- [[`326cfe97e6`](https://github.com/twreporter/congress-dashboard-monorepo/commit/326cfe97e6)] - **refactor(frontend)**: snippet for search hit description (nickhsine)
- [[`14b410fbec`](https://github.com/twreporter/congress-dashboard-monorepo/commit/14b410fbec)] - **style(frontend)**: fine tune search bar styles (nickhsine)
- [[`f2dbc1f314`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f2dbc1f314)] - **refactor(frontend)**: update src/components/header/index.tsx (nickhsine)
- [[`e97499f6fb`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e97499f6fb)] - **refactor(frontend)**: search modal for mobile (nickhsine)
- [[`dcd76b99c3`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dcd76b99c3)] - **refactor(frontend)**: hide instant search results if click outside (nickhsine)
- [[`b22f0deef4`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b22f0deef4)] - **refactor(frontend)**: update search-box.tsx. Use `autofocus` attribute instead (nickhsine)
- [[`b7914d39e3`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b7914d39e3)] - **refactor(frontend)**: clear the search query by `clear` API (nickhsine)
- [[`ccfb771e79`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ccfb771e79)] - **refactor(frontend)**: layoutVariants -> LayoutVariants. Address code review (nickhsine)
- [[`3edfaa9ac8`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3edfaa9ac8)] - **refactor(frontend)**: update search. Reset query if click outside (nickhsine)
- [[`91ebcbc996`](https://github.com/twreporter/congress-dashboard-monorepo/commit/91ebcbc996)] - **refactor(frontend)**: update header search. Auto focus when search bar is open (nickhsine)
- [[`cf476a62aa`](https://github.com/twreporter/congress-dashboard-monorepo/commit/cf476a62aa)] - **refactor(frontend)**: update header. Replace SearchBar by AlgoliaInstantSearch (nickhsine)
- [[`680969469d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/680969469d)] - **style(frontend)**: update width of search bar (nickhsine)
- [[`87fa14ddc0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/87fa14ddc0)] - **refactor(frontend)**: update search icons (nickhsine)
- [[`dd28c9cb62`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dd28c9cb62)] - **style(frontend)**: update instant-hit.tsx. Handle text overflow (nickhsine)
- [[`66c0989cc0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/66c0989cc0)] - **refactor(frontend)**: address code review comments (nickhsine)
- [[`a97d1f4cf4`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a97d1f4cf4)] - **chore(root)**: update yarn.lock (nickhsine)
- [[`dfd84cbc7f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dfd84cbc7f)] - **refactor(frontend)**: change SearchBar to AlgoliaInstantSearch (nickhsine)
- [[`5779d322ba`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5779d322ba)] - **feat(frontend)**: (desktop) instant search (nickhsine)
- [[`4c8f708c37`](https://github.com/twreporter/congress-dashboard-monorepo/commit/4c8f708c37)] - **chore(frontend)**: update package.json. Add search deps (nickhsine)

## 1.0.2-rc.0

### Patch Changes

- [#188](https://github.com/twreporter/congress-dashboard-monorepo/pull/188) [`9421b7f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/9421b7f52bd36771c782af45ef52a691e662a207) Thanks [@liruchen32](https://github.com/liruchen32)! - test changeset

- Updated dependencies [[`9421b7f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/9421b7f52bd36771c782af45ef52a691e662a207)]:
  - @twreporter/congress-dashboard-shared@0.0.7-rc.0

## 1.0.1, 2025-06-18 (Current)

### Notable Changes

- fix
  - remove quotes from ABOUT_PAGE_SLUG and update type in fetchMoreTopics

### Commits

- [[`2583f2acae`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2583f2acae)] - **fix(frontend)**: remove quotes from ABOUT_PAGE_SLUG and update type in fetchMoreTopics (Lucien)

## 1.0.0, 2025-06-18

### Notable Changes

- feat
  - enhance sidebar and footer components with new styles and logic
  - add not found page
  - add error page
  - add ssr loading page
  - add donation box for speech page
  - support multi-select feedback
  - use cache function for getAboutPage
  - get about page data from go-api
  - add about page & donation box
  - add feedback components & api
  - add favicon and change site title
  - add metadata for dynamic page
  - add fetchers for home page
  - add related twreporter articles
  - use data from api for speech page
  - parse HTML summaries and consolidate date formatter logic
  - add snackbar for sidebar filter
  - implement filter modals and sidebar z-index management
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
  - improve footer error handling and update filter modal title text
  - update logo sources in Header component to use external URLs
  - add link support to FilterModal and update title rendering
  - fix `hasMore` logic in useLegislator hook
  - loadmore button style on mobile
  - calculate hasMore in hook
  - buttonOnclick typo
  - address dashboard & speech defects
  - sidebar & dashboard styles
  - address defects of feedback
  - update style of circle avatar
  - address defects of home page
  - improve topic and legislator page sidebar filter
  - speech page donation box
  - fix about page margin and donation box issue
  - use id instead of index for key
  - force dynamic to about page
  - use flatMap address comment from copilot
  - defects in function bar filter modal
  - legislator page follow more scroll no padding
  - topic and legislator page sidebar filter
  - use sort from fetcher utils
  - address defects in home page
  - typo and speech page title
  - use app router way error handling
  - add `showAvatar` props to Tab & `showTabAvatar` to TitleSection
  - fix loading & filter for topic & legislator page
  - use logger instead of console.error to catch home page SSR error
  - legislator image & scrollbar width
  - pass querystring for legislator route
  - add empty state to topic speech summary list and fix filter count
  - add empty state for legislator page
  - check if legislator slug exist
  - fix use-filters
  - add loader component and add loading for topic & legislator page
  - use common loader component
  - parse summary for speech card
  - implement universal date formatter with enhanced flexibility
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
  - import type with type-only import
  - copy public env when cloud build
  - remove unused code
  - utils font family
  - using @ for import routes
- chore
  - update @twreporter packages
  - remove unused files in `public` folder
  - move server only env to cloud run env
  - update @twreporter packages
  - add configs for monorepo cross import
  - update @twreporter packages
  - add `.env.development` in codebase
  - rename `lib` to `utils`
  - build `shared` lib with `tsup`
  - update dependency version

### Commits

- [[`49bb03f3cd`](https://github.com/twreporter/congress-dashboard-monorepo/commit/49bb03f3cd)] - **fix(frontend)**: improve footer error handling and update filter modal title text (Lucien)
- [[`5f7128030f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5f7128030f)] - **fix(frontend)**: update logo sources in Header component to use external URLs (Lucien)
- [[`fe4000e41b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/fe4000e41b)] - **fix(frontend)**: add link support to FilterModal and update title rendering (Lucien)
- [[`916c7df59e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/916c7df59e)] - **feat(frontend)**: enhance sidebar and footer components with new styles and logic (Lucien)
- [[`785003a54d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/785003a54d)] - **fix(frontend)**: hasMore logic (Aylie Chou)
- [[`1672523e5b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1672523e5b)] - **fix(frontend)**: calculate load more (Aylie Chou)
- [[`bfce6c82f4`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bfce6c82f4)] - **chore(frontend)**: update @twreporter packages (Lucien)
- [[`fc0f5fa6cd`](https://github.com/twreporter/congress-dashboard-monorepo/commit/fc0f5fa6cd)] - **fix**: buttonOnclick typo (Lucien)
- [[`35c78d307b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/35c78d307b)] - **fix(frontend)**: add comment for magic number (Aylie Chou)
- [[`d7f77db641`](https://github.com/twreporter/congress-dashboard-monorepo/commit/d7f77db641)] - **fix(frontend)**: address dashboard & speech defects (Aylie Chou)
- [[`5964403034`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5964403034)] - **fix(frontend)**: remove console.log (Aylie Chou)
- [[`0931031f49`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0931031f49)] - **fix(frontend)**: sidebar & dashboard styles (Aylie Chou)
- [[`37771a5100`](https://github.com/twreporter/congress-dashboard-monorepo/commit/37771a5100)] - **fix(frontend)**: address defects of circle avatar (Aylie Chou)
- [[`4d41f6d299`](https://github.com/twreporter/congress-dashboard-monorepo/commit/4d41f6d299)] - Merge remote-tracking branch 'upstream/master' into feature/not-found-page (Lucien)
- [[`373935b024`](https://github.com/twreporter/congress-dashboard-monorepo/commit/373935b024)] - **fix(frontend)**: add type and naming (Lucien)
- [[`dc70e5d1ee`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dc70e5d1ee)] - **fix(frontend)**: event type and next head (Lucien)
- [[`f4dcf617b5`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f4dcf617b5)] - **feat(frontend)**: add ssr loading page (Lucien)
- [[`dce70d3a89`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dce70d3a89)] - **feat(frontend)**: add error page (Lucien)
- [[`403dedaf15`](https://github.com/twreporter/congress-dashboard-monorepo/commit/403dedaf15)] - **feat(frontend)**: add not found page (Lucien)
- [[`2d60237502`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2d60237502)] - **fix(frontend)**: replace magic number as var (Aylie Chou)
- [[`e5ea3c45d6`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e5ea3c45d6)] - **fix(frontend)**: address defects of feedback (Aylie Chou)
- [[`082e61400e`](https://github.com/twreporter/congress-dashboard-monorepo/commit/082e61400e)] - **fix(frontend)**: remove console log (Aylie Chou)
- [[`48f9fc6c08`](https://github.com/twreporter/congress-dashboard-monorepo/commit/48f9fc6c08)] - **fix(frontend)**: address defects of home page (Aylie Chou)
- [[`b6fc01e1dd`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b6fc01e1dd)] - **fix(frontend)**: update style of circle avatar (Aylie Chou)
- [[`10823632cf`](https://github.com/twreporter/congress-dashboard-monorepo/commit/10823632cf)] - **fix(frontend)**: improve topic and legislator page sidebar filter (Lucien)
- [[`9ec553ad21`](https://github.com/twreporter/congress-dashboard-monorepo/commit/9ec553ad21)] - **fix(frontend)**: speech page donation box (Lucien)
- [[`81f24e4e60`](https://github.com/twreporter/congress-dashboard-monorepo/commit/81f24e4e60)] - **fix(frontend)**: fix about page margin and donation box issue (Lucien)
- [[`86dcddfb74`](https://github.com/twreporter/congress-dashboard-monorepo/commit/86dcddfb74)] - **fix(frontend)**: fix review comments (Aylie Chou)
- [[`9b1a1cc331`](https://github.com/twreporter/congress-dashboard-monorepo/commit/9b1a1cc331)] - **feat(frontend)**: support multi-select feedback (Aylie Chou)
- [[`14d4af0f0c`](https://github.com/twreporter/congress-dashboard-monorepo/commit/14d4af0f0c)] - **fix(frontend)**: address defects of Feedback (Aylie Chou)
- [[`56564f7068`](https://github.com/twreporter/congress-dashboard-monorepo/commit/56564f7068)] - **fix(frontend)**: use id instead of index for key (Lucien)
- [[`69b66bcf23`](https://github.com/twreporter/congress-dashboard-monorepo/commit/69b66bcf23)] - **feat(frontend)**: add donation box for speech page (Lucien)
- [[`3d8e07ec62`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3d8e07ec62)] - Merge remote-tracking branch 'upstream/master' into feature/frontend-about-page (Lucien)
- [[`229f1ee56f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/229f1ee56f)] - **feat(frontend)**: use cache function for getAboutPage (Lucien)
- [[`c95646c6ef`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c95646c6ef)] - **feat(frontend)**: use openFeedback (Lucien)
- [[`ff144a9e81`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ff144a9e81)] - **fix(frontend)**: force dynamic to about page (Lucien)
- [[`d439f9ff8b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/d439f9ff8b)] - **feat(frontend)**: add env page slug for staging (Lucien)
- [[`a90bc775e9`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a90bc775e9)] - **chore(frontend)**: sync master (Lucien)
- [[`c6256762d9`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c6256762d9)] - **fix(frontend)**: use flatMap address comment from copilot (Lucien)
- [[`adaec9dd50`](https://github.com/twreporter/congress-dashboard-monorepo/commit/adaec9dd50)] - **feat(frontend)**: get about page data from go-api (Lucien)
- [[`2fb1f5bc63`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2fb1f5bc63)] - **feat(frontend)**: add about page & donation box (Lucien)
- [[`39157d5939`](https://github.com/twreporter/congress-dashboard-monorepo/commit/39157d5939)] - **feat(frontend)**: add react-article-components packages (Lucien)
- [[`6b8148d33a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6b8148d33a)] - **fix(frontend)**: fix functionBar filter modal defect (Aylie Chou)
- [[`b6808eda51`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b6808eda51)] - **fix(frontend)**: legislator page follow more scroll no padding (Lucien)
- [[`3e1fc5884d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3e1fc5884d)] - **chore(frontend)**: sync master (Lucien)
- [[`dae8ebf305`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dae8ebf305)] - **fix(frontend)**: use sort from fetcher utils (Lucien)
- [[`df9a53a7a9`](https://github.com/twreporter/congress-dashboard-monorepo/commit/df9a53a7a9)] - **fix(frontend)**: topic and legislator page sidebar filter (Lucien)
- [[`e8e4e36c63`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e8e4e36c63)] - **fix(frontend)**: typo (Aylie Chou)
- [[`38761bef95`](https://github.com/twreporter/congress-dashboard-monorepo/commit/38761bef95)] - **fix(frontend)**: add placeholder for filter modal (Aylie Chou)
- [[`ea95712647`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ea95712647)] - **fix(frontend)**: address defects in home page (Aylie Chou)
- [[`50ceae3e2b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/50ceae3e2b)] - **fix(frontend)**: typo (Aylie Chou)
- [[`245f699043`](https://github.com/twreporter/congress-dashboard-monorepo/commit/245f699043)] - **fix(frontend)**: add mobile style (Aylie Chou)
- [[`ad9c45d8b5`](https://github.com/twreporter/congress-dashboard-monorepo/commit/ad9c45d8b5)] - **feat(frontend)**: add `/api/feedback` endpoint (Aylie Chou)
- [[`051fdd9b9f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/051fdd9b9f)] - **feat(frontend)**: add feedback utils & valid email (Aylie Chou)
- [[`6976888509`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6976888509)] - **feat(frontend)**: add components for feedback (Aylie Chou)
- [[`52a02c8c91`](https://github.com/twreporter/congress-dashboard-monorepo/commit/52a02c8c91)] - **feat(frontend)**: add `Feedback` & step 1 component (Aylie Chou)
- [[`0a54fe46a9`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0a54fe46a9)] - **feat(frontend)**: add comoponents for feedback (Aylie Chou)
- [[`9d5db23aff`](https://github.com/twreporter/congress-dashboard-monorepo/commit/9d5db23aff)] - **fix(frontend)**: hide attendee & topic if empty (Lucien)
- [[`11b5c30734`](https://github.com/twreporter/congress-dashboard-monorepo/commit/11b5c30734)] - **fix(frontend)**: add overflow hidden for title (Lucien)
- [[`3dc98714ed`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3dc98714ed)] - **fix(frontend)**: apply useOutsideClick in `@/hook` (Aylie Chou)
- [[`20517860ec`](https://github.com/twreporter/congress-dashboard-monorepo/commit/20517860ec)] - **fix(frontend)**: address review comments (Aylie Chou)
- [[`af61f17421`](https://github.com/twreporter/congress-dashboard-monorepo/commit/af61f17421)] - **fix(frontend)**: resolve yarn build fail (Aylie Chou)
- [[`54d7db8517`](https://github.com/twreporter/congress-dashboard-monorepo/commit/54d7db8517)] - **feat(frontend)**: add more fetcher for home page (Aylie Chou)
- [[`7c83255781`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7c83255781)] - Merge remote-tracking branch 'upstream/master' into chore/image-host (Lucien)
- [[`3928ca6553`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3928ca6553)] - **chore(frontend)**: change image & api host to new url (Lucien)
- [[`5bf26a6d19`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5bf26a6d19)] - **chore(frontend)**: change image & api host (Lucien)
- [[`8add5dbc12`](https://github.com/twreporter/congress-dashboard-monorepo/commit/8add5dbc12)] - Merge remote-tracking branch 'upstream/master' into feature/frontend-title-metadata (Lucien)
- [[`7b31b58161`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7b31b58161)] - **fix(frontend)**: separate links and routes (Lucien)
- [[`fb83467970`](https://github.com/twreporter/congress-dashboard-monorepo/commit/fb83467970)] - **fix(frontend)**: use internal route constant (Lucien)
- [[`4a5b8f1ba8`](https://github.com/twreporter/congress-dashboard-monorepo/commit/4a5b8f1ba8)] - **feat(frontend)**: add metadata for dynamic page (Lucien)
- [[`2dfff8c096`](https://github.com/twreporter/congress-dashboard-monorepo/commit/2dfff8c096)] - **feat(frontend)**: add favicon and change site title (Lucien)
- [[`eb0bf7b7f0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/eb0bf7b7f0)] - **chore(frontend)**: update @twreporter packages (Lucien)
- [[`4780890cf3`](https://github.com/twreporter/congress-dashboard-monorepo/commit/4780890cf3)] - **chore(frontend)**: update @twreporter packages (Lucien)
- [[`e21051e087`](https://github.com/twreporter/congress-dashboard-monorepo/commit/e21051e087)] - Merge remote-tracking branch 'upstream/master' into fix/frontend-typo (Lucien)
- [[`58f4d40178`](https://github.com/twreporter/congress-dashboard-monorepo/commit/58f4d40178)] - **fix(frontend)**: typo and speech page title (Lucien)
- [[`b13a7282dc`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b13a7282dc)] - **fix(frontend)**: typo & fix type check (Aylie Chou)
- [[`6c6fcf1733`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6c6fcf1733)] - **fix(frontend)**: prevent static-generation on Home (Aylie Chou)
- [[`5f1c966d01`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5f1c966d01)] - **fix(frontend)**: use app router way error handling (Aylie Chou)
- [[`6b5fb2bb39`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6b5fb2bb39)] - **fix(frontend)**: add more log for home page SSR (Aylie Chou)
- [[`64cc12a0bd`](https://github.com/twreporter/congress-dashboard-monorepo/commit/64cc12a0bd)] - **fix(frontend)**: add Error for SSR error (Aylie Chou)
- [[`431fe879c1`](https://github.com/twreporter/congress-dashboard-monorepo/commit/431fe879c1)] - **fix(frontend)**: add `showAvatar` props to Tab (Aylie Chou)
- [[`8096d146ae`](https://github.com/twreporter/congress-dashboard-monorepo/commit/8096d146ae)] - Merge remote-tracking branch 'upstream/dev' into fix/legislator-page-1 (Lucien)
- [[`fdead25a95`](https://github.com/twreporter/congress-dashboard-monorepo/commit/fdead25a95)] - **fix(frontend)**: add note to legislator data (Lucien)
- [[`d1db23403d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/d1db23403d)] - **fix(frontend)**: enhance LegislatorInfo component layout and update title styles (Lucien)
- [[`f06a3eaee5`](https://github.com/twreporter/congress-dashboard-monorepo/commit/f06a3eaee5)] - **fix(frontend)**: update Loader component to accept useAbsolute prop and wrap in EmptyState (Lucien)
- [[`0feb390cf2`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0feb390cf2)] - **fix(frontend)**: rename legislativeMeeting to legislativeMeetings and update related hooks (Lucien)
- [[`cbcb445228`](https://github.com/twreporter/congress-dashboard-monorepo/commit/cbcb445228)] - **fix(frontend)**: rename note to toolitp, use legislativeMeetings hook (Lucien)
- [[`b7bfbb61f9`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b7bfbb61f9)] - **fix(frontend)**: use logger instead of console.error (Aylie Chou)
- [[`c623b13259`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c623b13259)] - **feat(frontend)**: filter graphql null to undefined (Lucien)
- [[`7512273198`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7512273198)] - **fix(frontend)**: fix comments (Lucien)
- [[`5e1005ada5`](https://github.com/twreporter/congress-dashboard-monorepo/commit/5e1005ada5)] - **fix(frontend)**: adress yarn build failed problem (Aylie Chou)
- [[`0109245990`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0109245990)] - **fix(frontend)**: address merge conflicts (Aylie Chou)
- [[`0e71d04802`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0e71d04802)] - **fix(frontend)**: typo (Aylie Chou)
- [[`0daf8aa387`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0daf8aa387)] - **feat(frontend)**: add fetcher for speeches (Aylie Chou)
- [[`b84d9ab33a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b84d9ab33a)] - **feat(frontend)**: add fetcher for legislator at home (Aylie Chou)
- [[`7876a5a37f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/7876a5a37f)] - **feat(frontend)**: add fetchers for topics & filter (Aylie Chou)
- [[`587a768d59`](https://github.com/twreporter/congress-dashboard-monorepo/commit/587a768d59)] - **fix(frontend)**: add try catch to `getCDNUrl` (Aylie Chou)
- [[`cfac3f2562`](https://github.com/twreporter/congress-dashboard-monorepo/commit/cfac3f2562)] - **fix(frontend)**: use general `formatDate` method (Aylie Chou)
- [[`bbdcacfdbe`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bbdcacfdbe)] - **fix(frontend)**: resolve review comment (Aylie Chou)
- [[`1bc3eb857d`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1bc3eb857d)] - **fix(frontend)**: typo & hide block if fetch error (Aylie Chou)
- [[`3c25f1867c`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3c25f1867c)] - **fix(frontend)**: add skeleton loading for articles (Aylie Chou)
- [[`c7c54a16f4`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c7c54a16f4)] - **feat(frontend)**: add related twreporter articles (Aylie Chou)
- [[`b27a6879ed`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b27a6879ed)] - **chore(frontend)**: sync dev (Lucien)
- [[`9a895b8204`](https://github.com/twreporter/congress-dashboard-monorepo/commit/9a895b8204)] - **fix(frontend)**: parse summary for speech card (Lucien)
- [[`c98b5b81ba`](https://github.com/twreporter/congress-dashboard-monorepo/commit/c98b5b81ba)] - **fix(frontend)**: use common loader component (Lucien)
- [[`6d7fa67fa0`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6d7fa67fa0)] - **fix(frontend)**: add loader component and add loading for topic & legislator page (Lucien)
- [[`61211b17d5`](https://github.com/twreporter/congress-dashboard-monorepo/commit/61211b17d5)] - **fix(frontend)**: fix use-filters (Lucien)
- [[`894416739b`](https://github.com/twreporter/congress-dashboard-monorepo/commit/894416739b)] - **fix(frontend)**: use legislative meeting term filter by legislator (Lucien)
- [[`87e7e04588`](https://github.com/twreporter/congress-dashboard-monorepo/commit/87e7e04588)] - **fix(frontend)**: check if legislator slug exist (Lucien)
- [[`a4978d8c16`](https://github.com/twreporter/congress-dashboard-monorepo/commit/a4978d8c16)] - **fix(frontend)**: add empty state for legislator page (Lucien)
- [[`74fa26cb54`](https://github.com/twreporter/congress-dashboard-monorepo/commit/74fa26cb54)] - **fix(frontend)**: add empty state to topic speech summary list and fix filter count (Lucien)
- [[`de6f7d38ef`](https://github.com/twreporter/congress-dashboard-monorepo/commit/de6f7d38ef)] - **fix(frontend)**: pass querystring for legislator route (Lucien)
- [[`6e4a33d507`](https://github.com/twreporter/congress-dashboard-monorepo/commit/6e4a33d507)] - **fix(frontend)**: legislator image & scrollbar width (Lucien)
- [[`02507e93ca`](https://github.com/twreporter/congress-dashboard-monorepo/commit/02507e93ca)] - **fix(frontend)**: fix comments (Lucien)
- [[`3a07eafe0f`](https://github.com/twreporter/congress-dashboard-monorepo/commit/3a07eafe0f)] - **feat(frontend)**: parse HTML summaries and consolidate date formatter logic (Lucien)
- [[`bc1a862e6a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bc1a862e6a)] - **fix(frontend)**: implement universal date formatter with enhanced flexibility (Lucien)
- [[`4bc42ce9b6`](https://github.com/twreporter/congress-dashboard-monorepo/commit/4bc42ce9b6)] - **feat(frontend)**: use data from api for speech page (Lucien)
- [[`dc6d7b2a73`](https://github.com/twreporter/congress-dashboard-monorepo/commit/dc6d7b2a73)] - **feat(frontend)**: add snackbar for sidebar filter (Lucien)
- [[`b7d94ac4ae`](https://github.com/twreporter/congress-dashboard-monorepo/commit/b7d94ac4ae)] - **chore(frontend)**: sync dev (Lucien)
- [[`bffb6d2e94`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bffb6d2e94)] - **feat(frontend)**: implement filter modals and sidebar z-index management (Lucien)
- [[`bd10d1866a`](https://github.com/twreporter/congress-dashboard-monorepo/commit/bd10d1866a)] - **chore(frontend)**: add staging env file (Lucien)
- [[`1fb227e184`](https://github.com/twreporter/congress-dashboard-monorepo/commit/1fb227e184)] - **chore(frontend)**: update @twreporter packages (Lucien)
- [[`0339513a82`](https://github.com/twreporter/congress-dashboard-monorepo/commit/0339513a82)] - **chore(frontend)**: update @twreporter packages (Lucien)
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
