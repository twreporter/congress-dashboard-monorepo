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
yarn dev feed-algolia [updatedAfter] [options]
```

### Production Mode

After building:

```bash
yarn lawmaker feed-algolia [updatedAfter] [options]
```

You can also invoke it directly:

```bash
./lib/index.js feed-algolia [updatedAfter] [options]
```

## Command: `feed-algolia`

Feed Algolia search indices with updated records.

### Parameters

* `updatedAfter` (optional): An ISO date string (e.g. `2025-06-01`). Filters records updated after this date.

### Options

* `--yesterday`
  Use yesterday’s date as `updatedAfter` if not provided.

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
# Dry run all data types updated after 2025-06-01
yarn lawmaker feed-algolia 2025-06-01

# Dry run only topics from yesterday
yarn lawmaker feed-algolia --yesterday --topics

# Actually upload speeches from June 1st
yarn lawmaker feed-algolia 2025-06-01 --speeches --no-dryrun
```

## License

MIT License
