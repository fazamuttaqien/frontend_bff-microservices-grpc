import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/app/hooks'
import { useAuth } from '../../features/auth/useAuth'

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/profile', label: 'Profile' },
]

export function AppLayout() {
  const user = useAppSelector((state) => state.auth.currentUser)
  const { logout, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    clearError()
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      // Error is normalized and stored by the auth hook.
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <nav aria-label="Application navigation" className="flex flex-wrap gap-4 text-sm">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.email}</span>
            <Button type="button" variant="outline" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? 'Logging out…' : 'Logout'}
            </Button>
          </div>
        </div>
        {error && (
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
