import { apiRequest } from '@/lib/api-client'
import type { LoginInput, RegisterInput, User } from '@/types/api'

export interface LoginResponse {
  expires_at: number
  user: User
}

export const authApi = {
  register: (input: RegisterInput) =>
    apiRequest<User>({
      url: '/api/v1/auth/register',
      method: 'POST',
      data: input,
    }),

  login: (input: LoginInput) =>
    apiRequest<LoginResponse>({
      url: '/api/v1/auth/login',
      method: 'POST',
      data: input,
    }),

  logout: () =>
    apiRequest<void>({
      url: '/api/v1/auth/logout',
      method: 'POST',
    }),

  me: () =>
    apiRequest<User>({
      url: '/api/v1/users/me',
      method: 'GET',
    }),
}
