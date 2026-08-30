import { Link, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { ApiError } from '../../lib/api'
import { productApi } from '../../services/product.api'
import type { Product } from '../../types/api'
import { ProductError } from './ProductState'
import { ProductLoading } from './ProductLoading'

export function ProductDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setProduct(await productApi.get(id))
    } catch (reason: unknown) {
      setProduct(null)
      setError(
        reason instanceof ApiError || reason instanceof Error
          ? reason.message
          : 'Unable to load product.',
      )
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    let active = true

    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        const nextProduct = await productApi.get(id)
        if (!active) return
        setProduct(nextProduct)
      } catch (reason: unknown) {
        if (!active) return
        setProduct(null)
        setError(
          reason instanceof ApiError || reason instanceof Error
            ? reason.message
            : 'Unable to load product.',
        )
      } finally {
        if (active) setLoading(false)
      }
    }

    void run()

    return () => {
      active = false
    }
  }, [id])

  if (loading)
    return (
      <section className="mx-auto w-full max-w-275 px-5 py-8 sm:px-6 lg:px-8">
        <ProductLoading count={1} />
      </section>
    )
  if (error)
    return (
      <section className="mx-auto w-full max-w-275 px-5 py-8 sm:px-6 lg:px-8">
        <ProductError message={error} onAction={() => void load()} />
      </section>
    )
  if (!product)
    return (
      <section className="mx-auto w-full max-w-275 px-5 py-8 sm:px-6 lg:px-8">
        <ProductError
          message="Product was not found."
          actionLabel="Back to products"
          onAction={() => window.history.back()}
        />
      </section>
    )

  return (
    <section className="mx-auto w-full max-w-275 px-5 py-8 sm:px-6 lg:px-8">
      <Button asChild variant="link" className="mb-6 px-0">
        <Link to="/products">← Back to products</Link>
      </Button>
      <Card>
        <CardHeader className="gap-4">
          <CardTitle className="text-2xl sm:text-3xl">{product.name}</CardTitle>
          <Badge
            variant={product.stock > 0 ? 'secondary' : 'destructive'}
            className="w-fit"
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="max-w-180 leading-7 text-muted-foreground">
            {product.description || 'No description available.'}
          </p>
          <dl className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Price</dt>
              <dd className="mt-1 text-xl font-bold">{product.price}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Stock</dt>
              <dd className="mt-1 text-xl font-bold">{product.stock}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}
