import { Button } from '../ui/Button'

export function ConfirmationStep({
  items,
  subtotal,
  shippingInfo,
  paymentInfo,
  error,
  isSubmitting,
  onPlaceOrder,
  onBack,
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Review &amp; confirm
      </h2>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Shipping to
        </h3>
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {shippingInfo?.fullName}, {shippingInfo?.address}, {shippingInfo?.city}{' '}
          {shippingInfo?.postalCode}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Payment
        </h3>
        <p className="text-sm text-gray-900 dark:text-gray-100">
          Card ending in {paymentInfo?.cardNumber?.slice(-4) || '••••'}
        </p>
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-4">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between py-2 text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              {item.name} × {item.quantity}
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={onPlaceOrder}
          isLoading={isSubmitting}
        >
          Place Order
        </Button>
      </div>
    </div>
  )
}