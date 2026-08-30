import { Link, useParams } from 'react-router-dom'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderError, OrderLoading } from './OrderState'
import { OrderSummary } from './OrderSummary'
import { useOrder } from './useOrders'

export function OrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { data, loading, error, reload } = useOrder(id)

  if (loading)
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <OrderLoading />
      </section>
    )

  if (error)
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <OrderError message={error} onAction={() => void reload()} />
      </section>
    )

  if (!data)
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <OrderError message="Order was not found." />
      </section>
    )

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" className="px-0">
        <Link to="/orders">← Back to orders</Link>
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Order #{data.order.id}</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {new Date(data.order.created_at).toLocaleString()}
            </p>
          </div>
          <Badge>{data.order.status}</Badge>
        </CardHeader>
        <CardContent>
          <OrderSummary order={data.order} products={data.products} />
        </CardContent>
      </Card>

      {data.partial_failures?.length ? (
        <Alert>
          <div className="space-y-2">
            <h2 className="font-semibold">Some information is unavailable</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {data.partial_failures.map((failure) => (
                <li key={failure}>{failure}</li>
              ))}
            </ul>
          </div>
        </Alert>
      ) : null}
    </section>
  )
}
