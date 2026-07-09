# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.23.1

FROM node:${NODE_VERSION}-slim AS builder

ENV APP_DIR=/app

WORKDIR $APP_DIR

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml $APP_DIR/
COPY --parents ./packages/*/package.json ./

RUN SKIP_BUILD_DEPS=true YARN_ENABLE_IMMUTABLE_INSTALLS=true yarn workspaces focus lawmaker-cli @twreporter/congress-dashboard-shared

COPY packages/shared packages/shared
COPY packages/cli packages/cli

RUN yarn workspace @twreporter/congress-dashboard-shared build
RUN yarn workspace lawmaker-cli build

FROM node:${NODE_VERSION}-slim AS production-deps

ENV APP_DIR=/app

WORKDIR $APP_DIR

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml $APP_DIR/
COPY --parents ./packages/*/package.json ./

RUN SKIP_BUILD_DEPS=true YARN_ENABLE_IMMUTABLE_INSTALLS=true yarn workspaces focus lawmaker-cli --production && yarn cache clean
COPY --from=builder $APP_DIR/packages/shared/lib packages/shared/lib

FROM node:${NODE_VERSION}-slim AS runner

ENV APP_DIR=/app

WORKDIR $APP_DIR

COPY --from=production-deps $APP_DIR $APP_DIR
COPY --from=builder $APP_DIR/packages/cli/lib packages/cli/lib

WORKDIR $APP_DIR/packages/cli

ENV NODE_ENV=production

ENTRYPOINT ["node", "lib/index.js"]
CMD ["feed-algolia", "legislative-yuan"]
