export function ViewToggle({ layout, onLayoutChange }) {
  return (
    <div
      role="group"
      aria-label="Product view layout"
      className="inline-flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => onLayoutChange('grid')}
        aria-pressed={layout === 'grid'}
        className={`
          px-3 py-1.5 text-sm font-medium
          ${
            layout === 'grid'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }
        `}
      >
        Grid
      </button>
      <button
        type="button"
        onClick={() => onLayoutChange('list')}
        aria-pressed={layout === 'list'}
        className={`
          px-3 py-1.5 text-sm font-medium border-l border-gray-300 dark:border-gray-600
          ${
            layout === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }
        `}
      >
        List
      </button>
    </div>
  )
}