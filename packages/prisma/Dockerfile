FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies required for Prisma
RUN apk add --no-cache openssl3

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npm run generate

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --production

# Copy built files and Prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create a non-root user
RUN addgroup -S prisma && \
    adduser -S prisma -G prisma

USER prisma

# Set environment variables
ENV NODE_ENV=production

# Command to run migrations
CMD ["npm", "run", "migrate:deploy"]
