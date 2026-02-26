ARG NODE_VERSION=22.17.1

FROM node:${NODE_VERSION} AS build

WORKDIR /build

# NOTE: yarn.lock is not committed here. In CI (cloudbuild.yaml), it is copied
# from the monorepo root into this directory before running `docker build`.
# For local builds, run: cp ../../yarn.lock . before building.
COPY package.json yarn.lock /build/

RUN yarn install

COPY . /build/

RUN yarn build

FROM node:${NODE_VERSION}-alpine AS runner

ENV APP_DIR /app

WORKDIR $APP_DIR

ENV NODE_ENV=production

ENV NODE_OPTIONS="--network-family-autoselection-attempt-timeout=30000"

# Run as non-root user in runtime container
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Include only built files and necessary dependencies, with proper ownership
COPY --from=build --chown=nextjs:nextjs /build/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /build/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
