import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { OrderEmpty, OrderError, OrderLoading } from './OrderState'
import { OrderSummary } from './OrderSummary'
import { useOrders } from './useOrders'

const PAGE_SIZE = 20

export function OrdersPage() {
  const [params, setParams] = useSearchParams()
  const parsed = Number(params.get('page') ?? '1')
  const page = Number.isInteger(parsed) && parsed > 0 ? parsed : 1
  const { orders, total, loading, error, reload } = useOrders(page, PAGE_SIZE)
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Orders
          </h1>
          <p className="text-muted-foreground">Your order history.</p>
        </div>
        <Button asChild>
          <Link to="/orders/new">Create order</Link>
        </Button>
      </header>

      {loading ? (
        <OrderLoading />
      ) : error ? (
        <OrderError message={error} onAction={() => void reload()} />
      ) : orders.length === 0 ? (
        <OrderEmpty />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${encodeURIComponent(order.id)}`}
                className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <OrderSummary order={order} />
              </Link>
            ))}
          </div>

          {pages > 1 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row">
                <p className="text-muted-foreground text-sm" aria-live="polite">
                  Page {page} of {pages}
                </p>
                <nav aria-label="Order pagination" className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setParams({ page: String(page - 1) })}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={page >= pages}
                    onClick={() => setParams({ page: String(page + 1) })}
                  >
                    Next
                  </Button>
                </nav>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </section>
  )
}
