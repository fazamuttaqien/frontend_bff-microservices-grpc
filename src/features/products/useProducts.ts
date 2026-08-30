import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../lib/api'
import { productApi } from '../../services/product.api'
import type { Product } from '../../types/api'

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Unable to load products.'
}

export function useProducts(page: number, pageSize: number) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await productApi.list(page, pageSize)
      setProducts(result.products ?? [])
      setTotal(result.total ?? 0)
    } catch (reason: unknown) {
      setProducts([])
      setTotal(0)
      setError(errorMessage(reason))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    void load()
  }, [load])

  return { products, total, loading, error, reload: load }
}
