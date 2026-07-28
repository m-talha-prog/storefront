export function Toast({ type, message, onDismiss }) {
  const isError = type === 'error'

  return (
    <div
      role="status"
      className={`
        flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg min-w-[240px] max-w-sm
        ${
          isError
            ? 'bg-red-600 text-white'
            : 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
        }
      `}
    >
      <span aria-hidden="true">{isError ? '⚠️' : '✓'}</span>
      <p className="text-sm flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
      >
        ✕
      </button>
    </div>
  )
}