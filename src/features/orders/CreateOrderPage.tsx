import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../../lib/api'
import { orderApi } from '../../services/order.api'
import { getAccessToken } from '../auth/auth.storage'
import { invalidateOrderCache } from './useOrders'

type Item = { product_id: string; quantity: number }

export function CreateOrderPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Item[]>([{ product_id: '', quantity: 1 }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const valid =
    items.length > 0 &&
    items.every(
      (item) =>
        item.product_id.trim() &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    )

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!valid) {
      setError('Each item needs a product ID and a quantity greater than zero.')
      return
    }
    const token = getAccessToken()
    if (!token) {
      setError('You must be logged in.')
      return
    }
    setSubmitting(true)
    try {
      const order = await orderApi.create({ items }, token)
      invalidateOrderCache()
      navigate(`/orders/${encodeURIComponent(order.id)}`)
    } catch (reason) {
      setError(
        reason instanceof ApiError || reason instanceof Error
          ? reason.message
          : 'Unable to create order.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <Link to="/orders">← Back to orders</Link>
      <h1>Create order</h1>
      <form onSubmit={submit} noValidate>
        {items.map((item, index) => (
          <fieldset key={index}>
            <legend>Item {index + 1}</legend>
            <label>
              Product ID
              <input
                value={item.product_id}
                onChange={(e) =>
                  setItems((current) =>
                    current.map((x, i) =>
                      i === index ? { ...x, product_id: e.target.value } : x,
                    ),
                  )
                }
                required
              />
            </label>
            <label>
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                value={item.quantity}
                onChange={(e) =>
                  setItems((current) =>
                    current.map((x, i) =>
                      i === index
                        ? { ...x, quantity: Number(e.target.value) }
                        : x,
                    ),
                  )
                }
                required
              />
            </label>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setItems((current) => current.filter((_, i) => i !== index))
                }
              >
                Remove
              </button>
            )}
          </fieldset>
        ))}
        <button
          type="button"
          onClick={() =>
            setItems((current) => [...current, { product_id: '', quantity: 1 }])
          }
        >
          Add item
        </button>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={submitting || !valid}>
          {submitting ? 'Creating…' : 'Create order'}
        </button>
      </form>
    </section>
  )
}
