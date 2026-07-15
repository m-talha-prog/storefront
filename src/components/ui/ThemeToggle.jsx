import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <button
      type="button"
      onClick={() => setIsDark((prev) => !prev)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        rounded-md p-2 text-sm font-medium
        bg-gray-100 text-gray-900 hover:bg-gray-200
        dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      "
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}