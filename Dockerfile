# syntax=docker/dockerfile:1

# ==============================================================================
# Production Dockerfile for a Next.js 16 app using `output: "standalone"`.
# Build the image in CI, then run it on any container host (Cloud Run, ECS,
# Kubernetes, Fly.io, a bare VM, etc.). No Vercel-specific features are used.
# ==============================================================================

# Pinned base so every stage shares the same runtime. node:24-alpine is the
# current Active LTS; Alpine keeps the layers tiny.
ARG NODE_IMAGE=node:24-alpine

# ------------------------------------------------------------------------------
# Stage 1 — deps: install dependencies only.
# Isolated so it is cached and only re-runs when the lockfile changes.
# `npm ci` installs exactly what package-lock.json pins (reproducible builds).
# ------------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS deps
# libc6-compat lets glibc-linked native addons run on Alpine's musl libc.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only the manifests first to maximize Docker layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# ------------------------------------------------------------------------------
# Stage 2 — builder: compile the production build.
# Reuses the installed node_modules from `deps`, then runs `next build`, which
# (with output: "standalone") emits .next/standalone, .next/static and the
# static assets.
# ------------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the client bundle at BUILD time, not read
# at runtime — so they must be provided here as build args. Passing this ensures
# Open Graph tags, sitemap.xml and robots.txt emit correct absolute URLs.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Quieter, network-free, reproducible CI builds.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ------------------------------------------------------------------------------
# Stage 3 — runner: minimal final image.
# Starts from a clean base and copies ONLY the standalone server, the static
# chunks and the public assets — no source, no full node_modules, no build tools.
# ------------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# server.js reads PORT/HOSTNAME to decide where to listen; 0.0.0.0 makes it
# reachable from outside the container.
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Run as an unprivileged user instead of root.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# The standalone folder already contains a minimal server.js + traced node_modules.
# static/ and public/ are NOT bundled into standalone by Next, so copy them in
# alongside it (server.js serves them automatically once they are in place).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3001

# Hit the home page with Node's built-in fetch (no curl/wget dependency needed).
# start-period gives the server time to boot before failures count.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
