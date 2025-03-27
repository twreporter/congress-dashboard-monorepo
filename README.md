# twreporter-congress-dashboard-monorepo

## Introduction

This is the monorepo of twreporter congress dashboard.
This monorepo containing follow sub-packages:

- [@twreporter-congress-dashboard/frontend](./packages/frontend/): see `packages/frontend`
- [@twreporter-congress-dashboard/cms](./packages/cms/): see `packages/cms`

### Monorepo management

We use [lerna](https://lerna.js.org/) v8 with `yarn workspace` to manage this monorepo.
Please refer to [lerna document](https://lerna.js.org/docs/api-reference/commands) for the cli commands details.

## Get Started

### Install

We use `yarn` for dependency management.
Please install dependencies on root before execution.

```shell
$ yarn install
```

### Development

#### How to add sub-package

1. add sub-package under `/packages` folder
2. add sub-package info in this `README.md`

#### version

## CI/CD

We use GCP `cloud run` to serve the congress dashboard, and use `cloud build` to trigger the CI/CD process.
To add new service in this project, please add following configuration:

1. add `Dockerfile` under your sub-package folder
  a. `cloudbuild.yaml` would execute the `docker build` command for target package 
2. configure your service on `cloud run`
3. add trigger to `cloud build`
  a. please use `congress-dashboard-cloud-build` service account
  b. don't forget to add `substitutions`
  c. don't forget to add `packages/<sub-package name>/**` to included files filter
4. add your service in the `load-balancer`
5. configure DNS setting on `cloudflare`

## Troubleshooting
