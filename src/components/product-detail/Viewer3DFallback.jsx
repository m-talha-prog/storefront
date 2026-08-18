export function Viewer3DFallback({ onBackToPhotos }) {
  return (
    <div className="h-96 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-center gap-2 p-6">
      <span aria-hidden="true" className="text-3xl">
        🖼️
      </span>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        3D preview isn't available on this device or browser
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
        Your browser doesn't support WebGL, which the interactive 3D view
        requires.
      </p>
      {onBackToPhotos && (
        <button
          type="button"
          onClick={onBackToPhotos}
          className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          View photos instead
        </button>
      )}
    </div>
  )
}