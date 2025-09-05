# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# 1) Prune the monorepo down to just this app + its deps
FROM base AS prune
# Copy the entire repo into the build context (filtered by .dockerignore)
COPY . .
# Install turbo locally without polluting later stages
RUN npm i -g turbo
# Replace website with your app name
RUN turbo prune --scope=website --docker

# 2) Install deps using the pruned package graph (max layer cache)
FROM base AS deps
WORKDIR /app/out
COPY --from=prune /app/out/json/ ./
# If you use npm:
COPY --from=prune /app/out/package-lock.json ./package-lock.json
RUN --mount=type=cache,target=/root/.npm npm ci
# (pnpm variant: install pnpm and use --mount cache for /root/.local/share/pnpm)

# 3) Build the app
FROM base AS build
WORKDIR /app/out
# Bring in the full (pruned) source and node_modules
COPY --from=prune /app/out/full/ ./
COPY --from=deps  /app/out/node_modules ./node_modules
# Ensure Next.js standalone output
# next.config.js should contain: module.exports = { output: 'standalone' }
RUN npm run build -w apps/website

# 4) Runtime: copy only what’s needed to run
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy standalone server and static output
COPY --from=build /app/out/apps/website/.next/standalone ./
COPY --from=build /app/out/apps/website/.next/static ./.next/static
COPY --from=build /app/out/apps/website/public ./public
# Run as non-root for security
RUN adduser -D nextjs
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]