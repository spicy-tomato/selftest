########################################################
# Base
########################################################
FROM node:22.11.0-alpine3.20 AS base

# Fix CVE-2024-9143
RUN apk add --no-cache openssl=3.3.2-r1

# Fix CVE-2024-21538
RUN npm install -g npm@10.9.1

RUN npm i -g pnpm@9.14.4

########################################################
# Install dependencies
########################################################
FROM base AS dependencies

RUN apk add --no-cache libc6-compat
WORKDIR /apps/web

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV production

COPY ./apps/web/package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable
RUN pnpm --filter=web install --prod

########################################################
# Build
########################################################
FROM base AS build
WORKDIR /apps/web

COPY ./apps/web/ .
COPY tsconfig.base.json /
COPY --from=dependencies /apps/web/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable
RUN pnpm build
RUN pnpm prune --prod

########################################################
# Deploy
########################################################
FROM base AS deploy
WORKDIR /apps/web

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /apps/web/public ./public
COPY --from=build --chown=nextjs:nodejs /apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
