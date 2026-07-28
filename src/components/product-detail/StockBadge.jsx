export function StockBadge({ inStock, stockCount }) {
  if (!inStock) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-900 dark:text-red-200">
        Out of stock
      </span>
    )
  }

  const isLowStock = stockCount <= 5

  return (
    <span
      className={`
        inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
        ${
          isLowStock
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
        }
      `}
    >
      {isLowStock ? `Only ${stockCount} left` : 'In stock'}
    </span>
  )
}