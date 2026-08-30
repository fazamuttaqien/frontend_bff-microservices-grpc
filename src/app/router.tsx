import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { PlaceholderPage } from '../components/PlaceholderPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <PlaceholderPage title="Home" /> },
      { path: '/login', element: <PlaceholderPage title="Login" /> },
      { path: '/register', element: <PlaceholderPage title="Register" /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <PlaceholderPage title="Dashboard" /> },
      { path: '/products', element: <PlaceholderPage title="Products" /> },
      { path: '/products/:id', element: <PlaceholderPage title="Product Detail" /> },
      { path: '/orders', element: <PlaceholderPage title="Orders" /> },
      { path: '/orders/:id', element: <PlaceholderPage title="Order Detail" /> },
      { path: '/profile', element: <PlaceholderPage title="Profile" /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export function RootOutlet() {
  return <Outlet />
}
