# Stage 1: Build stage
FROM node:23-alpine AS builder

WORKDIR /app

# Install bash (optional)
RUN apk add --no-cache bash

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build


# Stage 2: Production image
FROM node:23-alpine

WORKDIR /app

# Only copy package.json and package-lock.json to install production deps
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built files and necessary folders from builder stage
COPY --from=builder /app/dist ./dist

# If you have any static files needed at runtime, copy them too
# COPY --from=builder /app/public ./public

# Expose your backend port
EXPOSE 5000

# Start the app
CMD ["node", "./dist/server.js"]
