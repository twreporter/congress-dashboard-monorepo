# Lawmaker project deployment

## Deployment overview

This deployment configuration targets `lawmaker-reporter`. Images are stored in
`asia-east1-docker.pkg.dev/lawmaker-reporter/cloud-run-source-deploy`.
Infrastructure provisioning, IAM, trigger setup, and deployment procedures
are maintained in
[gcp-infrastructure](https://github.com/twreporter/gcp-infrastructure/blob/main/projects/lawmaker-reporter/README.md).
The build rejects other projects.

The root [cloudbuild.yaml](../cloudbuild.yaml) builds and deploys frontend
and CMS as Cloud Run services, and CLI as a Cloud Run Job. CLI deployment
does not create a Scheduler job or execute the Job.

See each package's deployment guide for secret setup and verification steps:

- [Frontend](../packages/frontend/deploy/README.md)
- [CMS](../packages/cms/deploy/README.md)
- [CLI](../packages/cli/deploy/README.md)

## Configuration

| Setting | Purpose |
| --- | --- |
| `_TARGET_PACKAGE` | Selects `frontend`, `cms`, or `cli`. |
| `_IMAGE_NAME` | Sets the container image name. See resource naming below. |
| `_ENV` | Selects `dev`, `staging`, or `prod`, the Cloud Run resource name, and the runtime YAML file. |
| `_BRANCH_NAME` | Selects the package's build-time `.env.{branch}.public` file and forms the image tag `{branch}_{SHORT_SHA}`. Frontend uses this file for bundled `NEXT_PUBLIC_*` values. |
| Secret Manager | Supplies runtime passwords and keys through `--set-secrets`. |

`_ENV` and `_BRANCH_NAME` are configured independently on the trigger;
production uses `_ENV=prod` with `_BRANCH_NAME=release`.

Runtime configuration is defined directly in each package's
`deploy/env.{dev|staging|prod}.{package}.public.yaml`. Cloud Build passes
that file to `--env-vars-file` without querying CMS URLs or rewriting values.
Frontend `API_SERVER_URL` and CLI `GRAPHQL_ENDPOINT` use the corresponding
CMS endpoint `https://{env}-lawmaker-cms-450327419052.asia-east1.run.app/api/graphql`.

The [secret helper](../scripts/create-cloud-run-secrets.sh) defaults to
`lawmaker-reporter` and grants the environment's runtime service account
access only on each managed secret.

## Resource naming

Cloud Run services and the CLI Job use `{env}-lawmaker-{frontend|cms|cli}`.
Frontend/CMS triggers use the corresponding service names. Container images
use `lawmaker-{frontend|cms|cli}`, and secret IDs use
`{env}-lawmaker-{frontend|cms|cli}_{secret-key}` with `service=lawmaker` labels.
The repository name, npm package names and imports use `congress-dashboard`.
