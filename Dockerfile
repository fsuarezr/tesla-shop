# Base image
FROM node:20-alpine as base
WORKDIR /usr/src/app

# Dependency installation for development
FROM base as dev-dep
COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm fetch --frozen-lockfile && pnpm install --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Dependency installation for production
FROM base as prod-dep
COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm install --omit=dev; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --prod --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Build stage
FROM dev-dep as build
COPY . .
# RUN npm run test
RUN if [ -f yarn.lock ]; then yarn build && yarn cache clean; \
    elif [ -f package-lock.json ]; then npm run build && npm cache clean; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build && pnpm store prune; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Production stage
FROM base as prod
EXPOSE 4000
COPY --from=prod-dep /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
