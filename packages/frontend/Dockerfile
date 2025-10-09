ARG NODE_VERSION=22.17.1

FROM node:${NODE_VERSION} AS build

WORKDIR /build

COPY package.json yarn.lock /build/

RUN yarn install

COPY . /build/

RUN yarn build

FROM node:${NODE_VERSION}-alpine AS runner

ENV APP_DIR /app

WORKDIR $APP_DIR

ENV NODE_ENV=production

ENV NODE_OPTIONS="--network-family-autoselection-attempt-timeout=30000"

# Include only built files and necessary dependencies
COPY --from=build /build/.next/standalone ./
COPY --from=build /build/.next/static ./.next/static

CMD ["node", "server.js"]
