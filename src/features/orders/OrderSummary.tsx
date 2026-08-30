import type { Order, Product } from '../../types/api'

interface OrderSummaryProps {
  order: Order
  products?: Product[]
}

export function OrderSummary({ order, products = [] }: OrderSummaryProps) {
  const names = new Map(products.map((product) => [product.id, product.name]))
  return (
    <article>
      <header>
        <strong>Order #{order.id}</strong>
        <span aria-label={`Status: ${order.status}`}>{order.status}</span>
      </header>
      <p>{new Date(order.created_at).toLocaleString()}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.product_id}>
            {names.get(item.product_id) ?? item.product_id} — quantity {item.quantity} — price {item.price} — total {item.total}
          </li>
        ))}
      </ul>
      <strong>Total: {order.total}</strong>
    </article>
  )
}
