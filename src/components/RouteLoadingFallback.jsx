export function RouteLoadingFallback() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex items-center justify-center py-24"
    >
      <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400 animate-spin" />
    </div>
  )
}