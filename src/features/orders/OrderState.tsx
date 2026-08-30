interface StateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function OrderLoading() {
  return (
    <div role="status" aria-live="polite">
      Loading orders…
    </div>
  )
}

export function OrderError({
  message,
  actionLabel = 'Try again',
  onAction,
}: StateProps) {
  return (
    <div role="alert">
      <p>{message}</p>
      {onAction && <button onClick={onAction}>{actionLabel}</button>}
    </div>
  )
}

export function OrderEmpty() {
  return (
    <div>
      <h2>No orders yet</h2>
      <p>Your orders will appear here after you create one.</p>
    </div>
  )
}
