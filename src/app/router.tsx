import { Navigate, createBrowserRouter } from 'react-router-dom'
import { withFaroRouterInstrumentation } from '@grafana/faro-react'
import '@/observability/faro'
import { PlaceholderPage } from '@/components/PlaceholderPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { PublicOnlyRoute } from '@/features/auth/PublicOnlyRoute'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { RegisterPage } from '@/features/auth/RegisterPage'
import {
  CreateOrderPage,
  DashboardPage,
  LazyPage,
  OrderDetailPage,
  OrdersPage,
  ProductDetailPage,
  ProductsPage,
  ProfilePage,
} from './router-pages'
import { AppLayout } from './layouts/AppLayout'
import { PublicLayout } from './layouts/PublicLayout'

const reactBrowserRouter = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <PlaceholderPage title="Home" /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: (
              <LazyPage>
                <DashboardPage />
              </LazyPage>
            ),
          },
          {
            path: '/products',
            element: (
              <LazyPage>
                <ProductsPage />
              </LazyPage>
            ),
          },
          {
            path: '/products/:id',
            element: (
              <LazyPage>
                <ProductDetailPage />
              </LazyPage>
            ),
          },
          {
            path: '/orders',
            element: (
              <LazyPage>
                <OrdersPage />
              </LazyPage>
            ),
          },
          {
            path: '/orders/new',
            element: (
              <LazyPage>
                <CreateOrderPage />
              </LazyPage>
            ),
          },
          {
            path: '/orders/:id',
            element: (
              <LazyPage>
                <OrderDetailPage />
              </LazyPage>
            ),
          },
          {
            path: '/profile',
            element: (
              <LazyPage>
                <ProfilePage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export const router = withFaroRouterInstrumentation(reactBrowserRouter)
