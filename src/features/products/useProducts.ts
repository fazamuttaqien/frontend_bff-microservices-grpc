import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/lib/api-client'
import { productApi } from '@/services/product.api'
import type { Product } from '@/types/api'

const cache = new Map<string, { products: Product[]; total: number }>()
const requests = new Map<
  string,
  Promise<{ products: Product[]; total: number }>
>()

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Unable to load products.'
}

function fetchProducts(page: number, pageSize: number) {
  const key = `${page}:${pageSize}`
  const cached = cache.get(key)
  if (cached) return Promise.resolve(cached)
  const inFlight = requests.get(key)
  if (inFlight) return inFlight

  const request = productApi
    .list(page, pageSize)
    .then((result) => {
      const value = {
        products: result.products ?? [],
        total: result.total ?? 0,
      }
      cache.set(key, value)
      return value
    })
    .finally(() => requests.delete(key))

  requests.set(key, request)
  return request
}

export function useProducts(page: number, pageSize: number) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (force = false) => {
      const key = `${page}:${pageSize}`
      if (force) cache.delete(key)
      setLoading(true)
      setError(null)
      try {
        const result = await fetchProducts(page, pageSize)
        setProducts(result.products)
        setTotal(result.total)
      } catch (reason: unknown) {
        setProducts([])
        setTotal(0)
        setError(errorMessage(reason))
      } finally {
        setLoading(false)
      }
    },
    [page, pageSize],
  )

  useEffect(() => {
    let active = true

    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await fetchProducts(page, pageSize)
        if (!active) return
        setProducts(result.products)
        setTotal(result.total)
      } catch (reason: unknown) {
        if (!active) return
        setProducts([])
        setTotal(0)
        setError(errorMessage(reason))
      } finally {
        if (active) setLoading(false)
      }
    }

    void run()

    return () => {
      active = false
    }
  }, [page, pageSize])

  return { products, total, loading, error, reload: () => load(true) }
}
