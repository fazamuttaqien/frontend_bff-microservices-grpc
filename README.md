# Frontend — BFF Microservices gRPC

React 19 + Vite + TypeScript frontend for the BFF/microservices architecture.

## Architecture

```text
Browser
  ├── React frontend (Nginx container)
  │     └── BFF HTTP API
  │
  └── Faro Web Tracing
        └── Grafana Cloud Frontend Observability

BFF / Microservices
  └── OTLP → Grafana Alloy → Grafana Cloud
```

Grafana Alloy is a backend observability component. It is not part of the frontend container or browser path.

## Environment

Vite `VITE_*` variables are public and are embedded into the browser bundle. Use only values that are safe to expose to browsers.

Required public configuration:

```dotenv
VITE_BFF_BASE_URL=http://localhost:8080
VITE_FARO_URL=https://your-faro-collector-url
VITE_FARO_APP_NAME=frontend-bff-microservices-grpc
VITE_APP_ENVIRONMENT=development
```

`VITE_APP_VERSION` and `VITE_FARO_APP_NAMESPACE` may also be supplied as public release metadata.

Never put Grafana Cloud API keys, passwords, Alloy credentials, JWT secrets, or other private credentials in `VITE_*` variables.

## Local development

```bash
pnpm install
pnpm dev
```

## Production Docker

The production image is a multi-stage build:

1. Node 24 Alpine builds the Vite application.
2. An unprivileged Nginx Alpine image serves the generated static assets.

Build and run with Docker Compose:

```bash
docker compose config
docker compose build
docker compose up
```

The default browser endpoint is:

```text
http://localhost:8080
```

Change the host port with `FRONTEND_PORT`:

```bash
FRONTEND_PORT=3000 docker compose up --build
```

Compose passes the public Vite configuration as build arguments. These values become part of the browser bundle by design.

## React Router / Nginx

Nginx uses SPA fallback routing:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Therefore direct navigation to application routes such as `/login`, `/dashboard`, `/products`, and `/orders` is served by `index.html` instead of returning an Nginx 404.

## Faro and trace correlation

Faro is initialized in the React application and uses Web Tracing for browser HTTP instrumentation. The browser can propagate W3C trace context to the BFF when `VITE_BFF_BASE_URL` is configured.

The BFF returns the correlation information through `Server-Timing`; the backend tracing pipeline continues through gRPC and exports OTLP through Grafana Alloy.

```text
Browser
  ↓ traceparent
BFF HTTP server span
  ↓ W3C context
BFF gRPC client span
  ↓ W3C context
Microservice gRPC server span
```

Do not create `traceparent` manually in the frontend.

## Docker networking

The browser cannot use Docker-only hostnames such as `alloy:4317` or `alloy:4318`. Faro must use a browser-accessible collector endpoint. Backend OTLP endpoints remain inside the backend/observability network.

## Validation

Run the application checks locally:

```bash
npm run lint
npm run test
npm run build
```

For Docker:

```bash
docker compose config
docker compose build
docker compose up
```

Then smoke-test `/`, `/login`, `/dashboard`, `/products`, and `/orders`, including direct navigation to each route.
