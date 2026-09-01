import { describe, expect, it, vi } from 'vitest'

const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }))
vi.mock('@/lib/api-client', () => ({ apiRequest }))

import { orderApi } from './order.api'

describe('orderApi', () => {
  it('uses the BFF order endpoints', async () => {
    apiRequest.mockResolvedValueOnce({ id: 'ord-1' })
    await orderApi.create({ items: [{ product_id: 'p-1', quantity: 2 }] })
    expect(apiRequest).toHaveBeenCalledWith({
      url: '/api/v1/orders',
      method: 'POST',
      data: { items: [{ product_id: 'p-1', quantity: 2 }] },
    })

    apiRequest.mockResolvedValueOnce({
      orders: [],
      total: 0,
      page: 1,
      page_size: 20,
    })
    await orderApi.list(1, 20)
    expect(apiRequest).toHaveBeenCalledWith({
      url: '/api/v1/orders',
      method: 'GET',
      params: { page: 1, page_size: 20 },
    })

    apiRequest.mockResolvedValueOnce({ order: { id: 'ord/1' } })
    await orderApi.get('ord/1')
    expect(apiRequest).toHaveBeenCalledWith({
      url: '/api/v1/orders/ord%2F1',
      method: 'GET',
    })
  })
})
