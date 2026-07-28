import { useState } from 'react'
import { useCart } from '../../context/CartContext'

export function CartLineItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  // Local, uncommitted text the user is typing — separate from item.quantity,
  // which is the last CONFIRMED value the machine actually holds.
  const [inputValue, setInputValue] = useState(String(item.quantity))
  const [validationError, setValidationError] = useState(null)

  function validate(rawValue) {
    const trimmed = rawValue.trim()

    if (trimmed === '') {
      return 'Quantity is required'
    }

    const parsed = Number(trimmed)

    if (!Number.isInteger(parsed)) {
      return 'Enter a whole number'
    }

    if (parsed < 1) {
      return 'Minimum quantity is 1'
    }

    if (parsed > item.stockCount) {
      return `Only ${item.stockCount} in stock`
    }

    return null
  }

  function commitChange(rawValue) {
    const error = validate(rawValue)
    setValidationError(error)

    if (!error) {
      updateQuantity(item.id, Number(rawValue.trim()))
    }
  }

  function handleStep(delta) {
    const nextValue = item.quantity + delta
    setInputValue(String(nextValue))
    commitChange(String(nextValue))
  }

  return (
    <li className="flex gap-3 py-4 border-b border-gray-200 dark:border-gray-700">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-md object-cover shrink-0"
      />

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {item.name}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ${item.price.toFixed(2)} each
        </span>

        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={item.quantity <= 1}
            aria-label={`Decrease quantity of ${item.name}`}
            className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            −
          </button>

          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => commitChange(inputValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur()
              }
            }}
            aria-label={`Quantity for ${item.name}`}
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? `${item.id}-qty-error` : undefined}
            className={`
              w-12 text-center text-sm rounded border py-1
              bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
              ${
                validationError
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus-visible:ring-blue-500'
              }
            `}
          />

          <button
            type="button"
            onClick={() => handleStep(1)}
            disabled={item.quantity >= item.stockCount}
            aria-label={`Increase quantity of ${item.name}`}
            className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            +
          </button>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="ml-2 text-xs text-red-600 dark:text-red-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
          >
            Remove
          </button>
        </div>

        {validationError && (
          <p
            id={`${item.id}-qty-error`}
            className="text-xs text-red-600 dark:text-red-400 mt-1"
          >
            {validationError}
          </p>
        )}
      </div>

      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0">
        ${(item.price * item.quantity).toFixed(2)}
      </span>
    </li>
  )
}