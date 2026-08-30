import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

export function ProtectedRoute() {
  const { status } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (status === 'checking') return <p role="status">Checking authentication…</p>
  if (status === 'error') return <p role="alert">Unable to verify authentication. Please try again.</p>
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
