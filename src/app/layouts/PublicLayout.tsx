import { NavLink, Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div>
      <header>
        <nav aria-label="Public navigation">
          <NavLink to="/">Home</NavLink> | <NavLink to="/login">Login</NavLink>{' '}
          | <NavLink to="/register">Register</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
