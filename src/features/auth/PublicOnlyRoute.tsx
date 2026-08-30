import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

export function PublicOnlyRoute() {
  const { status } = useAppSelector((state) => state.auth)

  if (status === 'checking') return <p role="status">Checking authentication…</p>
  if (status === 'error') return <p role="alert">Unable to verify authentication. Please try again.</p>
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />
  return <Outlet />
}
