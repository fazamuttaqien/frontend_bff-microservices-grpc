import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { LoginPage } from '../features/auth/LoginPage'
import { PublicOnlyRoute } from '../features/auth/PublicOnlyRoute'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'
import { RegisterPage } from '../features/auth/RegisterPage'
import { AppLayout } from './layouts/AppLayout'
import { PublicLayout } from './layouts/PublicLayout'

export const router = createBrowserRouter([
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
            element: <PlaceholderPage title="Dashboard" />,
          },
          { path: '/products', element: <PlaceholderPage title="Products" /> },
          {
            path: '/products/:id',
            element: <PlaceholderPage title="Product Detail" />,
          },
          { path: '/orders', element: <PlaceholderPage title="Orders" /> },
          {
            path: '/orders/:id',
            element: <PlaceholderPage title="Order Detail" />,
          },
          { path: '/profile', element: <PlaceholderPage title="Profile" /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
