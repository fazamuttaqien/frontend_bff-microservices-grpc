import { Link, useSearchParams } from 'react-router-dom'
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

  return <section className="page">
    <header className="page__header"><div><h1>Orders</h1><p>Your order history.</p></div><Link to="/orders/new">Create order</Link></header>
    {loading ? <OrderLoading /> : error ? <OrderError message={error} onAction={() => void reload()} /> : orders.length === 0 ? <OrderEmpty /> : <>
      <div>{orders.map((order) => <div key={order.id}><Link to={`/orders/${encodeURIComponent(order.id)}`}><OrderSummary order={order} /></Link></div>)}</div>
      {pages > 1 && <nav aria-label="Order pagination"><button disabled={page === 1} onClick={() => setParams({ page: String(page - 1) })}>Previous</button><span>Page {page} of {pages}</span><button disabled={page >= pages} onClick={() => setParams({ page: String(page + 1) })}>Next</button></nav>}
    </>}
  </section>
}
