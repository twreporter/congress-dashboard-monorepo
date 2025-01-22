ARG NODE_VERSION=22.13.0

FROM node:${NODE_VERSION} AS build

WORKDIR /build

COPY package.json yarn.lock /build/

RUN yarn install

COPY . /build/

RUN yarn build


FROM node:${NODE_VERSION}

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /build/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=build /build/.next/standalone ./
# COPY --from=build /build/.next/static ./.next/static

CMD ["yarn", "start"]