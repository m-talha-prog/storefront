import { Outlet, Link } from 'react-router-dom'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { CartIcon } from './components/cart/CartIcon'
import { CartDrawer } from './components/cart/CartDrawer'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { CartToastBridge } from './components/CartToastBridge'

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <CartToastBridge />

        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="flex items-center justify-between max-w-6xl mx-auto p-4 sm:p-6">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Storefront
            </Link>
            <div className="flex items-center gap-3">
              <CartIcon />
              <ThemeToggle />
            </div>
          </header>

          <Outlet />
          <CartDrawer />
        </div>
      </CartProvider>
    </ToastProvider>
  )
}

export default App