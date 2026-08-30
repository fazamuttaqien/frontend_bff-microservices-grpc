import { User, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserMenuProps {
  email?: string
  disabled?: boolean
  onLogout: () => void
}

function initials(email?: string) {
  return email?.trim().slice(0, 1).toUpperCase() || 'U'
}

export function UserMenu({ email, disabled, onLogout }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 px-2"
          aria-label="Open user menu"
        >
          <Avatar>
            <AvatarFallback>{initials(email)}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-40 truncate text-sm sm:inline">
            {email ?? 'Account'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem disabled>
          <User />
          <span className="truncate">{email ?? 'Account'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onLogout} disabled={disabled}>
          <LogOut />
          {disabled ? 'Logging out…' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
