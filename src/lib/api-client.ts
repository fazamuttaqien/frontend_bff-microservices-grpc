import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios'

const baseURL = (
  import.meta.env.VITE_BFF_BASE_URL as string | undefined
)?.replace(/\/$/, '')

if (!baseURL) throw new Error('VITE_BFF_BASE_URL is required')

export type ApiErrorCode =
  | 'network_error'
  | 'unauthenticated'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'validation_error'
  | 'server_error'
  | 'unknown_error'

export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  readonly details?: unknown

  constructor(
    status: number,
    code: ApiErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
    this.name = 'ApiError'
  }
}

const messages: Record<ApiErrorCode, string> = {
  network_error:
    'Unable to reach the server. Check your connection and try again.',
  unauthenticated: 'Please sign in to continue.',
  forbidden: 'You do not have permission to perform this action.',
  not_found: 'The requested information could not be found.',
  conflict:
    'This action could not be completed because the information has changed.',
  validation_error: 'Please check the information and try again.',
  server_error:
    'The server could not complete your request. Please try again later.',
  unknown_error: 'Something went wrong. Please try again.',
}

function normalizeStatus(status?: number): ApiErrorCode {
  if (!status) return 'network_error'
  if (status === 401) return 'unauthenticated'
  if (status === 403) return 'forbidden'
  if (status === 404) return 'not_found'
  if (status === 409) return 'conflict'
  if (status === 400 || status === 422) return 'validation_error'
  if (status >= 500) return 'server_error'
  return 'unknown_error'
}

function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<unknown>
    const status = axiosError.response?.status ?? 0
    const code = normalizeStatus(status)
    return new ApiError(status, code, messages[code])
  }

  return new ApiError(0, 'unknown_error', messages.unknown_error)
}

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
)

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config)
  return response.data
}
