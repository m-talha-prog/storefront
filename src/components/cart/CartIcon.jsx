import { useCart } from '../../context/CartContext'

export function CartIcon() {
  const { itemCount, toggleCart } = useCart()

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
      className="relative inline-flex items-center rounded-md p-2 text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <span aria-hidden="true">🛒</span>
      {itemCount > 0 && (
        <span
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
          aria-hidden="true"
        >
          {itemCount}
        </span>
      )}
    </button>
  )
}