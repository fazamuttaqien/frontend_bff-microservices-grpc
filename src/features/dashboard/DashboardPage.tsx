import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../lib/api'
import { orderApi } from '../../services/order.api'
import type { Order, OrderDetail } from '../../types/api'
import { authStorage } from '../auth/auth.storage'
import { useAuth } from '../auth/AuthProvider'
import { OrderSummary } from '../orders/OrderSummary'

const PAGE_SIZE = 5

function errorMessage(error: unknown) {
  if (error instanceof ApiError || error instanceof Error) return error.message
  return 'Unable to load dashboard data.'
}

function statusLabel(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function DashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [featured, setFeatured] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detailError, setDetailError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const token = authStorage.getToken()
    if (!token) {
      setError('You must be logged in.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    setDetailError(null)
    try {
      const result = await orderApi.list(token, 1, PAGE_SIZE)
      setOrders(result.orders)
      if (result.orders.length > 0) {
        try {
          // This BFF endpoint aggregates the order, customer and product data.
          setFeatured(await orderApi.get(result.orders[0].id, token))
        } catch (reason) {
          setFeatured(null)
          setDetailError(errorMessage(reason))
        }
      } else {
        setFeatured(null)
      }
    } catch (reason) {
      setOrders([])
      setFeatured(null)
      setError(errorMessage(reason))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  if (loading) return <section className="page" aria-busy="true"><h1>Dashboard</h1><p role="status">Loading dashboard…</p><div className="dashboard-skeleton" aria-hidden="true">Loading user, orders and summary…</div></section>

  return <section className="page">
    <header className="page__header"><div><h1>Dashboard</h1><p>Overview of your account and recent activity.</p></div><Link to="/orders">View all orders</Link></header>

    <section aria-labelledby="dashboard-user"><h2 id="dashboard-user">User information</h2>{user ? <dl><div><dt>Name</dt><dd>{user.name}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div></dl> : <p>Account information is unavailable.</p>}</section>

    {error ? <section role="alert"><p>{error}</p><button onClick={() => void load()}>Try again</button></section> : <>
      <section aria-labelledby="dashboard-summary"><h2 id="dashboard-summary">Order summary</h2><dl><div><dt>Total orders</dt><dd>{orders.length === 0 ? 0 : 'Recent ' + orders.length}</dd></div><div><dt>Recent order value</dt><dd>{orders.reduce((sum, order) => sum + Number(order.total), 0).toFixed(2)}</dd></div></dl></section>

      <section aria-labelledby="dashboard-recent"><h2 id="dashboard-recent">Recent orders</h2>{orders.length === 0 ? <div><h3>No orders yet</h3><p>Your recent orders will appear here.</p><Link to="/orders/new">Create an order</Link></div> : <div>{orders.map((order) => <article key={order.id}><Link to={`/orders/${encodeURIComponent(order.id)}`}><strong>#{order.id}</strong></Link><span>{statusLabel(order.status)}</span><span>{new Date(order.created_at).toLocaleDateString()}</span><span>{order.total}</span></article>)}</div>}</section>

      {featured && <section aria-labelledby="dashboard-aggregation"><h2 id="dashboard-aggregation">Latest order details</h2><p>Product information is supplied by the BFF aggregation endpoint.</p><OrderSummary order={featured.order} products={featured.products} /></section>}
      {detailError && <section role="status"><p>Recent order summary is available, but product/customer details could not be loaded: {detailError}</p><button onClick={() => void load()}>Retry details</button></section>}
    </>}
  </section>
}
