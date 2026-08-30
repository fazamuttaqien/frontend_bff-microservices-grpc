import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { User } from '@/types/api'
import { authApi } from '@/services/auth.api'
import { bootstrapAuthentication } from './useAuth'
import { setAuthenticated, setUnauthenticated } from './authSlice'

vi.mock('@/services/auth.api', () => ({
  authApi: {
    me: vi.fn(),
  },
}))

const user: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
}

describe('bootstrapAuthentication', () => {
  const dispatch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stores the current user when session bootstrap succeeds', async () => {
    vi.mocked(authApi.me).mockResolvedValue(user)

    await bootstrapAuthentication(dispatch as never)

    expect(dispatch).toHaveBeenCalledWith(setAuthenticated(user))
  })

  it('marks the session unauthenticated when bootstrap fails with 401', async () => {
    vi.mocked(authApi.me).mockRejectedValue({ code: 'unauthenticated' })

    await bootstrapAuthentication(dispatch as never)

    expect(dispatch).toHaveBeenCalledWith(setUnauthenticated())
  })
})
