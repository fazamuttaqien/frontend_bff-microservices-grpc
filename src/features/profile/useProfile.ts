import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../lib/api'
import { authApi } from '../../services/auth.api'
import type { User } from '../../types/api'
import { authStorage } from '../auth/auth.storage'

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Unable to load your profile.'
}

export function useProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    const token = authStorage.getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      setUser(await authApi.me(token))
    } catch (reason: unknown) {
      setUser(null)
      setError(errorMessage(reason))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProfile()
  }, [loadProfile])

  return { user, loading, error, reload: loadProfile }
}
