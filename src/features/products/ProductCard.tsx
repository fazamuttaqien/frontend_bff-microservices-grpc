import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import type { Product } from '../../types/api'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="gap-2">
        <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
        <CardDescription className="line-clamp-3 min-h-15">
          {product.description || 'No description available.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between gap-4">
        <span className="text-lg font-semibold">{product.price}</span>
        <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}>
          {product.stock} in stock
        </Badge>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/products/${encodeURIComponent(product.id)}`}>
            View details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
