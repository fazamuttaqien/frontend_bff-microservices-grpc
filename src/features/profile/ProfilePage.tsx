import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../lib/api'
import { authApi } from '../../services/auth.api'
import type { User } from '../../types/api'
import { useAuth } from '../auth/AuthProvider'
import { authStorage } from '../auth/auth.storage'
import { UserInformation } from './UserInformation'

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Unable to load your profile.'
}

export function ProfilePage() {
  const { user: authUser, logout } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(authUser)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    const token = authStorage.getToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    setLoading(true)
    setError(null)
    try {
      setUser(await authApi.me(token))
    } catch (reason: unknown) {
      setError(errorMessage(reason))
      if (reason instanceof ApiError && reason.status === 401) {
        await logout()
        navigate('/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [logout, navigate])

  useEffect(() => {
    void loadProfile()
  }, [loadProfile])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <section aria-labelledby="profile-title">
      <h1 id="profile-title">Profile</h1>
      {loading && <p role="status">Loading profile...</p>}
      {!loading && error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => void loadProfile()}>
            Try again
          </button>
        </div>
      )}
      {!loading && !error && !user && <p>Your profile information is unavailable.</p>}
      {!loading && !error && user && <UserInformation user={user} />}
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </section>
  )
}
