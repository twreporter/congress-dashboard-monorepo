ARG NODE_VERSION=22.23.1

FROM node:${NODE_VERSION}-slim AS builder

ENV APP_DIR=/app

WORKDIR $APP_DIR

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml $APP_DIR/
COPY packages/cms/package.json packages/cms/package.json
COPY packages/cli/package.json packages/cli/package.json
COPY packages/frontend/package.json packages/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json

COPY packages/shared packages/shared
COPY packages/cli packages/cli

RUN SKIP_BUILD_DEPS=true YARN_ENABLE_IMMUTABLE_INSTALLS=true yarn workspaces focus lawmaker-cli @twreporter/congress-dashboard-shared
RUN yarn workspace @twreporter/congress-dashboard-shared build
RUN yarn workspace lawmaker-cli build

FROM node:${NODE_VERSION}-slim AS production-deps

ENV APP_DIR=/app

WORKDIR $APP_DIR

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml $APP_DIR/
COPY packages/cms/package.json packages/cms/package.json
COPY packages/cli/package.json packages/cli/package.json
COPY packages/frontend/package.json packages/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json

COPY packages/shared packages/shared
COPY packages/cli packages/cli

RUN SKIP_BUILD_DEPS=true YARN_ENABLE_IMMUTABLE_INSTALLS=true yarn workspaces focus lawmaker-cli --production && yarn cache clean
COPY --from=builder $APP_DIR/packages/shared/lib packages/shared/lib

FROM node:${NODE_VERSION}-slim AS runner

ENV APP_DIR=/app

WORKDIR $APP_DIR

COPY --from=production-deps $APP_DIR/node_modules ./node_modules
COPY --from=production-deps $APP_DIR/packages/shared/package.json ./packages/shared/package.json
COPY --from=production-deps $APP_DIR/packages/shared/lib ./packages/shared/lib
COPY --from=builder $APP_DIR/packages/cli/package.json packages/cli/package.json
COPY --from=builder $APP_DIR/packages/cli/lib packages/cli/lib

WORKDIR $APP_DIR/packages/cli

ENV NODE_ENV=production

ENTRYPOINT ["node", "lib/index.js"]
CMD ["feed-algolia", "legislative-yuan"]
