import { lazy } from 'react'

export const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })))
export const ProductsPage = lazy(() => import('../features/products/ProductsPage').then((m) => ({ default: m.ProductsPage })))
export const ProductDetailPage = lazy(() => import('../features/products/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))
export const OrdersPage = lazy(() => import('../features/orders/OrdersPage').then((m) => ({ default: m.OrdersPage })))
export const CreateOrderPage = lazy(() => import('../features/orders/CreateOrderPage').then((m) => ({ default: m.CreateOrderPage })))
export const OrderDetailPage = lazy(() => import('../features/orders/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })))
export const ProfilePage = lazy(() => import('../features/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })))
