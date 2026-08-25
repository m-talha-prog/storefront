import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useCart } from '../../context/CartContext'
import { getResponsiveImageProps, CARD_IMAGE_WIDTHS } from '../../utils/responsiveImage'

export function ProductCard({ product, layout = 'grid', priority = false }) {
  const isList = layout === 'list'
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  function handleAddToCart() {
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <article
      className={`
        rounded-lg border border-gray-200 bg-white overflow-hidden
        dark:border-gray-700 dark:bg-gray-800
        ${isList ? 'flex gap-4' : 'flex flex-col'}
      `}
    >
      <Link to={`/products/${product.id}`} className={isList ? 'shrink-0' : ''}>
        <img
          {...getResponsiveImageProps(
            product.image,
            CARD_IMAGE_WIDTHS,
            isList ? '128px' : '(min-width: 640px) 33vw, 50vw'
          )}
          alt={product.name}
          width={isList ? 128 : 320}
          height={isList ? 128 : 160}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className={isList ? 'w-32 h-32 object-cover' : 'w-full h-40 object-cover'}
        />
      </Link>

      <div className="flex flex-col gap-1 p-3 flex-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {product.category}
        </span>

        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 hover:underline">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
          <span aria-hidden="true">★</span>
          <span>{product.rating}</span>
          <span className="text-gray-400">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            ${product.price.toFixed(2)}
          </span>

          {!product.inStock && (
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              Out of stock
            </span>
          )}
        </div>

        <Button
          size="sm"
          variant={justAdded ? 'secondary' : 'primary'}
          disabled={!product.inStock}
          onClick={handleAddToCart}
          className="mt-2"
        >
          {justAdded ? '✓ Added' : 'Add to Cart'}
        </Button>
      </div>
    </article>
  )
}