# Vite VITE_* values are public build-time configuration.
# Never pass credentials or secrets as VITE_* build arguments.
FROM node:24-alpine AS build

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_APP_NAME
ARG VITE_APP_ENV
ARG VITE_APP_VERSION
ARG VITE_BFF_BASE_URL
ARG VITE_FARO_URL
ARG VITE_FARO_APP_NAME
ARG VITE_FARO_APP_NAMESPACE

ENV VITE_APP_NAME=$VITE_APP_NAME \
    VITE_APP_ENV=$VITE_APP_ENV \
    VITE_APP_VERSION=$VITE_APP_VERSION \
    VITE_BFF_BASE_URL=$VITE_BFF_BASE_URL \
    VITE_FARO_URL=$VITE_FARO_URL \
    VITE_FARO_APP_NAME=$VITE_FARO_APP_NAME \
    VITE_FARO_APP_NAMESPACE=$VITE_FARO_APP_NAMESPACE

RUN pnpm build

FROM nginx:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
