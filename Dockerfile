FROM node:24-alpine AS build

WORKDIR /app
RUN corepack enable

# Copy pnpm configuration first
COPY .pnpmrc package.json pnpm-lock.yaml ./

# Install dependencies with script approval disabled in CI environment
ENV CI=true
RUN pnpm install --frozen-lockfile --ignore-scripts || pnpm install --frozen-lockfile

COPY . .

ARG VITE_APP_NAME
ARG VITE_APP_ENVIRONMENT
ARG VITE_APP_VERSION
ARG VITE_BFF_BASE_URL
ARG VITE_OBSERVABILITY_ENABLED=false
ARG VITE_FARO_URL
ARG VITE_FARO_APP_NAME
ARG VITE_FARO_APP_NAMESPACE

ENV VITE_APP_NAME=$VITE_APP_NAME \
    VITE_APP_ENV=$VITE_APP_ENVIRONMENT \
    VITE_APP_VERSION=$VITE_APP_VERSION \
    VITE_BFF_BASE_URL=$VITE_BFF_BASE_URL \
    VITE_OBSERVABILITY_ENABLED=$VITE_OBSERVABILITY_ENABLED \
    VITE_FARO_URL=$VITE_FARO_URL \
    VITE_FARO_APP_NAME=$VITE_FARO_APP_NAME \
    VITE_FARO_APP_NAMESPACE=$VITE_FARO_APP_NAMESPACE

RUN pnpm build

FROM nginxinc/nginx-unprivileged:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
