import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { clearAuthState, setAuthState, type AuthStatus } from './authSlice'
import { ApiError } from '../../lib/api-client'
import { authApi } from '../../services/auth.api'
import type { LoginInput, RegisterInput, User } from '../../types/api'
import { invalidateOrderCache } from '../orders/useOrders'

interface AuthContextValue {
  user: User | null
  status: AuthStatus
  error: string | null
  login(input: LoginInput): Promise<void>
  register(input: RegisterInput): Promise<User>
  logout(): Promise<void>
  clearError(): void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function messageFromError(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'An unexpected authentication error occurred'
}

export function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()
  const { user, status } = useAppSelector((state) => state.auth)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void authApi
      .me()
      .then((currentUser) => {
        if (!active) return
        dispatch(
          setAuthState({ user: currentUser, status: 'authenticated' }),
        )
      })
      .catch((reason: unknown) => {
        if (!active) return
        invalidateOrderCache()
        dispatch(setAuthState({ user: null, status: 'unauthenticated' }))
        if (!(reason instanceof ApiError && reason.code === 'unauthenticated'))
          setError(messageFromError(reason))
      })
    return () => {
      active = false
    }
  }, [dispatch])

  const login = useCallback(
    async (input: LoginInput) => {
      setError(null)
      const response = await authApi.login(input)
      invalidateOrderCache()
      dispatch(
        setAuthState({ user: response.user, status: 'authenticated' }),
      )
    },
    [dispatch],
  )

  const register = useCallback(async (input: RegisterInput) => {
    setError(null)
    return authApi.register(input)
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    try {
      await authApi.logout()
    } catch (reason: unknown) {
      if (!(reason instanceof ApiError && reason.code === 'unauthenticated'))
        setError(messageFromError(reason))
    }
    invalidateOrderCache()
    dispatch(clearAuthState())
  }, [dispatch])

  const clearError = useCallback(() => setError(null), [])
  const value = useMemo(
    () => ({ user, status, error, login, register, logout, clearError }),
    [user, status, error, login, register, logout, clearError],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
