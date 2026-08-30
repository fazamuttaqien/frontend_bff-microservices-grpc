import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/profile', label: 'Profile' },
]

export function AppLayout() {
  return (
    <div>
      <header>
        <nav aria-label="Application navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
