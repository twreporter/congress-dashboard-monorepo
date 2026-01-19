ARG NODE_VERSION=22.17.1

FROM node:${NODE_VERSION}-slim AS builder

ENV APP_DIR /app

WORKDIR $APP_DIR

COPY . $APP_DIR

RUN yarn install

RUN yarn build

FROM node:${NODE_VERSION}-slim

ENV APP_DIR /app

WORKDIR $APP_DIR

# NOTE: cloudbuild.yaml copies repo-root yarn.lock into this package before build.
# This Dockerfile assumes yarn.lock exists in the build context.
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/lib ./lib

RUN yarn install --production=true

ENV NODE_ENV=production

CMD ["node", "lib/index.js", "feed-algolia"]
