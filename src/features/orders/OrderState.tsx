import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function OrderLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading orders"
      className="grid gap-4 md:grid-cols-2"
    >
      {[0, 1, 2, 3].map((item) => (
        <Card key={item}>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function OrderError({
  message,
  actionLabel = 'Try again',
  onAction,
}: StateProps) {
  return (
    <Alert className="space-y-3">
      <p>{message}</p>
      {onAction && (
        <Button type="button" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Alert>
  )
}

export function OrderEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No orders yet</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        Your orders will appear here after you create one.
      </CardContent>
    </Card>
  )
}
