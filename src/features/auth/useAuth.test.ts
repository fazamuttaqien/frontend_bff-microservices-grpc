import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { User } from '@/types/api'
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
  created_at: '2026-08-30T10:00:00Z',
  updated_at: '2026-08-30T10:00:00Z',
}

describe('bootstrapAuthentication', () => {
  const dispatch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stores the current user when session bootstrap succeeds', async () => {
    const { authApi } = await import('@/services/auth.api')
    const { bootstrapAuthentication } = await import('./useAuth')
    vi.mocked(authApi.me).mockResolvedValue(user)

    await bootstrapAuthentication(dispatch as never)

    expect(dispatch).toHaveBeenCalledWith(setAuthenticated(user))
  })

  it('marks the session unauthenticated when bootstrap fails with 401', async () => {
    const { authApi } = await import('@/services/auth.api')
    const { bootstrapAuthentication } = await import('./useAuth')
    vi.mocked(authApi.me).mockRejectedValue({ code: 'unauthenticated' })

    await bootstrapAuthentication(dispatch as never)

    expect(dispatch).toHaveBeenCalledWith(setUnauthenticated())
  })
})
