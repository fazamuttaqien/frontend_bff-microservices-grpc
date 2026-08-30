import { request } from '../lib/api'
import type { User } from '../types/api'

// The current BFF exposes bearer-token authentication, but login/register routes are not yet available.
// Keep this service boundary ready so UI never talks to microservices directly.
export const authApi = {
  me: (token: string) => request<User>('/api/v1/users/me', { token }),
}
