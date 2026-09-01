import { apiRequest } from '@/lib/api-client'
import type { User } from '@/types/api'

export const userApi = {
  me: () =>
    apiRequest<User>({
      url: '/api/v1/users/me',
      method: 'GET',
    }),
}
