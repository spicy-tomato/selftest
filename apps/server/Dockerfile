########################################################
# Base
########################################################
FROM node:22.11.0-alpine3.20 AS base

# Fix CVE-2024-9143
RUN apk add --no-cache openssl=3.3.2-r1

# Fix CVE-2024-21538
RUN npm install -g npm@10.9.1

RUN npm i -g pnpm

########################################################
# Install dependencies
########################################################
FROM base AS dependencies

WORKDIR /apps/server
ENV NODE_ENV production

COPY ./apps/server/package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./apps/server/prisma/ ./
RUN pnpm --filter=server install --prod
RUN npx --yes prisma generate

########################################################
# Build
########################################################
FROM base AS build

WORKDIR /apps/server

COPY ./apps/server/ .
COPY tsconfig.base.json /
COPY --from=dependencies /apps/server/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

########################################################
# Deploy
########################################################  
FROM base AS deploy

WORKDIR /apps
COPY --from=build /apps/server/dist/ ./dist/
COPY --from=build /apps/server/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]
