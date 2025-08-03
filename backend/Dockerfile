# ---------- DEV STAGE ----------
FROM node:23-alpine

WORKDIR /app

# Install optional debug tools
RUN apk add --no-cache bash

# Install global dev tools (optional)
# RUN npm install -g ts-node-dev

# Copy only package.json and lock first
COPY package*.json ./

# Install all dependencies (dev included)
RUN npm install

# Copy rest of the source
COPY . .

# Expose port (adjust if needed)
EXPOSE 5000

# Default dev command (change if needed)
CMD ["npm", "run", "dev"]
