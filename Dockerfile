# BUILD
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build

# DEPLOY
FROM node:22-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S economiza_ai_user -u 1001

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --frozen-lockfile && npm cache clean --force

COPY --from=builder --chown=economiza_ai_user:nodejs /app/dist ./dist
COPY --from=builder /app/typeorm.config.ts ./

CMD ["sh", "-c", "npm run migration:run && node dist/src/main.js"]
