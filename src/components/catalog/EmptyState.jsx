export function EmptyState({ variant = 'no-results', onClearFilters }) {
  const content = {
    'no-results': {
      title: 'No products match your search',
      description: 'Try a different search term or clear your filters.',
      showClearButton: true,
    },
    'no-products': {
      title: 'No products available',
      description: 'Check back later — new products are added regularly.',
      showClearButton: false,
    },
  }[variant]

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {content.title}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {content.description}
      </p>
      {content.showClearButton && onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-2 rounded text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Clear search and filters
        </button>
      )}
    </div>
  )
}