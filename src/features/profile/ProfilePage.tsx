import { useNavigate } from 'react-router-dom'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '../auth/useAuth'
import { UserInformation } from './UserInformation'
import { useProfile } from './useProfile'

function ProfileSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Loading profile">
      <CardHeader>
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  )
}

export function ProfilePage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { user, loading, error, reload } = useProfile()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6" aria-labelledby="profile-title">
      <div>
        <h1 id="profile-title" className="text-2xl font-semibold tracking-tight">
          Profile
        </h1>
        <p className="text-muted-foreground">Manage and view your account information.</p>
      </div>

      {loading && <ProfileSkeleton />}

      {!loading && error && (
        <Card>
          <CardHeader>
            <CardTitle>Unable to load profile</CardTitle>
            <CardDescription>Please try again. Your account session may need to be verified.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>{error}</Alert>
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={() => void reload()}>
              Try again
            </Button>
          </CardFooter>
        </Card>
      )}

      {!loading && !error && !user && (
        <Card>
          <CardHeader>
            <CardTitle>Profile unavailable</CardTitle>
            <CardDescription>Your profile information is not available right now.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Please try again later.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && user && (
        <Card>
          <CardHeader>
            <CardTitle>Account information</CardTitle>
            <CardDescription>Your current account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserInformation user={user} />
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="button" variant="outline" onClick={() => void handleLogout()}>
              Logout
            </Button>
          </CardFooter>
        </Card>
      )}
    </section>
  )
}
