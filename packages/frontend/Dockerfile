ARG NODE_VERSION=22.13.0

FROM node:${NODE_VERSION}

RUN yarn install

RUN yarn build

ENV NODE_ENV=production

CMD ["yarn", "start"]