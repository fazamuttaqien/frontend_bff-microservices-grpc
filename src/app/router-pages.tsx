import { lazy, Suspense, type ReactNode } from 'react'

import { RouteErrorBoundary } from '@/components/RouteErrorBoundary'
import { Skeleton } from '@/components/ui/skeleton'

export const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
)

export const ProductsPage = lazy(() =>
  import('@/features/products/ProductsPage').then((m) => ({
    default: m.ProductsPage,
  })),
)

export const ProductDetailPage = lazy(() =>
  import('@/features/products/ProductDetailPage').then((m) => ({
    default: m.ProductDetailPage,
  })),
)

export const OrdersPage = lazy(() =>
  import('@/features/orders/OrdersPage').then((m) => ({
    default: m.OrdersPage,
  })),
)

export const CreateOrderPage = lazy(() =>
  import('@/features/orders/CreateOrderPage').then((m) => ({
    default: m.CreateOrderPage,
  })),
)

export const OrderDetailPage = lazy(() =>
  import('@/features/orders/OrderDetailPage').then((m) => ({
    default: m.OrderDetailPage,
  })),
)

export const ProfilePage = lazy(() =>
  import('@/features/profile/ProfilePage').then((m) => ({
    default: m.ProfilePage,
  })),
)

export function LazyPage({ children }: { children: ReactNode }) {
  return (
    <RouteErrorBoundary>
      <Suspense
        fallback={
          <main
            className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
            role="status"
            aria-live="polite"
            aria-label="Loading page"
          >
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-36" />
              <Skeleton className="h-36" />
              <Skeleton className="h-36" />
            </div>
            <Skeleton className="h-64 w-full" />
          </main>
        }
      >
        {children}
      </Suspense>
    </RouteErrorBoundary>
  )
}
