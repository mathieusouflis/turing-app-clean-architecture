FROM node:22-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root package files for monorepo setup
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy packages (needed for workspace dependencies)
COPY packages ./packages

# Copy backend app
COPY apps/backend ./apps/backend

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Expose backend port
EXPOSE 8080

# Default command (can be overridden in docker-compose)
# Build first, then run dev
CMD sh -c "pnpm --filter backend build && pnpm --filter backend dev"

