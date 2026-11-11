---

# Lawmaker CLI

A command-line tool to feed Legislative Yuan and city council data into Algolia indices.

---

## 🔧 Environment Variables

Create a `.env` file in this package's root directory (`packages/cli`) with the following variables:

```env
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_WRITE_KEY=your_algolia_write_key
HEADLESS_ACCOUNT_EMAIL=your_email@example.com
HEADLESS_ACCOUNT_PASSWORD=your_password
GRAPHQL_ENDPOINT=http://localhost:3000/api/graphql
```

### Description

| Variable                    | Description                                  |
| --------------------------- | -------------------------------------------- |
| `ALGOLIA_APP_ID`            | Your Algolia application ID                  |
| `ALGOLIA_WRITE_KEY`         | Algolia Write API key                        |
| `HEADLESS_ACCOUNT_EMAIL`    | Email used for authenticating GraphQL access |
| `HEADLESS_ACCOUNT_PASSWORD` | Password used for authenticating GraphQL     |
| `GRAPHQL_ENDPOINT`          | The URL of lawmaker-cms GraphQL API          |

The CLI loads these variables automatically using `dotenv`. Use staging credentials for testing; running locally with `--no-dryrun` still writes to the configured Algolia application.

---

### Command Environment Variables (Cloud Run Job)

You can pass options via environment variables, which is useful for Cloud Run Jobs.
Defaults are applied only when the env var is not set; CLI flags may override.
CLI flags are additive for data-type selection. If you enable a data type via env, adding another flag includes both.
For specific values (meeting/session terms, council name) and dryrun, CLI flags override environment variables when both are provided.

**Legislative Yuan:**

| Variable                | Description                          | Default |
| ----------------------- | ------------------------------------ | ------- |
| `LAWMAKER_MEETING_TERM` | Same as `--meeting-term`             | `11`    |
| `LAWMAKER_SESSION_TERM` | Same as `--session-term`             | `all`   |
| `LAWMAKER_TOPICS`       | Same as `--topics` (boolean)         | `false` |
| `LAWMAKER_LEGISLATORS`  | Same as `--legislators` (boolean)    | `false` |
| `LAWMAKER_SPEECHES`     | Same as `--speeches` (boolean)       | `false` |

**City Council:**

| Variable                    | Description                              | Default |
| --------------------------- | ---------------------------------------- | ------- |
| `LAWMAKER_COUNCIL_NAME`     | Same as `--council-name`                 | (none)  |
| `LAWMAKER_COUNCILORS`       | Same as `--councilor` (boolean)          | `false` |
| `LAWMAKER_COUNCIL_TOPICS`   | Same as `--council-topic` (boolean)      | `false` |
| `LAWMAKER_COUNCIL_SPEECHES` | Same as `--speech` (boolean)            | `false` |
| `LAWMAKER_COUNCIL_BILLS`    | Same as `--council-bill` (boolean)       | `false` |

**Common:**

| Variable          | Description                              | Default |
| ----------------- | ---------------------------------------- | ------- |
| `LAWMAKER_DRYRUN` | Same as `--dryrun` / `--no-dryrun`       | `true`  |

Boolean values accept: `true/false` (case-sensitive).

---

## Deployment

The root `cloudbuild.yaml` builds and deploys this package as a **Cloud Run
Job** (`gcloud run jobs create`/`update` instead of frontend/cms's `gcloud
run deploy`). The Cloud Build trigger sets `_ENV` to `dev`, `staging`, or
`prod`, and the job name is derived as
`${_ENV}-congress-dashboard-${_TARGET_PACKAGE}` (e.g.
`prod-congress-dashboard-cli`), same as frontend/cms.

Public job configuration (including the `LAWMAKER_*` variables above, when
overridden) lives in `deploy/env.${_ENV}.cli.public.yaml`, and secrets
(`ALGOLIA_WRITE_KEY`, `HEADLESS_ACCOUNT_PASSWORD`) are provisioned in Secret
Manager via `deploy/secrets/create-secrets.sh`. See
[`deploy/README.md`](deploy/README.md) for the full breakdown, migration
notes from the existing `prod-lawmaker-cli` job, and rollout notes.

Deploying the CLI does not execute the job. After configuring the target
Algolia indices, run the job explicitly. For example, to synchronize council
speeches and councilor dates in staging:

```bash
gcloud run jobs execute staging-congress-dashboard-cli \
  --region asia-east1 \
  --args="feed-algolia,council,--speech,--councilor,--no-dryrun" --wait
```

Validate in staging before running production synchronization. See the
[search documentation](../frontend/src/components/search/README.md) for
index configuration and rollout order.

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/twreporter/congress-dashboard-monorepo.git
cd congress-dashboard-monorepo
yarn install
cd packages/cli
```

The build and usage commands below run from `packages/cli`.

## Build

Compile TypeScript files to JavaScript:

```bash
yarn build
```

## Usage

### Development Mode

Use the development entry point with `ts-node`:

```bash
yarn dev feed-algolia [options]
```

### Production Mode

After building:

```bash
yarn lawmaker feed-algolia [options]
```

You can also invoke it directly:

```bash
./lib/index.js feed-algolia [options]
```

## Command: `feed-algolia`

Feed Algolia search indices with legislative yuan or city council data.

### Subcommands

#### `feed-algolia legislative-yuan`

Feed legislative yuan data (topics, legislators, speeches).

**Options:**

If no data-type flags are provided, the command runs all data types (topics, legislators, speeches).

* `--meeting-term <term>`
  Legislative meeting term (default: `11`).

* `--session-term <term>`
  Legislative meeting session term. Only for updating speeches. Accepts numeric value or `all` to process every session in the specified meeting term (default: `all`).

* `--topics`
  Only update topic records.

* `--legislators`
  Only update legislator records.

* `--speeches`
  Only update speech records.

* `--dryrun`
  Do not upload to Algolia (default behavior).

* `--no-dryrun`
  Actually upload data to Algolia.

**Examples:**

```bash
# Default: dry run all data types in meeting term 11
yarn lawmaker feed-algolia legislative-yuan --meeting-term 11

# Use environment defaults (Cloud Run Job style)
LAWMAKER_MEETING_TERM=11 LAWMAKER_SPEECHES=true LAWMAKER_DRYRUN=false yarn lawmaker feed-algolia legislative-yuan

# Dry run only topics in meeting term 10
yarn lawmaker feed-algolia legislative-yuan --meeting-term 10 --topics

# Actually upload speeches in meeting term 11 and session term 2
yarn lawmaker feed-algolia legislative-yuan --meeting-term 11 --session-term 2 --speeches --no-dryrun
```

#### `feed-algolia council`

Feed city council data (councilors, topics, speeches, bills).

**Options:**

If no data types are selected through flags or environment variables, the command runs all data types (councilors, topics, speeches, bills). Multiple data-type selections are additive.

* `--council-name <name>`
  Specific council to update. Valid values: `taipei`, `new-taipei`, `taoyuan`, `taichung`, `tainan`, `kaohsiung`. Omit this option to update all six major cities.

* `--councilor`
  Only update councilor records.

* `--council-topic`
  Only update council topic records.

* `--speech`
  Only update council speech records. This council option is singular; the Legislative Yuan option is `--speeches`.

* `--council-bill`
  Only update council bill records.

* `--dryrun`
  Do not upload to Algolia (default behavior).

* `--no-dryrun`
  Actually upload data to Algolia.

**Examples:**

```bash
# Default: dry run all data types for all six major cities
yarn lawmaker feed-algolia council

# Dry run only councilors for Taipei
yarn lawmaker feed-algolia council --council-name taipei --councilor

# Preview Taipei speeches across all meeting terms without writing to Algolia
yarn dev feed-algolia council --speech --council-name taipei --dryrun

# Upload Taipei speeches and refresh councilor latest speech dates
yarn dev feed-algolia council --speech --councilor --council-name taipei --no-dryrun

# Actually upload all data for Kaohsiung
yarn lawmaker feed-algolia council --council-name kaohsiung --no-dryrun

# Use environment defaults (Cloud Run Job style)
LAWMAKER_COUNCIL_NAME=taipei LAWMAKER_COUNCILORS=true LAWMAKER_DRYRUN=false yarn lawmaker feed-algolia council
```

**Synchronization notes:**

- Councilor synchronization requires the CMS `CouncilMember.latestSpeechDate` field, which uses Prisma's maximum-date aggregate rather than loading and sorting full transcripts. Deploy the updated CMS before updating the CLI; no database migration is required. The field returns `null` for members without speeches.
- All matching records across all meeting terms are uploaded, not just recently updated records. Records deleted from CMS are not automatically removed from Algolia.
- Use `--speech --councilor` to update both speech records and councilor latest speech dates.
- Dry-run requires CMS access but does not write to Algolia. Specify `--dryrun` explicitly when previewing to override environment defaults.

## License

MIT License
