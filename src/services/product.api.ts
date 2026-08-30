import { request } from '../lib/api'
import type { Product, ProductList } from '../types/api'

export const productApi = {
  list: (page = 1, pageSize = 20) => request<ProductList>(`/api/v1/products?page=${page}&page_size=${pageSize}`),
  get: (id: string) => request<Product>(`/api/v1/products/${encodeURIComponent(id)}`),
}
