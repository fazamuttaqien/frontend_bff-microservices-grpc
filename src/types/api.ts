export interface ApiErrorResponse { error: string }

export interface User { id: string; name: string; email: string; created_at: string; updated_at: string }
export interface Product { id: string; name: string; description: string; price: string; stock: number; created_at: string; updated_at: string }
export interface ProductList { products: Product[]; total: number; page: number; page_size: number }
export interface OrderItem { product_id: string; quantity: number; price: string; total: string }
export interface Order { id: string; user_id: string; items: OrderItem[]; total: string; status: string; created_at: string; updated_at: string }
export interface OrderList { orders: Order[]; total: number; page: number; page_size: number }
export interface OrderDetail { order: Order; customer?: User; products: Product[]; partial_failures?: string[] }
export interface CreateOrderInput { items: Array<{ product_id: string; quantity: number }> }
