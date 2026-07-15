export function ProductCardSkeleton({ layout = 'grid' }) {
  const isList = layout === 'list'

  return (
    <div
      aria-hidden="true"
      className={`
        rounded-lg border border-gray-200 bg-white overflow-hidden animate-pulse
        dark:border-gray-700 dark:bg-gray-800
        ${isList ? 'flex gap-4' : 'flex flex-col'}
      `}
    >
      <div
        className={`
          bg-gray-200 dark:bg-gray-700
          ${isList ? 'w-32 h-32 shrink-0' : 'w-full h-40'}
        `}
      />

      <div className="flex flex-col gap-2 p-3 flex-1">
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
        <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded mt-2" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ layout = 'grid', count = 6 }) {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className={
        layout === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 gap-4'
          : 'flex flex-col gap-4'
      }
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} layout={layout} />
      ))}
    </div>
  )
}