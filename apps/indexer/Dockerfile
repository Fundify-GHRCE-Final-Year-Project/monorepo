# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS prune
COPY . .
RUN npm i -g turbo
RUN turbo prune --scope=@fundify/indexer --docker

FROM base AS deps
WORKDIR /app/out
COPY --from=prune /app/out/json/ ./
COPY --from=prune /app/out/package-lock.json ./package-lock.json
RUN --mount=type=cache,target=/root/.npm npm ci

FROM base AS build
WORKDIR /app/out
COPY --from=prune /app/out/full/ ./
COPY --from=deps  /app/out/node_modules ./node_modules
# Compile TS, etc. Use workspace or turbo to scope:
RUN npm run build -w apps/indexer
# e.g. emits apps/indexer/dist

FROM node:20-alpine AS runner
WORKDIR /app
# Copy only the built service + any runtime files it needs
COPY --from=build /app/out/apps/indexer/dist ./dist
# If the app reads runtime env vars, no need to bundle .env; pass via Compose
USER node
CMD ["npm", "run", "start"]
