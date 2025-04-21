# --- Build Stage ---
FROM node:18.18.2-slim AS builder

# Install OS dependencies needed for build (if any, like build-essential for native modules)
RUN apt-get update -y && apt-get install -y --no-install-recommends build-essential python3 && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV APP_DIR /app
WORKDIR $APP_DIR

# Copy dependency manifests
# Copy workspace root manifests first if they exist and are needed
# COPY ../../package.json ../../yarn.lock ./
COPY package.json yarn.lock ./

# Install ALL dependencies (including devDependencies like tsup, typescript, prisma)
# Using --frozen-lockfile is recommended in CI/CD
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the KeystoneJS application
# This typically generates the .keystone directory and Prisma client
RUN yarn build

# Optional: Prune devDependencies after build to potentially reduce node_modules size before copying
# RUN yarn install --production --frozen-lockfile

# --- Production Stage ---
FROM node:18.18.2-slim

## Install runtime system dependencies, `gcsfuse` in particular.
RUN set -e; \
    apt-get update -y && apt-get install -y --no-install-recommends \
    # build-essential is likely not needed in runtime stage unless native modules are recompiled
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
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV APP_DIR /app
## Set fallback mount directory
ENV MNT_DIR /app/gcs
ENV HOST 0.0.0.0
ENV PORT 3000

RUN mkdir -p $APP_DIR

WORKDIR $APP_DIR

# Copy necessary files from the builder stage
COPY --from=builder $APP_DIR/package.json $APP_DIR/yarn.lock ./
COPY --from=builder $APP_DIR/node_modules ./node_modules
COPY --from=builder $APP_DIR/.keystone ./.keystone
COPY --from=builder $APP_DIR/schema.prisma ./schema.prisma
COPY --from=builder $APP_DIR/run.sh ./run.sh

# If you pruned devDependencies in the builder stage, you might not need this.
# If you didn't prune, running this ensures only prod deps are present,
# but copying pre-built node_modules is usually faster and safer with Prisma.
# RUN yarn install --production --frozen-lockfile

# Clean cache (optional, might save a little space)
RUN yarn cache clean

## Ensure the script is executable
RUN chmod +x run.sh

EXPOSE 3000

## Use tini to manage zombie processes and signal forwarding
## https://github.com/krallin/tini
ENTRYPOINT ["/usr/bin/tini", "--"]

## Pass the startup script as arguments to Tini
CMD [ "/app/run.sh"]