import { Skeleton } from '../../components/ui/skeleton'

export function ProductLoading({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          className="flex min-h-48 flex-col gap-5 rounded-xl border p-6"
          key={index}
        >
          <Skeleton className="h-6 w-[65%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[45%]" />
        </div>
      ))}
    </div>
  )
}
