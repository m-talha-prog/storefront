import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import App from './App.jsx'

// Same React.lazy() + named-export remap pattern used for ProductViewer3D
// in Week 5 — kept consistent rather than introducing a second, different
// lazy-loading mechanism (React Router also has its own `lazy` route
// property, but using two different systems for the same underlying idea
// would add confusion without adding real benefit here).
const CatalogPage = lazy(() =>
  import('./pages/CatalogPage.jsx').then((m) => ({ default: m.CatalogPage }))
)
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage.jsx').then((m) => ({
    default: m.ProductDetailPage,
  }))
)
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage.jsx').then((m) => ({ default: m.CheckoutPage }))
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
    ],
  },
])