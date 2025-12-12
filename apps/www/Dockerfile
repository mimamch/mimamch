
# ------------------------
# Stage 1: Build
# ------------------------
FROM oven/bun:1 AS build
RUN apt-get update -y && apt-get install -y openssl

ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_STANDALONE=1

WORKDIR /app

COPY . .
RUN bun install
WORKDIR /app/apps/www
RUN bun run build


# ------------------------
# Stage 2: Runtime
# ------------------------
FROM oven/bun:1 AS runtime
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app


# COPY --from=build /app /app
COPY --from=build /app/apps/www/.next/standalone /app
COPY --from=build /app/apps/www/.next/static /app/apps/www/.next/static
COPY --from=build /app/apps/www/public /app/apps/www/public

WORKDIR /app/apps/www

CMD ["bun", "server.js"]
