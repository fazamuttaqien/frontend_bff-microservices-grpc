import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { OrderSummary } from '../orders/OrderSummary'
import { OrderError, OrderLoading } from '../orders/OrderState'
import { useOrder, useOrders } from '../orders/useOrders'

const PAGE_SIZE = 5

function statusLabel(status: string) {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function DashboardPage() {
  const { user } = useAuth()
  const {
    orders,
    total: orderTotal,
    loading,
    error,
    reload,
  } = useOrders(1, PAGE_SIZE)
  const latestOrderId = orders[0]?.id ?? null
  const {
    data: featured,
    loading: detailLoading,
    error: detailError,
    reload: reloadDetail,
  } = useOrder(latestOrderId)

  if (loading)
    return (
      <section className="page" aria-busy="true">
        <h1>Dashboard</h1>
        <OrderLoading />
      </section>
    )

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your account and recent activity.</p>
        </div>
        <Link to="/orders">View all orders</Link>
      </header>
      <section aria-labelledby="dashboard-user">
        <h2 id="dashboard-user">User information</h2>
        {user ? (
          <dl>
            <div>
              <dt>Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
          </dl>
        ) : (
          <p>Account information is unavailable.</p>
        )}
      </section>
      {error ? (
        <OrderError message={error} onAction={() => void reload()} />
      ) : (
        <>
          <section aria-labelledby="dashboard-summary">
            <h2 id="dashboard-summary">Order summary</h2>
            <dl>
              <div>
                <dt>Total orders</dt>
                <dd>{orderTotal}</dd>
              </div>
              <div>
                <dt>Recent order value</dt>
                <dd>
                  {orders
                    .reduce((sum, order) => sum + Number(order.total), 0)
                    .toFixed(2)}
                </dd>
              </div>
            </dl>
          </section>
          <section aria-labelledby="dashboard-recent">
            <h2 id="dashboard-recent">Recent orders</h2>
            {orders.length === 0 ? (
              <div>
                <h3>No orders yet</h3>
                <p>Your recent orders will appear here.</p>
                <Link to="/orders/new">Create an order</Link>
              </div>
            ) : (
              <div>
                {orders.map((order) => (
                  <article key={order.id}>
                    <Link to={`/orders/${encodeURIComponent(order.id)}`}>
                      <strong>#{order.id}</strong>
                    </Link>
                    <span>{statusLabel(order.status)}</span>
                    <span>
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span>{order.total}</span>
                  </article>
                ))}
              </div>
            )}
          </section>
          {latestOrderId && detailLoading && (
            <section aria-busy="true">
              <OrderLoading />
            </section>
          )}
          {featured && !detailLoading && (
            <section aria-labelledby="dashboard-aggregation">
              <h2 id="dashboard-aggregation">Latest order details</h2>
              <p>
                Product information is supplied by the BFF aggregation endpoint.
              </p>
              <OrderSummary
                order={featured.order}
                products={featured.products}
              />
            </section>
          )}
          {detailError && !detailLoading && (
            <section role="status">
              <p>
                Recent orders are available, but aggregated details could not be
                loaded: {detailError}
              </p>
              <button onClick={() => void reloadDetail()}>Retry details</button>
            </section>
          )}
        </>
      )}
    </section>
  )
}
