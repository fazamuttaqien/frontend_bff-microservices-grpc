import { NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PageContainer } from '@/components/app/PageContainer'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="border-b bg-background/95 backdrop-blur">
        <PageContainer className="flex h-16 items-center justify-between py-0">
          <NavLink to="/" className="text-lg font-semibold tracking-tight">BFF Store</NavLink>
          <nav aria-label="Public navigation" className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm"><NavLink to="/login">Login</NavLink></Button>
            <Button asChild variant="ghost" size="sm"><NavLink to="/register">Register</NavLink></Button>
          </nav>
        </PageContainer>
      </header>
      <main className="flex min-h-[calc(100vh-4rem)] items-start justify-center">
        <PageContainer className="flex justify-center py-10 sm:py-14"><div className="w-full"><Outlet /></div></PageContainer>
      </main>
      <Separator />
    </div>
  )
}
