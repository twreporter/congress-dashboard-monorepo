# CLI Deployment

The root `cloudbuild.yaml` builds and deploys cli as a **Cloud Run Job**
(`gcloud run jobs create`/`update`). The Cloud Build trigger must set `_ENV`
to `dev`, `staging`, or `prod`. The job name is derived as
`${_ENV}-congress-dashboard-${_TARGET_PACKAGE}` (e.g.
`prod-congress-dashboard-cli`).

The job runs as `sa-cloud-run-runtime@coastal-run-106202.iam.gserviceaccount.com`.
Confirm that account has the permissions the job needs before deploying.

The job connects through the `twreporter-custom-network` VPC with
`all-traffic` egress, needed to reach the CMS's internal GraphQL endpoint.
Subnet is `asia-east1-cloud-run-nonprod` for dev/staging and
`asia-east1-cloud-run-prod-jobs` for prod.

## Public Configuration

Public environment variables are stored in:

```text
deploy/env.dev.cli.public.yaml
deploy/env.staging.cli.public.yaml
deploy/env.prod.cli.public.yaml
```

`ALGOLIA_WRITE_KEY` and `HEADLESS_ACCOUNT_PASSWORD` must not be added to
these files — they are Secret Manager values (see below).

Job behavior is controlled by the container's `--args` (not managed by
`cloudbuild.yaml`) or by adding `LAWMAKER_*` env vars to these files — see
`packages/cli/README.md` for the available variables and their defaults.

## Secrets

Secret IDs follow this pattern:

```text
${ENV}-congress-dashboard-cli_${secret-key}
```

Create a single secret or all secrets from `packages/cli`:

```bash
ENV=dev ./deploy/secrets/create-secrets.sh algolia-write-key
ENV=dev ./deploy/secrets/create-secrets.sh --all
```

The shared script grants the Cloud Run runtime service account
(`sa-cloud-run-runtime@coastal-run-106202.iam.gserviceaccount.com`) access to
each secret it creates or updates.

Create `algolia-write-key` and `headless-account-password` for every
environment before deploying.

## Rollout

Confirm a dry-run execution (`LAWMAKER_DRYRUN` defaults to `true`) completes
successfully and logs the expected Algolia writes before running with
`--no-dryrun` against production data.
