import { Suspense, type ReactNode } from 'react'

import { RouteErrorBoundary } from './RouteErrorBoundary'
import { Skeleton } from './ui/skeleton'

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
