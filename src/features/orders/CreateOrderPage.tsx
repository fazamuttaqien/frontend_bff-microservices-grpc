import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiError } from '@/lib/api-client'
import { orderApi } from '@/services/order.api'
import { invalidateOrderCache } from './useOrders'

type Item = { product_id: string; quantity: number }

export function CreateOrderPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Item[]>([{ product_id: '', quantity: 1 }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const valid =
    items.length > 0 &&
    items.every(
      (item) =>
        item.product_id.trim() &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    )

  const submit = async (event?: FormEvent) => {
    event?.preventDefault()
    setError(null)
    if (!valid) {
      setError('Each item needs a product ID and a quantity greater than zero.')
      return
    }
    setSubmitting(true)
    try {
      const order = await orderApi.create({ items })
      invalidateOrderCache()
      setConfirmOpen(false)
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
    <section className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" className="px-0">
        <Link to="/orders">← Back to orders</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create order</CardTitle>
          <CardDescription>
            Add one or more products to your order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => event.preventDefault()}
            noValidate
            className="space-y-6"
          >
            <div className="space-y-4">
              {items.map((item, index) => (
                <fieldset
                  key={index}
                  className="space-y-4 rounded-lg border p-4"
                >
                  <legend className="px-1 text-sm font-medium">
                    Item {index + 1}
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-[1fr_140px_auto] sm:items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`product-${index}`}>Product ID</Label>
                      <Input
                        id={`product-${index}`}
                        value={item.product_id}
                        onChange={(e) =>
                          setItems((current) =>
                            current.map((x, i) =>
                              i === index
                                ? { ...x, product_id: e.target.value }
                                : x,
                            ),
                          )
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
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
                    </div>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setItems((current) =>
                            current.filter((_, i) => i !== index),
                          )
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setItems((current) => [
                    ...current,
                    { product_id: '', quantity: 1 },
                  ])
                }
              >
                Add item
              </Button>

              <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogTrigger asChild>
                  <Button type="button" disabled={submitting || !valid}>
                    Review & create order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Confirm order</DialogTitle>
                  <DialogDescription>
                    This will create the order with {items.length} item
                    {items.length === 1 ? '' : 's'}. Continue?
                  </DialogDescription>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={submitting}
                      onClick={() => setConfirmOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      disabled={submitting}
                      onClick={() => void submit()}
                    >
                      {submitting ? 'Creating…' : 'Confirm order'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {error && <Alert>{error}</Alert>}
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
