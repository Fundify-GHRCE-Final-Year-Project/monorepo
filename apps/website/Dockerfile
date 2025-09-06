# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# 1) Prune the monorepo down to just this app + its deps
FROM base AS prune
# Copy the entire repo into the build context (filtered by .dockerignore)
COPY . .
RUN npm i -g turbo
RUN turbo prune --scope=website --docker

# 2) Install deps using the pruned package graph
FROM base AS deps
WORKDIR /app/out
COPY --from=prune /app/out/json/ ./
COPY --from=prune /app/out/package-lock.json ./package-lock.json
RUN --mount=type=cache,target=/root/.npm npm ci

# 3) Build shared packages first, then website
FROM base AS build
WORKDIR /app/out
COPY --from=prune /app/out/full/ ./
COPY --from=deps  /app/out/node_modules ./node_modules

# Build shared packages used by website
RUN npm run build -w packages/contract \
    && npm run build -w packages/database \
    && npm run build -w packages/types

# Now build the website (Next.js standalone mode expected)
RUN npm run build -w apps/website

# 4) Runtime: copy only what’s needed to run
FROM node:20-alpine AS runner
WORKDIR /app

# Copy website build output
COPY --from=build /app/out/apps/website/.next ./.next
COPY --from=build /app/out/apps/website/package.json ./package.json

# Copy only the built shared packages (not the entire source)
COPY --from=build /app/out/node_modules ./node_modules

# Run as non-root
RUN adduser -D nextjs
USER nextjs

EXPOSE 3000
CMD ["npm", "run", "start",]
