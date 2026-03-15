# ─────────────────────────────────────────────────────────
# Stage 1: Base image
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# ─────────────────────────────────────────────────────────
# Stage 2: Production image
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production dependencies from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose API port
EXPOSE 5001

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5001/api/health || exit 1

# Start application
CMD ["node", "server.js"]
