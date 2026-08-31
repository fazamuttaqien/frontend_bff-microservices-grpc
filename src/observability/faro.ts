import { getWebInstrumentations, initializeFaro } from '@grafana/faro-react'

const url = import.meta.env.VITE_FARO_URL
const appName = import.meta.env.VITE_FARO_APP_NAME
const environment = import.meta.env.VITE_APP_ENV

export const faro =
  url && appName
    ? initializeFaro({
        url,
        app: {
          name: appName,
          environment,
        },
        instrumentations: [...getWebInstrumentations()],
      })
    : undefined
