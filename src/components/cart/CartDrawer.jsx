import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { CartLineItem } from './CartLineItem'
import { Button } from '../ui/Button'

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, clearCart } = useCart()
  const closeButtonRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeCart()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeCart])

  function handleCheckout() {
    closeCart()
    navigate('/checkout')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="relative w-full sm:w-96 h-full bg-white dark:bg-gray-900 shadow-xl flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Your Cart
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-12">
              Your cart is empty.
            </p>
          ) : (
            <ul>
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-gray-100">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <Button variant="primary" size="md" className="w-full" onClick={handleCheckout}>
              Checkout
            </Button>

            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-gray-500 hover:underline dark:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded self-center"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}