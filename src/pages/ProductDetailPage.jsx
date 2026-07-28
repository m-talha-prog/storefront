import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { ImageGallery } from '../components/product-detail/ImageGallery'
import { StockBadge } from '../components/product-detail/StockBadge'
import { Button } from '../components/ui/Button'
import { useCart } from '../context/CartContext'

export function ProductDetailPage() {
  const params = useParams()
  const productId = params.id

  const { product, status, error } = useProduct(productId)
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)

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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <Link
        to="/"
        className="inline-block mb-4 text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to catalog
      </Link>

      <div className="grid sm:grid-cols-2 gap-8">
        <ImageGallery images={product.images} productName={product.name} />

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

          <StockBadge inStock={product.inStock} stockCount={product.stockCount} />

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {product.description}
          </p>

          <Button
            variant={justAdded ? 'secondary' : 'primary'}
            size="lg"
            disabled={!product.inStock}
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