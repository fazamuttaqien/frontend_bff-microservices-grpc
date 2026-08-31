import {
  createReactRouterV7DataOptions,
  getWebInstrumentations,
  initializeFaro,
  ReactIntegration,
} from '@grafana/faro-react'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'
import { matchRoutes } from 'react-router-dom'

const url = import.meta.env.VITE_FARO_URL
const appName = import.meta.env.VITE_FARO_APP_NAME
const environment = import.meta.env.VITE_APP_ENV
const bffBaseUrl = import.meta.env.VITE_BFF_BASE_URL

export const faro =
  url && appName
    ? initializeFaro({
        url,
        app: {
          name: appName,
          environment,
        },
        instrumentations: [
          ...getWebInstrumentations(),
          new TracingInstrumentation({
            propagateTraceHeaderCorsUrls: bffBaseUrl ? [bffBaseUrl] : [],
          }),
          new ReactIntegration({
            router: createReactRouterV7DataOptions({
              matchRoutes,
            }),
          }),
        ],
      })
    : undefined
