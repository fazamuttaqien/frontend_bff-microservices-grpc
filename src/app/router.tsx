import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { RouteErrorBoundary } from '../components/RouteErrorBoundary'
import { LoginPage } from '../features/auth/LoginPage'
import { PublicOnlyRoute } from '../features/auth/PublicOnlyRoute'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'
import { RegisterPage } from '../features/auth/RegisterPage'
import { AppLayout } from './layouts/AppLayout'
import { PublicLayout } from './layouts/PublicLayout'

const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const ProductsPage = lazy(() => import('../features/products/ProductsPage').then((m) => ({ default: m.ProductsPage })))
const ProductDetailPage = lazy(() => import('../features/products/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))
const OrdersPage = lazy(() => import('../features/orders/OrdersPage').then((m) => ({ default: m.OrdersPage })))
const CreateOrderPage = lazy(() => import('../features/orders/CreateOrderPage').then((m) => ({ default: m.CreateOrderPage })))
const OrderDetailPage = lazy(() => import('../features/orders/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })))
const ProfilePage = lazy(() => import('../features/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })))

function LazyPage({ children }: { children: ReactNode }) {
  return <RouteErrorBoundary><Suspense fallback={<div role="status" aria-live="polite">Loading page…</div>}>{children}</Suspense></RouteErrorBoundary>
}

export const router = createBrowserRouter([
  { element: <PublicOnlyRoute />, children: [{ element: <PublicLayout />, children: [
    { path: '/', element: <PlaceholderPage title="Home" /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
  ] }] },
  { element: <ProtectedRoute />, children: [{ element: <AppLayout />, children: [
    { path: '/dashboard', element: <LazyPage><DashboardPage /></LazyPage> },
    { path: '/products', element: <LazyPage><ProductsPage /></LazyPage> },
    { path: '/products/:id', element: <LazyPage><ProductDetailPage /></LazyPage> },
    { path: '/orders', element: <LazyPage><OrdersPage /></LazyPage> },
    { path: '/orders/new', element: <LazyPage><CreateOrderPage /></LazyPage> },
    { path: '/orders/:id', element: <LazyPage><OrderDetailPage /></LazyPage> },
    { path: '/profile', element: <LazyPage><ProfilePage /></LazyPage> },
  ] }] },
  { path: '*', element: <Navigate to="/" replace /> },
])
