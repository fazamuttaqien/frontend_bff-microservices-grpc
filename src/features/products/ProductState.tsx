interface ProductStateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function ProductError({
  message,
  actionLabel = 'Try again',
  onAction,
}: ProductStateProps) {
  return (
    <div className="product-state product-state--error" role="alert">
      <strong>Unable to load products</strong>
      <p>{message}</p>
      {onAction && <button onClick={onAction}>{actionLabel}</button>}
    </div>
  )
}

export function ProductEmpty() {
  return (
    <div className="product-state">
      <strong>No products found</strong>
      <p>There are no products to display.</p>
    </div>
  )
}
