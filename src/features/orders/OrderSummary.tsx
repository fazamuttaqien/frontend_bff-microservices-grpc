import type { Order, Product } from '@/types/api'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface OrderSummaryProps {
  order: Order
  products?: Product[]
}

function statusVariant(status: string) {
  const normalized = status.toLowerCase()
  if (['cancelled', 'canceled', 'failed'].includes(normalized))
    return 'destructive' as const
  if (['completed', 'paid', 'success'].includes(normalized))
    return 'secondary' as const
  return 'outline' as const
}

export function OrderSummary({ order, products = [] }: OrderSummaryProps) {
  const names = new Map(products.map((product) => [product.id, product.name]))

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg">
            Order #{order.id}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <Badge variant={statusVariant(order.status)} className="w-fit">
          {order.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <ul className="divide-y rounded-md border">
          {order.items.map((item) => (
            <li
              key={item.product_id}
              className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[1fr_auto] sm:gap-4"
            >
              <span className="font-medium">
                {names.get(item.product_id) ?? item.product_id}
              </span>
              <span className="text-muted-foreground sm:text-right">
                Qty {item.quantity} · {item.price} · Total {item.total}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <span className="text-muted-foreground text-sm">Total</span>
        <strong>{order.total}</strong>
      </CardFooter>
    </Card>
  )
}
