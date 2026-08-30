import { NavLink } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { navigation } from '@/app/layouts/navigation'

export function AppSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-card lg:block" aria-label="Sidebar navigation">
      <div className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col p-4">
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
        <Separator className="mb-3" />
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `block rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
