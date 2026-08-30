import { describe, expect, it, vi } from 'vitest'
import { orderApi } from './order.api'

const { request } = vi.hoisted(() => ({ request: vi.fn() }))
vi.mock('../lib/api', () => ({ request }))

describe('orderApi', () => {
  it('uses the BFF order endpoints', async () => {
    request.mockResolvedValueOnce({ id: 'ord-1' })
    await orderApi.create(
      { items: [{ product_id: 'p-1', quantity: 2 }] },
      'token',
    )
    expect(request).toHaveBeenCalledWith('/api/v1/orders', {
      method: 'POST',
      body: { items: [{ product_id: 'p-1', quantity: 2 }] },
      token: 'token',
    })

    request.mockResolvedValueOnce({
      orders: [],
      total: 0,
      page: 1,
      page_size: 20,
    })
    await orderApi.list('token', 1, 20)
    expect(request).toHaveBeenCalledWith('/api/v1/orders?page=1&page_size=20', {
      token: 'token',
    })

    request.mockResolvedValueOnce({ order: { id: 'ord-1' } })
    await orderApi.get('ord/1', 'token')
    expect(request).toHaveBeenCalledWith('/api/v1/orders/ord%2F1', {
      token: 'token',
    })
  })
})
