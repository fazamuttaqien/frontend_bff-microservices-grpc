import { Link, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
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
    void load()
  }, [load])

  if (loading)
    return (
      <section className="page">
        <ProductLoading count={1} />
      </section>
    )
  if (error)
    return (
      <section className="page">
        <ProductError message={error} onAction={() => void load()} />
      </section>
    )
  if (!product)
    return (
      <section className="page">
        <ProductError
          message="Product was not found."
          actionLabel="Back to products"
          onAction={() => window.history.back()}
        />
      </section>
    )

  return (
    <section className="page product-detail">
      <Link to="/products">← Back to products</Link>
      <article className="product-detail__content">
        <h1>{product.name}</h1>
        <p>{product.description || 'No description available.'}</p>
        <dl>
          <div>
            <dt>Price</dt>
            <dd>{product.price}</dd>
          </div>
          <div>
            <dt>Stock</dt>
            <dd>{product.stock}</dd>
          </div>
        </dl>
      </article>
    </section>
  )
}
