# Frontend Deployment

The root `cloudbuild.yaml` builds and deploys frontend. This directory owns
the environment-specific public configuration and Secret Manager
specification consumed by that deployment.

The Cloud Build trigger must set `_ENV` to `dev`, `staging`, or `prod`. The
Cloud Run service name is derived as
`${_ENV}-congress-dashboard-${_TARGET_PACKAGE}` (e.g. `prod-congress-dashboard-frontend`).

This is separate from `_BRANCH_NAME` (`dev`/`staging`/`release`), which only
controls which build-time `.env.${_BRANCH_NAME}.public` file (at the package
root, not in this directory) gets inlined into the Next.js bundle as
`NEXT_PUBLIC_*` values. `_ENV` and `_BRANCH_NAME` are set independently on
the trigger.

The service runs as
`sa-cloud-run-runtime@coastal-run-106202.iam.gserviceaccount.com`. Confirm
that account has the permissions the service needs (SES, etc.) before
deploying.

## Public Configuration

Runtime (server-side, non-`NEXT_PUBLIC_*`) public environment variables are
stored in:

```text
deploy/env.dev.frontend.public.yaml
deploy/env.staging.frontend.public.yaml
deploy/env.prod.frontend.public.yaml
```

`API_AUTH_PASSWORD`, `FEEDBACK_SLACK_WEBHOOK_URL`, `AWS_ACCESS_KEY_ID`, and
`AWS_SECRET_ACCESS_KEY` must not be added to these files — they are Secret
Manager values (see below).

## Secrets

Secret IDs follow this pattern:

```text
${ENV}-congress-dashboard-frontend_${secret-key}
```

Create a single secret or all secrets from `packages/frontend`:

```bash
ENV=dev ./deploy/secrets/create-secrets.sh api-auth-password
ENV=dev ./deploy/secrets/create-secrets.sh --all
```

The shared script grants the Cloud Run runtime service account
(`sa-cloud-run-runtime@coastal-run-106202.iam.gserviceaccount.com`) access to
each secret it creates or updates.

Create `api-auth-password`, `feedback-slack-webhook-url`,
`aws-access-key-id`, and `aws-secret-access-key` for every environment
before deploying.

## Resource Configuration

`cloudbuild.yaml`'s deploy step applies the same cpu, memory, concurrency,
timeout, ingress, network/subnet, vpc-egress, and execution-environment
settings across dev, staging, and prod. The only difference between
environments is instance scaling: dev/staging run `--min-instances 0
--max-instances 3`, prod runs `--min-instances 1 --max-instances 20`.

All three environments deploy into the `asia-east1-cloud-run-prod-services`
VPC subnet — confirm that subnet is reachable/appropriate for dev/staging
traffic before deploying.

## Rollout

Deploy and verify dev, then staging, then production. Confirm the health
check, CMS-backed API routes (`/api/_graphql/*`), and the feedback endpoint
(SES email + Slack webhook) after each deploy.
