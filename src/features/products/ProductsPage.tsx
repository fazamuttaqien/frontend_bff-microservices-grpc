import { useSearchParams } from 'react-router-dom'
import { ProductCard } from './ProductCard'
import { ProductEmpty, ProductError } from './ProductState'
import { ProductLoading } from './ProductLoading'
import { useProducts } from './useProducts'

const PAGE_SIZE = 20

export function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const rawPage = Number(params.get('page') ?? '1')
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
  const { products, total, loading, error, reload } = useProducts(page, PAGE_SIZE)
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const setPage = (nextPage: number) => {
    setParams(nextPage === 1 ? {} : { page: String(nextPage) })
  }

  return (
    <section className="page products-page">
      <header className="page__header">
        <div>
          <h1>Products</h1>
          <p>Browse products available from the catalog.</p>
        </div>
      </header>

      {loading ? (
        <ProductLoading />
      ) : error ? (
        <ProductError message={error} onAction={() => void reload()} />
      ) : products.length === 0 ? (
        <ProductEmpty />
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          {pageCount > 1 && (
            <nav className="pagination" aria-label="Product pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span>Page {page} of {pageCount}</span>
              <button disabled={page >= pageCount} onClick={() => setPage(page + 1)}>Next</button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}
