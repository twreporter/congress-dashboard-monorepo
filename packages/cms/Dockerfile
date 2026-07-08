FROM node:22.23.1-slim AS build

ENV APP_DIR=/app

WORKDIR $APP_DIR

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml $APP_DIR/
COPY packages/cms/package.json packages/cms/package.json
COPY packages/cli/package.json packages/cli/package.json
COPY packages/frontend/package.json packages/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json

## Install application dependencies
RUN SKIP_BUILD_DEPS=true YARN_ENABLE_IMMUTABLE_INSTALLS=true yarn workspaces focus @twreporter/congress-dashboard-cms @twreporter/congress-dashboard-shared

COPY packages/shared packages/shared
COPY packages/cms packages/cms

RUN yarn workspace @twreporter/congress-dashboard-shared build
RUN yarn workspace @twreporter/congress-dashboard-cms postinstall

## Build application bundles
RUN yarn workspace @twreporter/congress-dashboard-cms build

FROM node:22.23.1-slim AS production-deps

ENV APP_DIR=/app

WORKDIR $APP_DIR

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml $APP_DIR/
COPY packages/cms/package.json packages/cms/package.json
COPY packages/cli/package.json packages/cli/package.json
COPY packages/frontend/package.json packages/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json

## Install production application dependencies
RUN SKIP_BUILD_DEPS=true YARN_ENABLE_IMMUTABLE_INSTALLS=true yarn workspaces focus @twreporter/congress-dashboard-cms --production && yarn cache clean

COPY packages/cms packages/cms
COPY --from=build $APP_DIR/packages/shared/lib packages/shared/lib

FROM node:22.23.1-slim AS runner

## Install system dependencies, `gcsfuse` in particular.
RUN set -e; \
    apt-get update -y && apt-get install -y \
    build-essential \
    curl \
    wget \
    gnupg2 \
    tini \
    openssl \
    lsb-release; \
    gcsFuseRepo=gcsfuse-`lsb_release -c -s`; \
    echo "deb http://packages.cloud.google.com/apt $gcsFuseRepo main" | \
    tee /etc/apt/sources.list.d/gcsfuse.list; \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
    apt-key add -; \
    # apt-get update; \
    # apt-get install -y gcsfuse \
    # TODO: remove wget workaround for gcsfuse due to missing registry & restore with apt-get
    wget https://github.com/GoogleCloudPlatform/gcsfuse/releases/download/v1.2.0/gcsfuse_1.2.0_amd64.deb -O gcsfuse.deb && apt-get install -y ./gcsfuse.deb && rm -f ./gcsfuse.deb \
    && apt-get clean

ENV APP_DIR=/app
## Set fallback mount directory
ENV MNT_DIR=/app/packages/cms/gcs
ENV HOST=0.0.0.0
ENV PORT=3000

RUN mkdir -p $APP_DIR

WORKDIR $APP_DIR

COPY --from=production-deps $APP_DIR/package.json $APP_DIR/.yarnrc.yml ./

RUN corepack enable && corepack prepare yarn@4.6.0 --activate

COPY packages/cms packages/cms

COPY --from=production-deps $APP_DIR/node_modules ./node_modules
COPY --from=production-deps $APP_DIR/packages/cms/node_modules ./packages/cms/node_modules
COPY --from=production-deps $APP_DIR/packages/shared/package.json ./packages/shared/package.json
COPY --from=production-deps $APP_DIR/packages/shared/lib ./packages/shared/lib
COPY --from=build $APP_DIR/packages/cms/.keystone ./packages/cms/.keystone

## Ensure the script is executable
RUN chmod +x packages/cms/run.sh

WORKDIR $APP_DIR/packages/cms

EXPOSE 3000

## Use tini to manage zombie processes and signal forwarding
## https://github.com/krallin/tini
ENTRYPOINT ["/usr/bin/tini", "--"]

## Pass the startup script as arguments to Tini
CMD [ "/app/packages/cms/run.sh"]
