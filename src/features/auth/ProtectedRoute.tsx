import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppSelector } from '@/app/hooks'

export function ProtectedRoute() {
  const { status } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (status === 'checking') {
    return (
      <Card className="mx-auto mt-12 w-full max-w-md">
        <CardHeader><CardTitle>Checking your session</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Alert variant="destructive" className="mx-auto mt-12 max-w-xl">
        <AlertTitle>Unable to verify your session</AlertTitle>
        <AlertDescription>Please refresh the page and try again.</AlertDescription>
      </Alert>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
