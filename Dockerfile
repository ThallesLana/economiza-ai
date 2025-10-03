# BUILD
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

# DEPLOY
FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/typeorm.config.ts ./

CMD ["sh", "-c", "npm run migration:run && node dist/src/main.js"]
