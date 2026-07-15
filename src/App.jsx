import { CatalogPage } from './pages/CatalogPage'
import { ThemeToggle } from './components/ui/ThemeToggle'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Storefront
        </h1>
        <ThemeToggle />
      </header>

      <CatalogPage />
    </div>
  )
}

export default App