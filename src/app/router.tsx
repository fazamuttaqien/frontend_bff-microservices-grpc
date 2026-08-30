import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { LoginPage } from '../features/auth/LoginPage'
import { PublicOnlyRoute } from '../features/auth/PublicOnlyRoute'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'
import { RegisterPage } from '../features/auth/RegisterPage'
import { ProfilePage } from '../features/profile/ProfilePage'
import { ProductDetailPage } from '../features/products/ProductDetailPage'
import { ProductsPage } from '../features/products/ProductsPage'
import { CreateOrderPage } from '../features/orders/CreateOrderPage'
import { OrderDetailPage } from '../features/orders/OrderDetailPage'
import { OrdersPage } from '../features/orders/OrdersPage'
import { AppLayout } from './layouts/AppLayout'
import { PublicLayout } from './layouts/PublicLayout'

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [{ element: <PublicLayout />, children: [
      { path: '/', element: <PlaceholderPage title="Home" /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ] }],
  },
  {
    element: <ProtectedRoute />,
    children: [{ element: <AppLayout />, children: [
      { path: '/dashboard', element: <PlaceholderPage title="Dashboard" /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:id', element: <ProductDetailPage /> },
      { path: '/orders', element: <OrdersPage /> },
      { path: '/orders/new', element: <CreateOrderPage /> },
      { path: '/orders/:id', element: <OrderDetailPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ] }],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
