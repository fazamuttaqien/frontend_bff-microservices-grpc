import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'

interface ProductStateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function ProductError({
  message,
  actionLabel = 'Try again',
  onAction,
}: ProductStateProps) {
  return (
    <Alert className="flex flex-col gap-3 border-destructive/50 text-center sm:items-center">
      <strong className="font-semibold">Unable to load products</strong>
      <p className="text-muted-foreground">{message}</p>
      {onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Alert>
  )
}

export function ProductEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <strong className="font-semibold">No products found</strong>
        <p className="text-sm text-muted-foreground">
          There are no products to display.
        </p>
      </CardContent>
    </Card>
  )
}
