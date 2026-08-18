import { useState, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { ImageGallery } from '../components/product-detail/ImageGallery'
import { StockBadge } from '../components/product-detail/StockBadge'
import { Viewer3DSkeleton } from '../components/product-detail/Viewer3DSkeleton'
import { Viewer3DFallback } from '../components/product-detail/Viewer3DFallback'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Button } from '../components/ui/Button'
import { useCart } from '../context/CartContext'
import { useInventory } from '../context/InventoryContext'
import { isWebGLAvailable } from '../utils/webgl'

const ProductViewer3D = lazy(() =>
  import('../components/product-detail/ProductViewer3D').then((module) => ({
    default: module.ProductViewer3D,
  }))
)

export function ProductDetailPage() {
  const params = useParams()
  const productId = params.id

  const { product, status, error } = useProduct(productId)
  const { addItem } = useCart()
  const { getLiveStock } = useInventory()
  const [justAdded, setJustAdded] = useState(false)
  const [viewMode, setViewMode] = useState('photos') // 'photos' | '3d'

  // Computed once per mount — WebGL support doesn't change mid-session, so
  // there's no reason to re-check it on every render.
  const [webglSupported] = useState(() => isWebGLAvailable())

  function handleAddToCart() {
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  if (status === 'loading' || status === 'idle' || !product) {
    return <p className="max-w-6xl mx-auto p-6">Loading product...</p>
  }

  if (status === 'error') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">
          Back to catalog
        </Link>
      </div>
    )
  }

  const liveStock = getLiveStock(product)

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <Link
        to="/"
        className="inline-block mb-4 text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to catalog
      </Link>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          {/* Don't offer an option that will never work — the toggle only
              appears at all when WebGL is genuinely available. */}
          {webglSupported && (
            <div
              role="group"
              aria-label="Product view mode"
              className="inline-flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden mb-3"
            >
              <button
                type="button"
                onClick={() => setViewMode('photos')}
                aria-pressed={viewMode === 'photos'}
                className={`px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  viewMode === 'photos'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Photos
              </button>
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                aria-pressed={viewMode === '3d'}
                className={`px-3 py-1.5 text-sm font-medium border-l border-gray-300 dark:border-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  viewMode === '3d'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                3D View
              </button>
            </div>
          )}

          {viewMode === '3d' && webglSupported ? (
            <>
              <ErrorBoundary
                fallback={
                  <Viewer3DFallback onBackToPhotos={() => setViewMode('photos')} />
                }
              >
                <Suspense fallback={<Viewer3DSkeleton />}>
                  <ProductViewer3D imageUrl={product.image} productName={product.name} />
                </Suspense>
              </ErrorBoundary>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Drag to rotate • Scroll to zoom • Click the viewer, then use
                arrow keys to rotate and +/− to zoom
              </p>
            </>
          ) : (
            <ImageGallery images={product.images} productName={product.name} />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {product.category}
          </span>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span aria-hidden="true">★</span>
            <span>{product.rating}</span>
            <span className="text-gray-400">({product.reviewCount} reviews)</span>
          </div>

          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            ${product.price.toFixed(2)}
          </p>

          <StockBadge product={product} />

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {product.description}
          </p>

          <Button
            variant={justAdded ? 'secondary' : 'primary'}
            size="lg"
            disabled={liveStock <= 0}
            onClick={handleAddToCart}
            className="mt-4 self-start"
          >
            {justAdded ? '✓ Added to Cart' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}