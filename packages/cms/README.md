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
