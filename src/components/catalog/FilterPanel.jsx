import { CATEGORIES } from '../../mocks/data/products'

export function FilterPanel({ selectedCategory, onCategoryChange }) {
  return (
    <aside
      aria-label="Product filters"
      className="w-full sm:w-56 shrink-0 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
    >
      <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
        Category
      </h2>

      <ul className="flex flex-col gap-1" role="list">
        <li>
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            aria-pressed={selectedCategory === null}
            className={`
              w-full text-left px-2 py-1.5 rounded text-sm
              ${
                selectedCategory === null
                  ? 'bg-blue-100 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            All Categories
          </button>
        </li>

        {CATEGORIES.map((category) => (
          <li key={category}>
            <button
              type="button"
              onClick={() => onCategoryChange(category)}
              aria-pressed={selectedCategory === category}
              className={`
                w-full text-left px-2 py-1.5 rounded text-sm
                ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }
              `}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}