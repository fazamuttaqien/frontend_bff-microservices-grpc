import type { User } from '@/types/api'
import { Badge } from '@/components/ui/badge'

interface UserInformationProps {
  user: User
}

export function UserInformation({ user }: UserInformationProps) {
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : '—'

  return (
    <dl className="divide-y rounded-lg border">
      <div className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-4">
        <dt className="text-sm font-medium text-muted-foreground">Name</dt>
        <dd className="font-medium">{user.name || '—'}</dd>
      </div>
      <div className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-4">
        <dt className="text-sm font-medium text-muted-foreground">Email</dt>
        <dd>{user.email || '—'}</dd>
      </div>
      <div className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-4">
        <dt className="text-sm font-medium text-muted-foreground">Member since</dt>
        <dd>
          <Badge variant="secondary">{memberSince}</Badge>
        </dd>
      </div>
    </dl>
  )
}
