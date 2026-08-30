import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { UserInformation } from './UserInformation'
import { useProfile } from './useProfile'

export function ProfilePage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { user, loading, error, reload } = useProfile()

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
          <button type="button" onClick={() => void reload()}>
            Try again
          </button>
        </div>
      )}
      {!loading && !error && !user && (
        <p>Your profile information is unavailable.</p>
      )}
      {!loading && !error && user && <UserInformation user={user} />}
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </section>
  )
}
