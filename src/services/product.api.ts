import { apiRequest } from '../lib/api-client'
import type { Product, ProductList } from '../types/api'

export const productApi = {
  list: (page = 1, pageSize = 20) =>
    apiRequest<ProductList>({
      url: '/api/v1/products',
      method: 'GET',
      params: { page, page_size: pageSize },
    }),
  get: (id: string) =>
    apiRequest<Product>({
      url: `/api/v1/products/${encodeURIComponent(id)}`,
      method: 'GET',
    }),
}
