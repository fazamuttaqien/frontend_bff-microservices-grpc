import type { User } from '../../types/api'

interface UserInformationProps {
  user: User
}

export function UserInformation({ user }: UserInformationProps) {
  return (
    <dl>
      <div>
        <dt>Name</dt>
        <dd>{user.name || '—'}</dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>{user.email || '—'}</dd>
      </div>
      <div>
        <dt>Member since</dt>
        <dd>{user.created_at ? new Date(user.created_at).toLocaleString() : '—'}</dd>
      </div>
    </dl>
  )
}
