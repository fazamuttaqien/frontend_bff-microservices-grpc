import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { ApiError } from '../../lib/api'
import { authApi } from '../../services/auth.api'
import type { LoginInput, RegisterInput, User } from '../../types/api'
import { authStorage } from './auth.storage'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

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
  if (error instanceof Error) return error.message
  return 'An unexpected authentication error occurred'
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = authStorage.getToken()
    if (!token) {
      setStatus('unauthenticated')
      return
    }

    let active = true
    void authApi.me(token)
      .then((currentUser) => {
        if (!active) return
        setUser(currentUser)
        setStatus('authenticated')
      })
      .catch((reason: unknown) => {
        if (!active) return
        authStorage.clear()
        setUser(null)
        setStatus('unauthenticated')
        if (!(reason instanceof ApiError && reason.status === 401)) {
          setError(messageFromError(reason))
        }
      })

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    setError(null)
    const response = await authApi.login(input)
    authStorage.setToken(response.access_token)
    setUser(response.user)
    setStatus('authenticated')
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    setError(null)
    return authApi.register(input)
  }, [])

  const logout = useCallback(async () => {
    const token = authStorage.getToken()
    setError(null)
    if (token) {
      try {
        await authApi.logout(token)
      } catch (reason: unknown) {
        if (!(reason instanceof ApiError && reason.status === 401)) {
          setError(messageFromError(reason))
        }
      }
    }
    authStorage.clear()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo(
    () => ({ user, status, error, login, register, logout, clearError }),
    [user, status, error, login, register, logout, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
