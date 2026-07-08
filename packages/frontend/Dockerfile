ARG NODE_VERSION=22.23.1

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /repo

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/cms/package.json packages/cms/package.json
COPY packages/cli/package.json packages/cli/package.json
COPY packages/frontend/package.json packages/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN SKIP_BUILD_DEPS=true YARN_ENABLE_IMMUTABLE_INSTALLS=true yarn workspaces focus @twreporter/congress-dashboard-frontend @twreporter/congress-dashboard-shared

COPY packages/shared packages/shared
COPY packages/frontend packages/frontend

RUN yarn workspace @twreporter/congress-dashboard-shared build
RUN yarn workspace @twreporter/congress-dashboard-frontend build

FROM node:${NODE_VERSION}-alpine AS runner

ENV APP_DIR=/app

WORKDIR $APP_DIR

ENV NODE_ENV=production

ENV NODE_OPTIONS="--network-family-autoselection-attempt-timeout=30000"

# Run as non-root user in runtime container
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Include only built files and necessary dependencies, with proper ownership
COPY --from=build --chown=nextjs:nextjs /repo/packages/frontend/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /repo/packages/frontend/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
