import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useOrders } from './useOrders'

const list = vi.fn()
vi.mock('../../services/order.api', () => ({ orderApi: { list, get: vi.fn() } }))
vi.mock('../auth/auth.storage', () => ({ authStorage: { getToken: () => 'token' } }))

describe('useOrders', () => {
  beforeEach(() => { list.mockReset() })

  it('exposes loaded server state', async () => {
    list.mockResolvedValue({ orders: [{ id: 'o1', user_id: 'u1', items: [], total: '0', status: 'pending', created_at: '2026-08-30T10:00:00Z', updated_at: '2026-08-30T10:00:00Z' }], total: 1, page: 1, page_size: 20 })
    const { result } = renderHook(() => useOrders())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.orders).toHaveLength(1)
    expect(result.current.total).toBe(1)
    expect(result.current.error).toBeNull()
  })

  it('exposes API errors', async () => {
    list.mockRejectedValue(new Error('Network unavailable'))
    const { result } = renderHook(() => useOrders())
    await waitFor(() => expect(result.current.error).toBe('Network unavailable'))
    expect(result.current.orders).toEqual([])
  })
})
