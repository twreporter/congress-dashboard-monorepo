ARG NODE_VERSION=22.13.0

FROM node:${NODE_VERSION}

ENV APP_DIR /app

WORKDIR $APP_DIR

COPY . $APP_DIR

RUN yarn install

RUN yarn build

ENV NODE_ENV=production

CMD ["yarn", "start"]