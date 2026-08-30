import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ProductCard } from './ProductCard'
import { ProductEmpty, ProductError } from './ProductState'
import { ProductLoading } from './ProductLoading'
import { useProducts } from './useProducts'

const PAGE_SIZE = 20

export function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const rawPage = Number(params.get('page') ?? '1')
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
  const { products, total, loading, error, reload } = useProducts(
    page,
    PAGE_SIZE,
  )
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const setPage = (nextPage: number) => {
    setParams(nextPage === 1 ? {} : { page: String(nextPage) })
  }

  return (
    <section className="mx-auto w-full max-w-275 px-5 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="mt-2 text-muted-foreground">
          Browse products available from the catalog.
        </p>
      </header>

      {loading ? (
        <ProductLoading />
      ) : error ? (
        <ProductError message={error} onAction={() => void reload()} />
      ) : products.length === 0 ? (
        <ProductEmpty />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {pageCount > 1 && (
            <nav
              className="mt-7 flex flex-wrap items-center justify-center gap-4"
              aria-label="Product pagination"
            >
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span
                className="text-sm text-muted-foreground"
                aria-live="polite"
              >
                Page {page} of {pageCount}
              </span>
              <Button
                variant="outline"
                disabled={page >= pageCount}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}
