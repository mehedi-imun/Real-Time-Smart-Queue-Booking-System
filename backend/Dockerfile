# ---------- STAGE 1: BUILD STAGE ----------
FROM node:23-alpine AS builder

WORKDIR /app

# Optional: install bash for debugging (you can remove this if not needed)
RUN apk add --no-cache bash

# Copy package.json and package-lock.json first (for better cache utilization)
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy all source files (including tsconfig.json, .env files if needed)
COPY . .

# Build the TypeScript code
RUN npm run build

# ---------- STAGE 2: PRODUCTION STAGE ----------
FROM node:23-alpine

WORKDIR /app

# Copy only package.json and package-lock.json for production deps install
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy build output from the builder stage
COPY --from=builder /app/dist ./dist

# (Optional) Copy any static assets or views if your app uses them
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/views ./views

# Expose port your app listens on
EXPOSE 5000

# Use a non-root user for better security (optional but recommended)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Run the server
CMD ["node", "dist/server.js"]
