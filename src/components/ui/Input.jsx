import { useId } from 'react'

export function Input({
  label,
  error,
  helperText,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  ...rest
}) {
  const inputId = useId()
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`
          w-full rounded-md border px-3 py-2 text-sm
          bg-white text-gray-900 placeholder:text-gray-400
          dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-offset-1
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
          }
        `}
        {...rest}
      />

      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={helperId} className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
}