import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import { ApiError } from '@/lib/api-client'
import { userApi } from '@/services/user.api'
import type { User } from '@/types/api'

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  return 'Unable to load your profile.'
}

export function useProfile() {
  const currentUser = useAppSelector((state) => state.auth.currentUser)
  const authStatus = useAppSelector((state) => state.auth.status)
  const [user, setUser] = useState<User | null>(currentUser)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loadedUserId = useRef<string | null>(currentUser?.id ?? null)

  useEffect(() => {
    setUser(currentUser)
    if (currentUser) {
      loadedUserId.current = currentUser.id
      setError(null)
    }
  }, [currentUser])

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const profile = await userApi.me()
      loadedUserId.current = profile.id
      setUser(profile)
    } catch (reason: unknown) {
      setUser(null)
      setError(errorMessage(reason))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authStatus !== 'authenticated' || currentUser || loadedUserId.current) return
    void loadProfile()
  }, [authStatus, currentUser, loadProfile])

  return { user, loading, error, reload: loadProfile }
}
