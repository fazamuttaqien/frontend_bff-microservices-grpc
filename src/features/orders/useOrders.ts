import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../lib/api'
import { orderApi } from '../../services/order.api'
import type { Order, OrderDetail, OrderList } from '../../types/api'
import { authStorage } from '../auth/auth.storage'

const listCache = new Map<string, OrderList>()
const listRequests = new Map<string, Promise<OrderList>>()
const detailCache = new Map<string, OrderDetail>()
const detailRequests = new Map<string, Promise<OrderDetail>>()

function messageOf(error: unknown) {
  return error instanceof ApiError || error instanceof Error
    ? error.message
    : 'Unable to load orders.'
}
async function fetchList(token: string, page: number, pageSize: number) {
  const key = `${page}:${pageSize}`
  const cached = listCache.get(key)
  if (cached) return cached
  const existing = listRequests.get(key)
  if (existing) return existing
  const request = orderApi
    .list(token, page, pageSize)
    .then((result) => {
      listCache.set(key, result)
      return result
    })
    .finally(() => listRequests.delete(key))
  listRequests.set(key, request)
  return request
}
async function fetchDetail(token: string, id: string) {
  const cached = detailCache.get(id)
  if (cached) return cached
  const existing = detailRequests.get(id)
  if (existing) return existing
  const request = orderApi
    .get(id, token)
    .then((result) => {
      detailCache.set(id, result)
      return result
    })
    .finally(() => detailRequests.delete(id))
  detailRequests.set(id, request)
  return request
}
export function invalidateOrderCache() {
  listCache.clear()
  detailCache.clear()
}
export function clearOrderCache(id?: string) {
  if (id) detailCache.delete(id)
  else invalidateOrderCache()
}

export function useOrders(page = 1, pageSize = 20) {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(async () => {
    const token = authStorage.getToken()
    if (!token) {
      setError('You must be logged in.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await fetchList(token, page, pageSize)
      setOrders(result.orders)
      setTotal(result.total)
    } catch (reason) {
      setOrders([])
      setError(messageOf(reason))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])
  useEffect(() => {
    void load()
  }, [load])
  return { orders, total, loading, error, reload: load }
}

export function useOrder(id: string | null) {
  const [data, setData] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(async () => {
    if (!id) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }
    const token = authStorage.getToken()
    if (!token) {
      setError('You must be logged in.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      setData(await fetchDetail(token, id))
    } catch (reason) {
      setData(null)
      setError(messageOf(reason))
    } finally {
      setLoading(false)
    }
  }, [id])
  useEffect(() => {
    void load()
  }, [load])
  return { data, loading, error, reload: load }
}
