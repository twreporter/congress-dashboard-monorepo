# CMS Deployment

The root `cloudbuild.yaml` builds and deploys cms. This directory owns the
environment-specific public configuration and Secret Manager specification
consumed by that deployment.

The Cloud Build trigger must set `_ENV` to `dev`, `staging`, or `prod`. The
Cloud Run service name is derived as
`${_ENV}-congress-dashboard-${_TARGET_PACKAGE}` (e.g. `prod-congress-dashboard-cms`).

The service runs as
`sa-cloud-run-runtime@coastal-run-106202.iam.gserviceaccount.com`. Confirm
that account has the permissions the service needs (database access, GCS
mount, etc.) before deploying.

## Public Configuration

Public environment variables are stored in:

```text
deploy/env.dev.cms.public.yaml
deploy/env.staging.cms.public.yaml
deploy/env.prod.cms.public.yaml
```

`DATABASE_URL` and `SESSION_SECRET` must not be added to these files — they
are Secret Manager values (see below). `PORT` and `HOST` are already set as
`ENV` instructions in `packages/cms/Dockerfile` and are intentionally not
managed here.

## Secrets

Secret IDs follow this pattern:

```text
${ENV}-congress-dashboard-cms_${secret-key}
```

Create a single secret or all secrets from `packages/cms`:

```bash
ENV=dev ./deploy/secrets/create-secrets.sh session-secret
ENV=dev ./deploy/secrets/create-secrets.sh --all
```

The shared script grants the Cloud Run runtime service account
(`sa-cloud-run-runtime@coastal-run-106202.iam.gserviceaccount.com`) access to
each secret it creates or updates.

Create `database-url` and `session-secret` for every environment before
deploying. `packages/cms/auth.ts` falls back to a hardcoded placeholder
session secret if `SESSION_SECRET` is unset, so make sure the secret is
actually created and wired up.

Changing `SESSION_SECRET` invalidates existing CMS sessions.

## Resource Configuration

`cloudbuild.yaml`'s deploy step applies the same cpu, memory, concurrency,
timeout, ingress, network/subnet, and vpc-egress settings across dev,
staging, and prod. The only difference between environments is instance
scaling: dev/staging run `--min-instances 0 --max-instances 3`, prod runs
`--min-instances 1 --max-instances 20`.

All three environments deploy into the `asia-east1-cloud-run-prod-services`
VPC subnet — confirm that subnet is reachable/appropriate for dev/staging
traffic (including the database) before deploying.

## Rollout

Deploy and verify dev, then staging, then production. Confirm the health
check, CMS login, GCS mount (`run.sh` calls `gcsfuse`), and
`db-migrate`/Prisma migration output in the deploy logs.
