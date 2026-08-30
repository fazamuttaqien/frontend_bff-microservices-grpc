import { request } from '../lib/api'
import type { User } from '../types/api'

export const userApi = {
  me: (token: string) => request<User>('/api/v1/users/me', { token }),
}
