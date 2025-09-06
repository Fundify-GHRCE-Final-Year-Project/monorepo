FROM node:18-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune website --docker

FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./
RUN npm install

# Copy source code
COPY --from=builder /app/out/full/ .

# Install turbo locally for this stage
RUN npm install turbo

# Build with turbo
RUN npx turbo run build --filter=website...

FROM base AS runner
WORKDIR /app

# Copy only necessary files
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/website/.next ./.next
COPY --from=installer /app/apps/website/package.json .
COPY --from=installer /app/packages/contract/dist ./packages/contract/dist
COPY --from=installer /app/packages/contract/package.json ./packages/contract/package.json
COPY --from=installer /app/packages/database/dist ./packages/database/dist
COPY --from=installer /app/packages/database/package.json ./packages/database/package.json
COPY --from=installer /app/packages/types/dist ./packages/types/dist
COPY --from=installer /app/packages/types/package.json ./packages/types/package.json

# Set NODE_PATH to help with module resolution
ENV NODE_PATH=/app/node_modules

# Run npm run start to run next start
CMD ["npm", "run", "start"]
