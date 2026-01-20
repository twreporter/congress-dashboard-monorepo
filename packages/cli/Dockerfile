ARG NODE_VERSION=22.17.1

FROM node:${NODE_VERSION}-slim AS builder

ENV APP_DIR /app

WORKDIR $APP_DIR

COPY package.json yarn.lock tsconfig.json $APP_DIR/
COPY src $APP_DIR/src

RUN yarn install

RUN yarn build

FROM node:${NODE_VERSION}-slim

ENV APP_DIR /app

WORKDIR $APP_DIR

# NOTE: This image build assumes that yarn.lock is present in the build context.
# In our CI, cloudbuild.yaml copies the repo-root yarn.lock into this package
# so that it ends up at /app/yarn.lock in the builder stage. If yarn.lock is
# not provided in the build context, the COPY below will fail and the image
# build will not succeed. Ensure your build setup provides yarn.lock at the
# root of the context before invoking this Dockerfile.
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/lib ./lib

RUN yarn install --production=true

ENV NODE_ENV=production

ENTRYPOINT ["node", "lib/index.js"]
CMD ["feed-algolia"]
