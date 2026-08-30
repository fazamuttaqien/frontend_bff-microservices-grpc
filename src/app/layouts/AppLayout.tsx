import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { UserMenu } from '@/components/app/UserMenu'
import { AppSidebar } from '@/components/app/AppSidebar'
import { MobileNavigation } from '@/components/app/MobileNavigation'
import { PageContainer } from '@/components/app/PageContainer'
import { useAppSelector } from '@/app/hooks'
import { useAuth } from '../../features/auth/useAuth'

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
      // The auth hook owns normalized error state.
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <MobileNavigation />
          <NavLink to="/dashboard" className="text-lg font-semibold tracking-tight">BFF Store</NavLink>
          <div className="ml-auto"><UserMenu email={user?.email} disabled={loggingOut} onLogout={handleLogout} /></div>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          {error && <div className="px-4 pt-4 sm:px-6 lg:px-8"><Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert></div>}
          <PageContainer><Outlet /></PageContainer>
        </div>
      </div>
      <Separator />
    </div>
  )
}
