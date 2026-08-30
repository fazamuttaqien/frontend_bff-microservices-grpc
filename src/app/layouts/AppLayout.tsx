import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/profile', label: 'Profile' },
]

export function AppLayout() {
  const { user, logout, error } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    if (!window.confirm('Are you sure you want to log out?')) return
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div>
      <header>
        <nav aria-label="Application navigation">{navigation.map((item) => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}</nav>
        <span>{user?.email}</span>
        <button type="button" onClick={handleLogout} disabled={loggingOut}>{loggingOut ? 'Logging out…' : 'Logout'}</button>
        {error && <p role="alert">{error}</p>}
      </header>
      <main><Outlet /></main>
    </div>
  )
}
