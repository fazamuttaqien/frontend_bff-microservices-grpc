import { request } from '../lib/api'
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from '../types/api'

export const authApi = {
  register: (input: RegisterInput) =>
    request<User>('/api/v1/auth/register', {
      method: 'POST',
      body: input,
    }),

  login: (input: LoginInput) =>
    request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: input,
    }),

  logout: (token: string) =>
    request<void>('/api/v1/auth/logout', {
      method: 'POST',
      token,
    }),

  me: (token: string) => request<User>('/api/v1/users/me', { token }),
}
