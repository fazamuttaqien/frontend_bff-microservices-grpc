import { request } from '../lib/api'
import type { CreateOrderInput, Order, OrderDetail, OrderList } from '../types/api'

export const orderApi = {
  create(input: CreateOrderInput, token: string) {
    return request<Order>('/api/v1/orders', { method: 'POST', body: input, token })
  },
  list(token: string, page = 1, pageSize = 20) {
    return request<OrderList>(`/api/v1/orders?page=${page}&page_size=${pageSize}`, { token })
  },
  get(id: string, token: string) {
    return request<OrderDetail>(`/api/v1/orders/${encodeURIComponent(id)}`, { token })
  },
}
