# Frontend — BFF Microservices gRPC

React frontend for the BFF/microservices architecture. The frontend is a Vite application served directly during local development or from an unprivileged Nginx container in production.

## Architecture

### Default application flow — observability OFF

Frontend observability is **disabled by default**. The normal application flow is:

```text
Browser
  ↓
React
  ↓
Axios
  ↓
BFF
  ↓
Microservices
```

No Grafana Faro, Alloy, Grafana Cloud, or telemetry service is required for the default application mode.

### Future observability flow

Faro remains available as an optional capability. When observability is enabled, the intended flow is:

```text
Browser
├── Faro
│
└── Axios
    ↓ traceparent
    BFF
    ↓
    gRPC
    ↓
    Microservices
```

Faro runs in the browser. Backend telemetry infrastructure is separate from the frontend container.

## Frontend stack

The current frontend uses:

- React 19
- TypeScript
- Vite
- React Router 7
- Redux Toolkit
- Axios
- Tailwind CSS 4
- shadcn/ui
- Grafana Faro (optional)

The package manifest is the source of truth for dependencies and scripts. The project uses pnpm (`pnpm-lock.yaml`).

## Prerequisites

- Node.js compatible with the repository's current toolchain
- pnpm
- Docker and Docker Compose for the container workflow

## Default mode — observability OFF

The frontend runs without Grafana Faro by default.

Set:

```dotenv
VITE_OBSERVABILITY_ENABLED=false
```

With this setting:

- Faro is not initialized.
- Browser Faro telemetry is not sent.
- No telemetry request is made to Grafana.
- API communication and authentication continue normally.
- React Router, Redux Toolkit, Axios, Tailwind CSS, and shadcn/ui continue to work normally.

### Local development

Install dependencies:

```bash
pnpm install
```

Start the Vite development server:

```bash
pnpm dev
```

### Docker

The default Docker Compose stack also runs without observability:

```bash
docker compose up --build
```

Stop the stack with:

```bash
docker compose down
```

No Alloy, Grafana Cloud, Grafana, Tempo, Loki, Mimir, or telemetry service is required by the frontend Compose stack.

## Observability mode — optional

Grafana Faro remains available and can be enabled again without changing the frontend architecture.

Set:

```dotenv
VITE_OBSERVABILITY_ENABLED=true
```

When enabled, the existing Faro configuration and tracing implementation are used. No second telemetry system is introduced.

The existing public Faro configuration consists of:

```dotenv
VITE_FARO_URL=https://your-faro-collector-url
VITE_FARO_APP_NAME=frontend-bff-microservices-grpc
VITE_FARO_APP_NAMESPACE=bff-microservices-grpc
```

These values are only used when `VITE_OBSERVABILITY_ENABLED=true`.

`VITE_FARO_URL` is the browser-accessible Faro collector URL. `VITE_FARO_APP_NAME` identifies the frontend application, while `VITE_FARO_APP_NAMESPACE` identifies its application namespace.

Do not put Grafana Cloud credentials or other private credentials in these variables.

## Environment configuration

For normal local development, create a local `.env` from `.env.example` and keep observability disabled unless it is explicitly needed.

The default setting is:

```dotenv
VITE_OBSERVABILITY_ENABLED=false
```

Faro variables remain in `.env.example` so that the optional observability mode can be enabled later. They are not required for the default mode.

See `.env.example` for the repository's current example values. url.env.examplehttps://github.com/fazamuttaqien/frontend_bff-microservices-grpc/blob/main/.env.example

## Vite environment variable security

Every `VITE_*` value is client-visible because Vite embeds it into the browser bundle. `VITE_*` variables must therefore contain public configuration only.

Examples of appropriate public configuration include:

- public BFF URL
- public Faro collector URL
- frontend application name
- environment/release metadata

Never put secrets or private credentials in `VITE_*` variables. In particular, do not put Grafana Cloud credentials, API keys, passwords, Alloy credentials, JWT secrets, or other private credentials into Vite environment variables.

## Docker

The production container uses a multi-stage Docker build:

```text
Node build stage
  ↓
Vite production build
  ↓
unprivileged Nginx runtime
  ↓
static React application
```

Docker Compose provides a single `frontend` service. It does not run Grafana Alloy or any other observability service.

Build and start the default frontend:

```bash
docker compose up --build
```

Stop and remove the Compose container/network:

```bash
docker compose down
```

The default host port is configured by `FRONTEND_PORT` in the Compose environment.

The Nginx runtime uses SPA fallback so direct navigation to React Router paths is served by `index.html`.

## Authentication

The frontend uses the BFF authentication architecture:

```text
Browser
  ↓
HttpOnly cookie
  ↓
BFF
  ↓
JWT
  ↓
backend services
```

The browser does not handle the JWT.

Authentication rules:

- JWT is not stored in the frontend application.
- JWT is not stored in `localStorage`.
- JWT is not stored in `sessionStorage`.
- Authentication uses the HttpOnly cookie provided by the backend/BFF architecture.
- Axios requests use `withCredentials` so browser cookies can be sent to the BFF.
- The frontend must not read or expose the HttpOnly cookie to JavaScript.

Disabling observability does not change authentication or Axios API behavior.

## Observability implementation

### Grafana Faro

Faro is an optional browser observability integration. When enabled it can provide:

- Real User Monitoring (RUM)
- browser errors
- Web Vitals
- route/page telemetry
- web performance telemetry
- browser HTTP tracing

React Router instrumentation and web tracing remain part of the existing implementation and are only initialized when observability is enabled.

### Trace correlation

When observability is enabled, browser HTTP tracing uses W3C Trace Context. The frontend does not manually create a `traceparent` value.

The intended correlation chain is:

```text
Browser
  ↓ traceparent
BFF HTTP server span
  ↓ W3C context propagation
gRPC span
  ↓ W3C context propagation
Microservice span
```

When observability is disabled, the Faro tracing instrumentation is not initialized and the browser does not add Faro-generated tracing telemetry to API requests.

Do not add JWTs, passwords, cookies, Authorization headers, secrets, sensitive request bodies, or unnecessary PII to telemetry.

## Routing

The application uses React Router 7. The current routes include:

```text
/
/login
/register
/dashboard
/products
/products/:id
/orders
/orders/new
/orders/:id
/profile
```

The production Nginx configuration uses SPA fallback:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

This allows direct browser navigation to React routes without an Nginx 404.

## Project structure

The current `src` structure includes:

```text
src/
├── app/
├── assets/
├── components/
├── features/
├── hooks/
├── lib/
├── observability/
├── services/
├── test/
├── types/
├── index.css
└── main.tsx
```

The `src/observability/` implementation and Faro dependency are intentionally retained even though observability is disabled by default.

## Validation

### Application checks

```bash
pnpm lint
pnpm test
pnpm build
```

### Docker checks

```bash
docker compose config
docker compose up --build
docker compose down
```

### Browser smoke test

With the default application running, verify direct navigation and normal in-app navigation for:

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/products`
- `/orders`
- `/profile`

The default mode must work without Grafana Faro or any backend observability service.