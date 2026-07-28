import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CatalogPage } from './pages/CatalogPage.jsx'
import { ProductDetailPage } from './pages/ProductDetailPage.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
    ],
  },
])