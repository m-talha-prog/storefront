import { Button } from '../ui/Button'

export function ProductCard({ product, layout = 'grid' }) {
  const isList = layout === 'list'

  return (
    <article
      className={`
        rounded-lg border border-gray-200 bg-white overflow-hidden
        dark:border-gray-700 dark:bg-gray-800
        ${isList ? 'flex gap-4' : 'flex flex-col'}
      `}
    >
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className={isList ? 'w-32 h-32 object-cover' : 'w-full h-40 object-cover'}
      />

      <div className="flex flex-col gap-1 p-3 flex-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {product.category}
        </span>

        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {product.name}
        </h3>

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
          variant="primary"
          disabled={!product.inStock}
          className="mt-2"
        >
          Add to Cart
        </Button>
      </div>
    </article>
  )
}