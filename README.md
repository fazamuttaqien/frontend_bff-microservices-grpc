# Frontend — BFF Microservices gRPC

React frontend for the BFF/microservices architecture. The frontend is a Vite application served directly during local development or from an unprivileged Nginx container in production.

## Architecture

### Application flow

```text
Browser
  ↓
React
  ↓
BFF HTTP/JSON
  ↓
gRPC
  ↓
Microservices
```

The browser communicates with the BFF over HTTP/JSON. The BFF is responsible for authentication and translating requests to downstream gRPC services.

### Observability flow

```text
Browser
├── Faro → Grafana Cloud Frontend Observability
│
└── API request → BFF
                  ↓
             OpenTelemetry
                  ↓
             Grafana Alloy
                  ↓
             Grafana Cloud
```

Faro runs in the browser. Grafana Alloy is part of the backend telemetry pipeline and is not required in the frontend container.

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
- Grafana Faro

The package manifest is the source of truth for dependencies and scripts. The project uses pnpm (`pnpm-lock.yaml`).

## Prerequisites

- Node.js compatible with the repository's current toolchain
- pnpm
- Docker and Docker Compose for the container workflow

## Local development

Install dependencies:

```bash
pnpm install
```

Start the Vite development server:

```bash
pnpm dev
```

The Vite development server prints the local URL in the terminal. Configure the BFF and Faro endpoints before starting the application.

### Environment configuration

Create a local `.env` from `.env.example` and set the values appropriate for your environment. Do not commit private credentials.

The frontend currently defines these public configuration values:

```dotenv
VITE_APP_NAME=frontend-bff-microservices-grpc
VITE_APP_ENVIRONMENT=development
VITE_APP_VERSION=0.1.0
VITE_BFF_BASE_URL=http://localhost:8080
VITE_FARO_URL=https://your-faro-collector-url
VITE_FARO_APP_NAME=frontend-bff-microservices-grpc
VITE_FARO_APP_NAMESPACE=bff-microservices-grpc
```

`FRONTEND_PORT` is also available for the Docker host port:

```dotenv
FRONTEND_PORT=8080
```

See `.env.example` for the repository's current example values. url.env.examplehttps://github.com/fazamuttaqien/frontend_bff-microservices-grpc/blob/main/.env.example

### Vite environment variable security

Every `VITE_*` value is client-visible because Vite embeds it into the browser bundle. Only public configuration belongs in these variables.

Allowed examples:

- public BFF URL
- public Faro collector URL
- frontend application name
- environment/release metadata

Never put the following in `VITE_*` variables:

- Grafana Cloud API keys
- Grafana Cloud passwords
- Alloy credentials
- JWT secrets
- private credentials

There are no production credential values documented in this repository.

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

Docker Compose provides a single `frontend` service. It does not run Grafana Alloy.

Build the image:

```bash
docker compose build
```

Start the frontend:

```bash
docker compose up
```

Stop and remove the Compose container/network:

```bash
docker compose down
```

### Frontend port

The container listens on port `8080`. The default host mapping is:

```text
localhost:8080 → frontend:8080
```

Change the host port with `FRONTEND_PORT`:

```bash
FRONTEND_PORT=3000 docker compose up --build
```

The host port is a Docker/Compose setting and is not embedded into the Vite bundle.

### Docker environment behavior

The Compose file passes public Vite configuration to the build stage. These values become part of the client bundle. Do not pass backend or Grafana Cloud private credentials as build arguments or `VITE_*` variables.

The browser must use a browser-accessible BFF and Faro URL. Docker-only hostnames such as `alloy:4317` or `alloy:4318` must not be configured as browser collector endpoints.

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

Do not add token persistence to Redux, localStorage, sessionStorage, URL parameters, or other client-visible storage.

## Observability

### Grafana Faro

Grafana Faro runs in the browser and provides frontend observability for:

- Real User Monitoring (RUM)
- browser errors
- Web Vitals
- route/page telemetry
- web performance telemetry
- browser HTTP tracing

Faro is initialized by the existing frontend observability integration. React Router instrumentation is also connected to Faro.

### Trace correlation

Browser HTTP tracing uses W3C Trace Context. The frontend does not manually create a `traceparent` value.

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

The BFF also returns `Server-Timing` containing the server trace context required to correlate the browser request with backend tracing in Grafana Frontend Observability.

Existing `X-Request-ID` and `X-Trace-ID` response headers remain available for request correlation.

Do not add JWTs, passwords, cookies, Authorization headers, secrets, sensitive request bodies, or unnecessary PII to telemetry.

### Backend telemetry

Backend services use OpenTelemetry and export telemetry through Grafana Alloy:

```text
BFF / services
      ↓
     OTLP
      ↓
Grafana Alloy
      ↓
Grafana Cloud
```

Alloy belongs to the backend/observability deployment. It is not installed in the React/Nginx frontend container.

## Grafana Cloud setup

To enable frontend observability:

1. Create a **Frontend Observability application** in Grafana Cloud.
2. Follow Grafana's Web SDK Configuration for the application.
3. Obtain the public Faro collector URL provided for the frontend application.
4. Set that value as `VITE_FARO_URL` in the local environment used to build the frontend.
5. Set `VITE_FARO_APP_NAME` and the other public application metadata as appropriate.
6. Ensure the BFF CORS configuration allows the frontend origin and exposes the required tracing response headers.

Only public browser configuration belongs in the frontend. Do not put Grafana Cloud private credentials, API keys, passwords, or Alloy credentials in this repository or in `VITE_*` variables.

For backend observability, configure Grafana Alloy and Grafana Cloud credentials on the backend/observability side, not in the frontend.

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

The current `src` structure is:

```text
src/
├── app/
│   ├── layouts/
│   ├── router-pages.tsx
│   ├── router.tsx
│   ├── store.ts
│   └── ...
├── assets/
├── components/
│   ├── app/
│   └── ui/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── orders/
│   ├── products/
│   └── profile/
├── hooks/
├── lib/
├── observability/
├── services/
├── test/
├── types/
├── index.css
└── main.tsx
```

Top-level project files relevant to development and deployment include:

```text
Dockerfile
compose.yaml
nginx.conf
.env.example
package.json
pnpm-lock.yaml
vite.config.*
eslint.config.js
```

## Troubleshooting

### Faro telemetry does not appear

Check:

1. `VITE_FARO_URL` is set to the public collector URL from the Grafana Cloud Frontend Observability application.
2. The value is present at build time; changing a `.env` value requires restarting Vite or rebuilding the Docker image.
3. The browser can reach the collector URL.
4. Browser developer tools show no CORS or network error for Faro requests.
5. The Faro application name/environment configuration is correct.

Do not use a Docker-only hostname such as `alloy:4318` as the browser Faro endpoint.

### CORS errors

Check the BFF CORS configuration:

- frontend origin must be explicitly allowed
- credentials must be enabled when using the HttpOnly cookie flow
- `traceparent` and `tracestate` must be accepted when sent by browser tracing
- `Server-Timing`, `X-Request-ID`, and `X-Trace-ID` must be exposed to the browser when required
- do not use a wildcard origin together with credentials

The browser's exact origin must match the backend's allowed-origin configuration.

### `traceparent` is not visible on the request

Check:

1. Faro Web Tracing is initialized.
2. The request is going to the configured `VITE_BFF_BASE_URL`.
3. The BFF origin is included in the tracing propagation configuration.
4. The request is not being sent to a different hostname than the configured BFF origin.
5. Browser DevTools → Network → request headers is being inspected.

Do not manually generate `traceparent`; Faro/OpenTelemetry owns trace-context generation and propagation.

### `Server-Timing` is not visible

Check the BFF response in browser DevTools → Network → response headers.

The backend must:

- create/continue an OpenTelemetry HTTP server span
- return the required `Server-Timing` trace context
- expose `Server-Timing` through CORS

Also verify that the response is actually coming from the BFF rather than another proxy that removes the header.

### BFF returns `401 Unauthorized`

Check:

- the frontend is using the correct `VITE_BFF_BASE_URL`
- Axios has `withCredentials` enabled
- the browser is allowed to send the authentication cookie to the BFF according to the cookie's domain, path, Secure, and SameSite settings
- the BFF authentication session is valid
- the frontend is not attempting to send a JWT from localStorage or sessionStorage

Do not fix a `401` by adding JWT storage to the frontend.

### Docker route returns `404`

Check that the container is using the repository's `nginx.conf` and that it contains:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Rebuild after changing Nginx configuration:

```bash
docker compose build --no-cache
docker compose up
```

Then test direct navigation to `/`, `/login`, `/dashboard`, `/products`, and `/orders`.

### Incorrect BFF URL

If API calls target the wrong host:

1. Check `VITE_BFF_BASE_URL`.
2. Remember that Vite embeds `VITE_*` values during the build.
3. Restart `pnpm dev` after changing local environment variables.
4. Rebuild the Docker image after changing values used by Compose.
5. Verify the browser's Network tab for the actual request URL.

For Docker, the BFF URL must be reachable **from the browser**, not merely from the Docker network. Do not use an internal Compose service hostname unless that hostname is also resolvable and reachable by the browser.

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
docker compose build
docker compose up
```

Stop the stack with:

```bash
docker compose down
```

### Browser smoke test

With the application running, verify:

- `/`
- `/login`
- `/dashboard`
- `/products`
- `/orders`

Test both normal in-app navigation and direct navigation/refresh on the routes that require authentication.
