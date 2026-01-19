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

Feed Algolia search indices with updated records.

### Options

If no data-type flags are provided, the command runs all data types (topics, legislators, and speeches).

* `--meeting-term` (required)
  Legislative meeting term. Required for all runs.

* `--session-term`
  Legislative meeting session term. Only for updating speeches. Accepts numeric value or `all` to process every session in the specified meeting term.

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

### Examples

```bash
# Default (no data-type flags): dry run all data types in meeting term 11
yarn lawmaker feed-algolia --meeting-term 11

# Dry run only topics in the meeting-term 10
yarn lawmaker feed-algolia --meeting-term 10 --topics

# Actually upload speeches in the meeting-term 11 and session-term 2
yarn lawmaker feed-algolia --meeting-term 11 --session-term 2 --speeches --no-dryrun
```

## License

MIT License
