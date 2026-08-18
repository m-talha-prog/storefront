export function Viewer3DSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading 3D viewer"
      className="h-96 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center animate-pulse"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-gray-700" />
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Loading 3D viewer…
        </p>
      </div>
    </div>
  )
}