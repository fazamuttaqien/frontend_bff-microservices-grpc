import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export function PublicOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <p role="status">Checking authentication…</p>
  }

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
