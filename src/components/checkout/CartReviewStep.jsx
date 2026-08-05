import { Button } from '../ui/Button'

export function CartReviewStep({ items, subtotal, onProceed }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Your cart is empty — add something before checking out.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Review your order
      </h2>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-4">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between py-3 text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <Button variant="primary" size="lg" onClick={onProceed} className="w-full">
        Continue to Shipping
      </Button>
    </div>
  )
}