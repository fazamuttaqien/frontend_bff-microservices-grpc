import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { ApiError } from '@/lib/api-client'
import { userApi } from '@/services/user.api'
import { setAuthenticated, setUnauthenticated } from '../auth/authSlice'

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  return 'Unable to load your profile.'
}

export function useProfile() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.currentUser)
  const authStatus = useAppSelector((state) => state.auth.status)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const profile = await userApi.me()
      dispatch(setAuthenticated(profile))
    } catch (reason: unknown) {
      if (reason instanceof ApiError && reason.code === 'unauthenticated') {
        dispatch(setUnauthenticated())
        return
      }
      setError(errorMessage(reason))
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    if (authStatus !== 'authenticated' || user) return
    void loadProfile()
  }, [authStatus, user, loadProfile])

  return { user, loading, error, reload: loadProfile }
}
