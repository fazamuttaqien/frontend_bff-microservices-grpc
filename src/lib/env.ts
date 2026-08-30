export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'frontend-bff-microservices-grpc',
  appEnv: import.meta.env.VITE_APP_ENV ?? 'development',
} as const
