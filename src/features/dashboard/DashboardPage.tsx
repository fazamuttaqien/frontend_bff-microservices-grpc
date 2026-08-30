import { Link } from 'react-router-dom'
import { Alert } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Skeleton } from '../../components/ui/skeleton'
import { useAuth } from '../auth/AuthProvider'
import { useOrder, useOrders } from '../orders/useOrders'

const PAGE_SIZE = 5

function statusLabel(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Card key={item}>
            <CardHeader className="space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-8 w-20" /></CardHeader>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {[0, 1].map((item) => <Card key={item}><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent className="space-y-3"><Skeleton className="h-14 w-full" /><Skeleton className="h-14 w-full" /><Skeleton className="h-14 w-full" /></CardContent></Card>)}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const { orders, total: orderTotal, loading, error, reload } = useOrders(1, PAGE_SIZE)
  const latestOrderId = orders[0]?.id ?? null
  // GET /orders/:id is a BFF aggregation response containing order + product information.
  const { data: latestDetail, loading: detailLoading, error: detailError, reload: reloadDetail } = useOrder(latestOrderId)
  const recentValue = orders.reduce((sum, order) => sum + Number(order.total), 0)
  const latestProducts = latestDetail?.products ?? []

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your account and recent activity.</p>
        </div>
        <Button asChild variant="outline"><Link to="/orders">View all orders</Link></Button>
      </header>

      {loading ? <DashboardSkeleton /> : error ? (
        <Alert className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span><Button type="button" variant="outline" onClick={() => void reload()}>Try again</Button>
        </Alert>
      ) : (
        <>
          <section aria-label="Dashboard summary" className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><CardDescription>Current user</CardDescription><CardTitle>{user?.name ?? 'Account unavailable'}</CardTitle></CardHeader><CardContent className="text-muted-foreground text-sm">{user?.email ?? 'Unable to load account information.'}</CardContent></Card>
            <Card><CardHeader><CardDescription>Total orders</CardDescription><CardTitle className="text-3xl">{orderTotal}</CardTitle></CardHeader><CardContent className="text-muted-foreground text-sm">Orders across your account.</CardContent></Card>
            <Card><CardHeader><CardDescription>Recent order value</CardDescription><CardTitle className="text-3xl">{recentValue.toFixed(2)}</CardTitle></CardHeader><CardContent className="text-muted-foreground text-sm">Based on the {orders.length} most recent orders.</CardContent></Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4"><div><CardTitle>Recent orders</CardTitle><CardDescription>Your latest order activity.</CardDescription></div><Button asChild size="sm" variant="ghost"><Link to="/orders">View all</Link></Button></CardHeader>
              <CardContent>
                {orders.length === 0 ? <div className="rounded-lg border border-dashed p-6 text-center"><p className="font-medium">No orders yet</p><p className="text-muted-foreground mt-1 text-sm">Create an order to see activity here.</p><Button asChild className="mt-4" size="sm"><Link to="/orders/new">Create order</Link></Button></div> : <div className="divide-y rounded-lg border">{orders.map((order) => <Link key={order.id} to={`/orders/${encodeURIComponent(order.id)}`} className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="min-w-0"><p className="truncate font-medium">Order #{order.id}</p><p className="text-muted-foreground text-sm">{new Date(order.created_at).toLocaleDateString()}</p></div><div className="flex shrink-0 items-center gap-3"><Badge variant="outline">{statusLabel(order.status)}</Badge><span className="font-medium">{order.total}</span></div></Link>)}</div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Latest order products</CardTitle><CardDescription>Product data returned by the BFF aggregation for your latest order.</CardDescription></CardHeader>
              <CardContent>
                {!latestOrderId ? <p className="text-muted-foreground text-sm">Create an order to see product information here.</p> : detailLoading ? <div className="space-y-3" aria-busy="true"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div> : detailError ? <Alert className="space-y-3"><p>{detailError}</p><Button type="button" size="sm" variant="outline" onClick={() => void reloadDetail()}>Retry details</Button></Alert> : latestProducts.length === 0 ? <p className="text-muted-foreground text-sm">No product information is available for the latest order.</p> : <ul className="space-y-3">{latestProducts.slice(0, 5).map((product) => <li key={product.id} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div className="min-w-0"><p className="truncate font-medium">{product.name}</p><p className="text-muted-foreground text-sm">Stock: {product.stock}</p></div><span className="shrink-0 font-medium">{product.price}</span></li>)}</ul>}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </main>
  )
}
