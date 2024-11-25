########################################################
# Base
########################################################
FROM node:22.11.0-alpine3.20 AS base

RUN apk add --no-cache openssl=3.3.2-r1
RUN npm i -g pnpm

########################################################
# Install dependencies
########################################################
FROM base AS dependencies

WORKDIR /app
COPY ./apps/server/package.json pnpm-lock.yaml ./
RUN pnpm install --prod

########################################################
# Build
########################################################
FROM base AS build

WORKDIR /app
COPY ./apps/server/ .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

########################################################
# Deploy
########################################################  
FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]
