# Lawmaker project deployment

This branch targets `lawmaker-reporter`. Images are stored in
`asia-east1-docker.pkg.dev/lawmaker-reporter/cloud-run-source-deploy`.
Infrastructure resource names, IAM and trigger setup belong to
[gcp-infrastructure](https://github.com/nickhsine/gcp-infrastructure/blob/main/projects/lawmaker-reporter/README.md).
The build rejects other projects. Trigger configuration is not managed here.

The secret helper defaults to `lawmaker-reporter` and grants access only on
each managed secret, to the environment's runtime SA. Do not reuse the old
project's database connection value: provision this environment's new SQL
private-IP URL, database, account and TLS settings interactively.

Runtime configuration is defined directly in each package's
`deploy/env.{dev|staging|prod}.{package}.public.yaml`. Cloud Build passes
that file to `--env-vars-file` without querying CMS URLs or rewriting values.
Frontend `API_SERVER_URL` and CLI `GRAPHQL_ENDPOINT` use the corresponding
CMS endpoint `https://{env}-lawmaker-cms-450327419052.asia-east1.run.app/api/graphql`.
The project number is `450327419052`; these
[deterministic URLs](https://docs.cloud.google.com/run/docs/triggering/https-request#deterministic_url)
can be configured before the first deployment.

CMS `GCS_BUCKET` explicitly uses the intermediate
`lawmaker-reporter-{dev|staging|prod}-storage-transfer` bucket. Change the YAML
in a reviewed commit when the final buckets are ready. Public image URLs
remain unchanged; image delivery through the existing domains is not yet a
migration test. Deploy and verify CMS before testing frontend or CLI calls.

Frontend and CMS allow unauthenticated invocation but restrict ingress to
internal traffic and Cloud Load Balancing. CMS application authentication
still applies; its external LB must enable IAP before exposing it. Do not
switch DNS or Cloudflare routing until LB/IAP and application checks pass.
CLI deployment does not create a Scheduler job or execute the Job.

## Resource naming

Cloud Run services and the CLI Job use `{env}-lawmaker-{frontend|cms|cli}`.
Frontend/CMS triggers use the corresponding service names. Container images
use `lawmaker-{frontend|cms|cli}`, and secret IDs use
`{env}-lawmaker-{frontend|cms|cli}_{secret-key}` with `service=lawmaker` labels.
These names apply to the new project; the repository name, npm package names
and imports remain `congress-dashboard`.

Secret helpers create/update only the new IDs. If old-prefix secrets have
already been created in the new project, provision the new IDs and their
runtime grants before deploying. No old resources are renamed or deleted.
