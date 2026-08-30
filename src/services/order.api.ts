import { apiRequest } from '../lib/api-client'
import type {
  CreateOrderInput,
  Order,
  OrderDetail,
  OrderList,
} from '../types/api'

export const orderApi = {
  create(input: CreateOrderInput) {
    return apiRequest<Order>({
      url: '/api/v1/orders',
      method: 'POST',
      data: input,
    })
  },
  list(page = 1, pageSize = 20) {
    return apiRequest<OrderList>({
      url: '/api/v1/orders',
      method: 'GET',
      params: { page, page_size: pageSize },
    })
  },
  get(id: string) {
    return apiRequest<OrderDetail>({
      url: `/api/v1/orders/${encodeURIComponent(id)}`,
      method: 'GET',
    })
  },
}
