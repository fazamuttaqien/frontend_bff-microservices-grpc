import {
  createReactRouterV7DataOptions,
  getWebInstrumentations,
  initializeFaro,
  ReactIntegration,
} from '@grafana/faro-react'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'
import { matchRoutes } from 'react-router-dom'

const observabilityEnabled = import.meta.env.VITE_OBSERVABILITY_ENABLED === 'true'
const url = import.meta.env.VITE_FARO_URL
const appName = import.meta.env.VITE_FARO_APP_NAME
const appNamespace = import.meta.env.VITE_FARO_APP_NAMESPACE
const appVersion = import.meta.env.VITE_APP_VERSION
const environment = import.meta.env.VITE_APP_ENV
const bffBaseUrl = import.meta.env.VITE_BFF_BASE_URL

export const faro =
  observabilityEnabled && url && appName
    ? initializeFaro({
        url,
        app: {
          name: appName,
          namespace: appNamespace,
          version: appVersion,
          environment,
        },
        instrumentations: [
          ...getWebInstrumentations(),
          new TracingInstrumentation({
            instrumentationOptions: {
              propagateTraceHeaderCorsUrls: bffBaseUrl ? [bffBaseUrl] : [],
            },
          }),
          new ReactIntegration({
            router: createReactRouterV7DataOptions({
              matchRoutes,
            }),
          }),
        ],
      })
    : undefined
