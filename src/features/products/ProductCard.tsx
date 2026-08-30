import { Link } from 'react-router-dom'
import type { Product } from '../../types/api'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div>
        <h2>{product.name}</h2>
        <p>{product.description || 'No description available.'}</p>
      </div>
      <div className="product-card__meta">
        <strong>{product.price}</strong>
        <span>{product.stock} in stock</span>
      </div>
      <Link to={`/products/${encodeURIComponent(product.id)}`}>
        View details
      </Link>
    </article>
  )
}
