// Enforceable bundle size budgets, checked via `npm run size`.
// Paths use globs since Vite hashes output filenames per build — exact
// filenames aren't predictable, but the pattern (which chunk it is) is.
//
// These numbers are starting budgets based on this project's current
// dependencies (React, React Router, XState) — NOT including the 3D
// viewer's Three.js/R3F/drei chunk, which is intentionally excluded here
// since it's lazy-loaded separately and shouldn't count against the
// "must load before the app is usable" budget.
module.exports = [
  {
    name: 'Main app bundle (excludes lazy-loaded routes and 3D viewer)',
    path: 'dist/assets/index-*.js',
    limit: '180 KB',
  },
  {
    name: 'Catalog route chunk',
    path: 'dist/assets/CatalogPage-*.js',
    limit: '40 KB',
  },
  {
    name: 'Product detail route chunk (excludes 3D viewer)',
    path: 'dist/assets/ProductDetailPage-*.js',
    limit: '40 KB',
  },
  {
    name: 'Checkout route chunk',
    path: 'dist/assets/CheckoutPage-*.js',
    limit: '50 KB',
  },
  {
    name: 'Main CSS bundle',
    path: 'dist/assets/index-*.css',
    limit: '30 KB',
  },
  {
  name: 'Shared vendor chunk (React Router + XState + cart logic)',
  path: 'dist/assets/Button-*.js',
  limit: '50 KB',
  }
]
