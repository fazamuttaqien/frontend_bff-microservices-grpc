import { NavLink, Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="text-lg font-semibold">BFF Store</NavLink>
          <nav aria-label="Public navigation" className="flex gap-4 text-sm">
            <NavLink to="/login" className="text-muted-foreground hover:text-foreground">Login</NavLink>
            <NavLink to="/register" className="text-muted-foreground hover:text-foreground">Register</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-start justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
