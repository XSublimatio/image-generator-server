FROM ghcr.io/xsublimatio/image-generator:0.1.1 AS img-generator-builder

## Findings
# Docker image relies on X11 & a display running on the host
#
# Supposedly the host' Xserver claims the GPU, making you unable to assign it to your docker image, thus it's not possible to test it without a server
# https://github.com/NVIDIA/nvidia-docker/issues/938 talks about a 4k display being available by default on a TESLA GPU? (which I don't have locally, and I don't have the time to further investigate this)
# Either way, loading the drivers and configuring the Xserver is a nightmare
#
# Headless opengl rendering isn't possible as processing is re.. requires display for it's inner workings
# As the application uses P3D, it can't make use of the headless mode documented here https://forum.processing.org/two/discussion/10305/building-a-headless-mode.html
# https://forum.processing.org/two/discussion/10305/building-a-headless-mode.html talks about hacking in a headless mode into the processing sketch, in which I wasn't successful.

## Running the container
# Install an Xserver on the host system.
# Give access to the xserver from the host system with `xhost +si:localuser:root`
# Run the container with `docker run --runtime=nvidia -ti --rm -e DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix CONTAINERNAME`

FROM node:16-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
COPY .env.production ./
RUN yarn build

FROM nvidia/opengl:1.2-glvnd-runtime-ubuntu20.04 AS runner
ARG timezone
ENV env_timezone=$timezone

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    TZ=${timezone} \ 
    apt-get install -y \
    software-properties-common \
    npm \
    curl \
    tzdata \
    ffmpeg && \
    apt-get clean
RUN npm install npm@latest -g && \
    npm install n -g && \
    n 16
RUN npm install -g yarn
WORKDIR /usr/app
ARG APP_ENV
COPY --from=builder /app/build ./build
COPY --from=img-generator-builder /root/image-generator/build /usr/app/img-generator
COPY --from=builder /app/prisma .
COPY package.json ./
COPY .env.production ./
RUN yarn --production
RUN npx prisma generate
# USER node
ENV NODE_ENV="production"
CMD ["yarn", "start"]