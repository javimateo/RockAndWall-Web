# ---- deps: install dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: build static site ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- server: serve static files ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install a lightweight HTTP server
RUN npm install -g serve

# Copy built dist folder from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
