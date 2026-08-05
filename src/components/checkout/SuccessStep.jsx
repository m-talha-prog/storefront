import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function SuccessStep({ orderId }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4" aria-hidden="true">
        ✓
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Order confirmed!
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Your order <span className="font-mono">{orderId}</span> has been placed.
      </p>
      <Link to="/">
        <Button variant="primary">Continue Shopping</Button>
      </Link>
    </div>
  )
}