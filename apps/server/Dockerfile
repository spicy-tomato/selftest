########################################################
# Base
########################################################
FROM node:22.11.0-alpine3.20 AS base

# Fix CVE-2024-9143
RUN apk add --no-cache openssl=3.3.2-r1

RUN addgroup -g 1001 app_group && \
    adduser -u 1001 -G app_group -s /bin/sh -D app

########################################################
# Install dependencies
########################################################
FROM base AS dependencies

WORKDIR /apps/server

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV production

COPY ./apps/server/package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./apps/server/prisma/ ./

RUN corepack enable
RUN pnpm add -g prisma@6
RUN pnpm --filter=server install --prod

########################################################
# Build
########################################################
FROM base AS build

WORKDIR /apps/server

COPY ./apps/server/ .
COPY tsconfig.base.json /
COPY --from=dependencies /apps/server/node_modules ./node_modules

RUN corepack enable
RUN pnpm build
RUN pnpm prune --prod

########################################################
# Deploy
########################################################  
FROM base AS deploy

WORKDIR /apps

USER app

COPY --from=build /apps/server/dist/ ./dist/
COPY --from=build /apps/server/node_modules ./node_modules

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
