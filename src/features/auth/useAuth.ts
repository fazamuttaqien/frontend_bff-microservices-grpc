import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { ApiError } from '@/lib/api-client'
import { authApi } from '@/services/auth.api'
import type { LoginInput, RegisterInput } from '@/types/api'
import { invalidateOrderCache } from '@/features/orders/useOrders'
import {
  clearAuthError,
  setAuthenticated,
  setAuthError,
  setChecking,
  setUnauthenticated,
} from './authSlice'

function messageFromError(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'An unexpected authentication error occurred'
}

export function useAuth() {
  const dispatch = useAppDispatch()
  const { status, currentUser, error } = useAppSelector((state) => state.auth)

  const login = useCallback(
    async (input: LoginInput) => {
      dispatch(setChecking())
      try {
        await authApi.login(input)
        const currentUser = await authApi.me()
        invalidateOrderCache()
        dispatch(setAuthenticated(currentUser))
      } catch (reason) {
        dispatch(setAuthError(messageFromError(reason)))
        throw reason
      }
    },
    [dispatch],
  )

  const register = useCallback(
    async (input: RegisterInput) => {
      dispatch(clearAuthError())
      return authApi.register(input)
    },
    [dispatch],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
      invalidateOrderCache()
      dispatch(setUnauthenticated())
    } catch (reason) {
      dispatch(setAuthError(messageFromError(reason)))
      throw reason
    }
  }, [dispatch])

  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch])
  return {
    user: currentUser,
    status,
    error,
    login,
    register,
    logout,
    clearError,
  }
}

export async function bootstrapAuthentication(
  dispatch: ReturnType<typeof useAppDispatch>,
) {
  dispatch(setChecking())
  try {
    const currentUser = await authApi.me()
    dispatch(setAuthenticated(currentUser))
  } catch (reason) {
    if (reason instanceof ApiError && reason.code === 'unauthenticated') {
      dispatch(setUnauthenticated())
      return
    }
    dispatch(setAuthError(messageFromError(reason)))
  }
}
