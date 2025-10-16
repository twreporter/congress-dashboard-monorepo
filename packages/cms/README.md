# Congress Dashboard CMS

- base on [keystone6](https://keystonejs.com/docs)

## Getting Started in a Local Environment

### 1. Start the Database

We currently use `MySQL 8.0.37` as our database, which is also the latest version supported by Google Cloud SQL. Below is an example of how to start the `MySQL` service using `Docker`:

```bash
# Pull the MySQL image
docker pull mysql:8.0.37

# Start the Docker container
docker run --name mysql8 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d mysql:8.0.37
```

> Note:
> Make sure to check `environment-variables.ts` if the Docker port or password has been changed.

### 2. Install Dependencies

We use `yarn` as our package manager.

```bash
yarn install
```

### 3. Run Development Server

To start the development server, use one of the following commands:

```bash
yarn dev
```

or

```bash
npm run dev
```

## Structured logging (Cloud Logging)

We use a small, dependency-free structured logger that prints one JSON object per line to stdout. Logs are compatible with Google Cloud Logging (GCP) and include severity, timestamp, and basic runtime context.

- Logger location: `packages/cms/utils/logger.ts`
- Methods: `logger.debug/info/warn/error(message, fields?)`
- Example:

```ts
import { logger } from './utils/logger'

logger.info('topic deleted', {
	context: { listKey: 'Topic', itemId: 123 },
	jsonPayload: { reason: 'admin request' },
})
```

Notes:
- Top-level fields include `severity`, `message`, `timestamp`, and a `context` section with `service`, `env` and `releaseBranch`.
- Prefer `jsonPayload` for larger objects to keep top-level flat fields readable in Cloud Logging.
- For performance timing, record a start timestamp and log `durationMs` when finished.
