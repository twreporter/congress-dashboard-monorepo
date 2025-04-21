FROM node:18.18.2-slim

## Install system dependencies, `gcsfuse` in particular.
RUN set -e; \
    apt-get update -y && apt-get install -y \
    build-essential \
    curl \
    wget \
    gnupg2 \
    tini \
    openssl \
    lsb-release; \
    gcsFuseRepo=gcsfuse-`lsb_release -c -s`; \
    echo "deb http://packages.cloud.google.com/apt $gcsFuseRepo main" | \
    tee /etc/apt/sources.list.d/gcsfuse.list; \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
    apt-key add -; \
    # apt-get update; \
    # apt-get install -y gcsfuse \
    # TODO: remove wget workaround for gcsfuse due to missing registry & restore with apt-get
    wget https://github.com/GoogleCloudPlatform/gcsfuse/releases/download/v1.2.0/gcsfuse_1.2.0_amd64.deb -O gcsfuse.deb && apt-get install -y ./gcsfuse.deb && rm -f ./gcsfuse.deb \
    && apt-get clean

ENV APP_DIR /app
## Set fallback mount directory
ENV MNT_DIR /app/gcs
ENV HOST 0.0.0.0
ENV PORT 3000

RUN mkdir -p $APP_DIR

WORKDIR $APP_DIR

COPY . $APP_DIR

## Install application dependencies
RUN SKIP_BUILD_DEPS=true yarn install

## Build application bundles
RUN yarn build

RUN yarn cache clean

## Ensure the script is executable
RUN chmod +x run.sh

EXPOSE 3000

## Use tini to manage zombie processes and signal forwarding
## https://github.com/krallin/tini
ENTRYPOINT ["/usr/bin/tini", "--"]

## Pass the startup script as arguments to Tini
CMD [ "/app/run.sh"]