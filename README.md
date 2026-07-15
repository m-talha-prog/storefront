# Storefront — Week 1: Foundation & Catalog

A responsive, accessible e-commerce product catalog built with React, Vite, and Tailwind CSS, backed by a mock API and documented in Storybook.

## What I Built

This week's deliverable covers the foundation of a production-grade storefront:

- **Mock API** using MSW (Mock Service Worker), serving 51 realistic products across 7 categories (Electronics, Clothing, Home & Kitchen, Sports & Outdoors, Books, Beauty, Toys), with support for search and category filtering via query parameters.
- **UI primitives** — `Button` and `Input` components, built and documented in Storybook with full variant/state coverage (loading, disabled, error) and dark mode support.
- **Product catalog page** — mobile-first, responsive layout with:
  - Debounced live search
  - Category filtering
  - Grid/list view toggle
  - Dark mode (class-based, toggleable independent of OS setting)
- **Resilient UX states**:
  - Content-aware skeleton loaders (matching the real card layout, to avoid layout shift)
  - Distinct empty states for "no products exist" vs. "search matched nothing"
  - A React error boundary isolating the results grid from the rest of the page

## Tech Stack & Why

| Choice | Reasoning |
|---|---|
| **Vite + React** (not Next.js) | No SEO/SSR requirement this week; Vite keeps iteration fast and avoids App Router complexity while focusing on core frontend engineering skills |
| **Tailwind CSS v4** | CSS-native config (no `tailwind.config.js`), fast Oxide engine, class-based dark mode via `@custom-variant` |
| **MSW over json-server** | Intercepts at the network level, so the app calls real-shaped `fetch()` requests; the same handlers work across dev, Storybook, and future tests without a second running process |
| **Storybook** | Isolates UI primitives from app logic, enabling independent testing/documentation of every visual state |

## Architecture Decisions

- **Debounced search (300ms) + `AbortController`**: prevents firing a request per keystroke and prevents race conditions where a slow earlier request could overwrite a newer one's results.
- **Separate `useDebounce` and `useProducts` hooks**: single-responsibility — debouncing logic is generic and reusable; data-fetching logic knows nothing about timing.
- **Status-based data states (`idle`/`loading`/`success`/`error`)** rather than boolean flags: scales cleanly to real UI needs (skeleton vs. empty vs. error are all distinct states, not combinations of booleans).
- **Error boundary as a class component**: React's `getDerivedStateFromError`/`componentDidCatch` lifecycle methods have no hook equivalent yet; the boundary wraps only the results grid (not the whole page), so a rendering bug in one product doesn't take down search/filters too.

## Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.jsx
│   ├── ui/                  # Storybook-documented primitives
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── ThemeToggle.jsx
│   └── catalog/
│       ├── ProductCard.jsx
│       ├── FilterPanel.jsx
│       ├── ViewToggle.jsx
│       ├── ProductCardSkeleton.jsx
│       └── EmptyState.jsx
├── hooks/
│   ├── useDebounce.js
│   └── useProducts.js
├── mocks/
│   ├── data/products.js
│   ├── handlers.js
│   └── browser.js
├── pages/
│   └── CatalogPage.jsx
└── App.jsx
```

## Running the Project

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

### Storybook

```bash
npm run storybook
```

Opens at `http://localhost:6006`, showing all documented states of `Button` and `Input`.

## Known Limitations / Next Steps

- Cart functionality, checkout flow, and product detail pages are scoped for later weeks.
- Filtering is limited to category; price range and rating filters are visual placeholders for now.
- Dark mode preference isn't persisted across page reloads (no `localStorage` yet) — a deliberate scope cut for Week 1, planned as a follow-up.
- A benign MSW console warning may appear related to the browser's own page-navigation request being intercepted by the service worker; this does not affect app functionality and does not occur in the production build (MSW is dev-only).

## Testing Manually

| Feature | How to verify |
|---|---|
| Search | Type a product name — results narrow after a brief pause |
| Category filter | Click any category in the sidebar |
| Grid/List toggle | Click "Grid" or "List" above the results |
| Dark mode | Click the theme toggle in the header |
| Empty state | Search for a nonsense term |
| Skeleton loading | Throttle network speed in DevTools, then reload |
