ARG NODE_VERSION=22.17.1

FROM node:${NODE_VERSION}

ENV APP_DIR /app

WORKDIR $APP_DIR

COPY . $APP_DIR

RUN yarn install

RUN yarn build

ENV NODE_ENV=production

ENV NODE_OPTIONS="--network-family-autoselection-attempt-timeout=30000"

CMD ["yarn", "start"]