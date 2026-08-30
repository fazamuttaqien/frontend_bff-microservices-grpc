import { Link, useParams } from 'react-router-dom'
import { OrderError, OrderLoading } from './OrderState'
import { OrderSummary } from './OrderSummary'
import { useOrder } from './useOrders'

export function OrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { data, loading, error, reload } = useOrder(id)
  if (loading) return <section className="page"><OrderLoading /></section>
  if (error) return <section className="page"><OrderError message={error} onAction={() => void reload()} /></section>
  if (!data) return <section className="page"><OrderError message="Order was not found." /></section>
  return <section className="page"><Link to="/orders">← Back to orders</Link><OrderSummary order={data.order} products={data.products} />{data.partial_failures?.length ? <aside role="status"><h2>Some information is unavailable</h2><ul>{data.partial_failures.map((failure) => <li key={failure}>{failure}</li>)}</ul></aside> : null}</section>
}
