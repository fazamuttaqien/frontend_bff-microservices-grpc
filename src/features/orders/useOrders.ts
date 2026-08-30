import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../lib/api'
import { orderApi } from '../../services/order.api'
import type { Order, OrderDetail } from '../../types/api'
import { getAccessToken } from '../auth/auth.storage'

function messageOf(error: unknown) {
  return error instanceof ApiError || error instanceof Error ? error.message : 'Unable to load orders.'
}

export function useOrders(page = 1, pageSize = 20) {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(async () => {
    const token = getAccessToken()
    if (!token) { setError('You must be logged in.'); setLoading(false); return }
    setLoading(true); setError(null)
    try { const result = await orderApi.list(token, page, pageSize); setOrders(result.orders); setTotal(result.total) }
    catch (reason) { setOrders([]); setError(messageOf(reason)) }
    finally { setLoading(false) }
  }, [page, pageSize])
  useEffect(() => { void load() }, [load])
  return { orders, total, loading, error, reload: load }
}

export function useOrder(id: string) {
  const [data, setData] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(async () => {
    const token = getAccessToken()
    if (!token) { setError('You must be logged in.'); setLoading(false); return }
    setLoading(true); setError(null)
    try { setData(await orderApi.get(id, token)) }
    catch (reason) { setData(null); setError(messageOf(reason)) }
    finally { setLoading(false) }
  }, [id])
  useEffect(() => { void load() }, [load])
  return { data, loading, error, reload: load }
}
