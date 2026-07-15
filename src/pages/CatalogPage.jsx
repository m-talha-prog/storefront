import { useState } from 'react'
import { Input } from '../components/ui/Input'
import { ProductCard } from '../components/catalog/ProductCard'
import { FilterPanel } from '../components/catalog/FilterPanel'
import { ViewToggle } from '../components/catalog/ViewToggle'
import { ProductGridSkeleton } from '../components/catalog/ProductCardSkeleton'
import { EmptyState } from '../components/catalog/EmptyState'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useDebounce } from '../hooks/useDebounce'
import { useProducts } from '../hooks/useProducts'

export function CatalogPage() {
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState(null)
  const [layout, setLayout] = useState('grid')

  const debouncedSearch = useDebounce(searchInput, 300)

  const { products, status, error } = useProducts({
    search: debouncedSearch,
    category,
  })

  const hasActiveFilters = Boolean(debouncedSearch) || Boolean(category)

  function handleClearFilters() {
    setSearchInput('')
    setCategory(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            label="Search products"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="sm:self-end">
          <ViewToggle layout={layout} onLayoutChange={setLayout} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <FilterPanel selectedCategory={category} onCategoryChange={setCategory} />

        <main className="flex-1" aria-live="polite" aria-busy={status === 'loading'}>
          <ErrorBoundary>
            {status === 'loading' && (
              <ProductGridSkeleton layout={layout} count={6} />
            )}

            {status === 'error' && (
              <p className="text-red-600 dark:text-red-400">
                Something went wrong: {error}
              </p>
            )}

            {status === 'success' && products.length === 0 && (
              <EmptyState
                variant={hasActiveFilters ? 'no-results' : 'no-products'}
                onClearFilters={handleClearFilters}
              />
            )}

            {status === 'success' && products.length > 0 && (
              <div
                className={
                  layout === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 gap-4'
                    : 'flex flex-col gap-4'
                }
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} layout={layout} />
                ))}
              </div>
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}