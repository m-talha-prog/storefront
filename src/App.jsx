import { Outlet, Link } from 'react-router-dom'
import { Suspense } from 'react'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { CartIcon } from './components/cart/CartIcon'
import { CartDrawer } from './components/cart/CartDrawer'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { InventoryProvider } from './context/InventoryContext'
import { CartToastBridge } from './components/CartToastBridge'
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt'
import { ConnectionStatusIndicator } from './components/inventory/ConnectionStatusIndicator'
import { RouteLoadingFallback } from './components/RouteLoadingFallback'

function App() {
  return (
    <InventoryProvider>
      <ToastProvider>
        <CartProvider>
          <CartToastBridge />
          <PWAUpdatePrompt />

          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="flex items-center justify-between max-w-6xl mx-auto p-4 sm:p-6">
              <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Storefront
              </Link>
              <div className="flex items-center gap-4">
                <ConnectionStatusIndicator />
                <CartIcon />
                <ThemeToggle />
              </div>
            </header>

            <Suspense fallback={<RouteLoadingFallback />}>
              <Outlet />
            </Suspense>
            <CartDrawer />
          </div>
        </CartProvider>
      </ToastProvider>
    </InventoryProvider>
  )
}

export default App