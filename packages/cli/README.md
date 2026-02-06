---

# Lawmaker CLI

A command-line tool to feed legislator, topic, and speech data into Algolia indices.

---

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

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

Use a library like `dotenv` (already included) to load these into runtime automatically.

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
| `LAWMAKER_COUNCIL_BILLS`    | Same as `--council-bill` (boolean)       | `false` |

**Common:**

| Variable          | Description                              | Default |
| ----------------- | ---------------------------------------- | ------- |
| `LAWMAKER_DRYRUN` | Same as `--dryrun` / `--no-dryrun`       | `true`  |

Boolean values accept: `true/false` (case-sensitive).

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/twreporter/congress-dashboard-monorepo.git
cd congress-dashboard-monorepo/packages/cronjobs
yarn install
```

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

Feed city council data (councilors, topics, bills).

**Options:**

If no data-type flags are provided, the command runs all data types (councilors, topics, bills).

* `--council-name <name>`
  Specific council to update. Valid values: `taipei`, `newtaipei`, `taoyuan`, `taichung`, `tainan`, `kaohsiung`. Omit this option to update all six major cities.

* `--councilor`
  Only update councilor records.

* `--council-topic`
  Only update council topic records.

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

# Actually upload all data for Kaohsiung
yarn lawmaker feed-algolia council --council-name kaohsiung --no-dryrun

# Use environment defaults (Cloud Run Job style)
LAWMAKER_COUNCIL_NAME=taipei LAWMAKER_COUNCILORS=true LAWMAKER_DRYRUN=false yarn lawmaker feed-algolia council
```

## License

MIT License
