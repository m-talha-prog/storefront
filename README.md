# Storefront — Weeks 1 & 2: Foundation, Catalog, Product Detail & Cart

A responsive, accessible e-commerce storefront built with React, Vite, and Tailwind CSS — backed by a mock API, with cart logic managed by an XState state machine and documented in Storybook.

## What I Built

### Week 1 — Foundation & Catalog
- **Mock API** using MSW (Mock Service Worker), serving 51 realistic products across 7 categories, with search and category filtering via query parameters.
- **UI primitives** — `Button` and `Input` components, built and documented in Storybook with full variant/state coverage and dark mode support.
- **Product catalog page** — mobile-first, responsive layout with debounced live search, category filtering, grid/list view toggle, and class-based dark mode.
- **Resilient UX states** — content-aware skeleton loaders, distinct empty states, and a React error boundary isolating the results grid from the rest of the page.

### Week 2 — Product Detail, Cart & Notifications
- **Accessible product detail page** with an image gallery using a **roving tabindex** keyboard-navigation pattern (arrow-key navigation between thumbnails, one tab-stop for the whole gallery).
- **Client-side routing** via React Router (`createBrowserRouter`), with a shared layout and nested routes for the catalog and product detail pages.
- **Shopping cart logic** managed by an **XState** state machine (`cartMachine.js`) — guarded transitions enforce stock limits on every quantity change, independent of any UI.
- **Cart UI** — a slide-out drawer with per-item quantity controls (stepper buttons + a validated text input), a subtotal, and a clear-cart action. Includes Escape-to-close, backdrop-click-to-close, and initial focus management.
- **Client-side quantity validation**, layered on top of (not replacing) the machine's own stock-limit guards — immediate, specific feedback in the UI backed by an authoritative source-of-truth check in the machine.
- **Toast notifications** — a fully generic, reusable toast system, connected to the cart via a small "bridge" component so neither system depends on the other.
- **Unit tests** for every cart machine transition (10 tests), run via Vitest, alongside Storybook's own story-based component tests (via `@storybook/addon-vitest` + Playwright) — all running from a single `npm run test` command.

## Tech Stack & Why

| Choice | Reasoning |
|---|---|
| **Vite + React** (not Next.js) | No SEO/SSR requirement; keeps iteration fast and avoids App Router complexity |
| **Tailwind CSS v4** | CSS-native config, fast Oxide engine, class-based dark mode via `@custom-variant` |
| **MSW over json-server** | Intercepts at the network level; same handlers work across dev, Storybook, and tests |
| **React Router v7** (`createBrowserRouter`) | Modern data-router pattern over the older `<BrowserRouter>`/`<Routes>` JSX style |
| **XState for the cart** | Cart logic has real *rules* (stock limits, valid quantity ranges) — guards make those rules structural and testable, not buried in `if` statements inside a reducer |
| **Vitest** | Vite-native test runner, reuses the existing Vite config with zero extra transpilation setup; supports running both plain logic tests and Storybook's browser-based story tests as separate "projects" from one command |

## Architecture Decisions

- **Debounced search (300ms) + `AbortController`** in data-fetching hooks: prevents a request per keystroke and prevents race conditions where a slow earlier request could overwrite a newer one's results.
- **Separate `useProduct` (singular) and `useProducts` (plural) hooks**: different shapes for different purposes — one product by ID vs. a filtered list — kept as two small, focused hooks rather than one hook with branching logic.
- **One XState state (`idle`) with rich guarded transitions**, rather than many top-level states: the cart doesn't have distinct "modes" — its complexity lives in *what changes are valid*, which guards express directly.
- **Two layers of quantity validation**: client-side input validation for immediate, specific UX feedback; the machine's own `clamp()` guards as the actual source of truth, regardless of how a change was requested (typed input vs. stepper buttons).
- **Toast system fully decoupled from the cart**, connected via a small headless "bridge" component (`CartToastBridge`) — keeps the toast system genuinely reusable for any future feature, and keeps the cart machine free of any UI concerns.
- **Error boundary scoped to just the results grid**, not the whole page — a rendering bug in one product shouldn't take down search and filters too.

## Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.jsx
│   ├── CartToastBridge.jsx
│   ├── ui/                     # Storybook-documented primitives
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── ThemeToggle.jsx
│   ├── catalog/
│   │   ├── ProductCard.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── ViewToggle.jsx
│   │   ├── ProductCardSkeleton.jsx
│   │   └── EmptyState.jsx
│   ├── product-detail/
│   │   ├── ImageGallery.jsx    # roving-tabindex keyboard navigation
│   │   └── StockBadge.jsx
│   ├── cart/
│   │   ├── CartIcon.jsx
│   │   ├── CartDrawer.jsx
│   │   └── CartLineItem.jsx    # quantity validation lives here
│   └── toast/
│       ├── Toast.jsx
│       └── ToastContainer.jsx
├── context/
│   ├── CartContext.jsx         # wraps the XState cart machine
│   └── ToastContext.jsx
├── machines/
│   ├── cartMachine.js
│   └── cartMachine.test.js
├── hooks/
│   ├── useDebounce.js
│   ├── useProduct.js
│   └── useProducts.js
├── mocks/
│   ├── data/products.js
│   ├── handlers.js
│   └── browser.js
├── pages/
│   ├── CatalogPage.jsx
│   └── ProductDetailPage.jsx
├── router.jsx
├── App.jsx
└── main.jsx
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

Opens at `http://localhost:6006`.

### Tests

```bash
npm run test
```

Runs two Vitest "projects" in one pass: plain unit tests for the cart state machine (`src/machines/cartMachine.test.js`), and Storybook's own story-based component tests (via headless Chromium/Playwright). First-time setup for the browser-based tests requires:

```bash
npx playwright install chromium
```

## Known Limitations / Next Steps

- Checkout flow is not yet implemented — the "Checkout" button in the cart drawer is a placeholder.
- Filtering is limited to category; price range and rating filters are visual placeholders for now.
- Dark mode preference isn't persisted across page reloads (no `localStorage` yet).
- The cart drawer manages initial focus and Escape-to-close, but does not yet fully trap Tab focus cycling within it — a further accessibility improvement planned.
- Product images are sourced from LoremFlickr (category-matched, freely embeddable placeholder photos) rather than a real product image library, appropriate for this mock-data stage of the project.
- A benign MSW console warning may appear related to the browser's own page-navigation request being intercepted by the service worker; this does not affect app functionality and does not occur in the production build (MSW is dev-only).

## Testing Manually

| Feature | How to verify |
|---|---|
| Search / filter / grid-list | Type a product name, click a category, toggle view |
| Dark mode | Click the theme toggle in the header |
| Product detail + gallery | Click into a product; use arrow keys on the thumbnails |
| Add to cart | Click "Add to Cart" from a card or the detail page; check the cart icon badge |
| Quantity validation | Open the cart drawer, try an invalid quantity (0, a decimal, above stock) |
| Toast notifications | Add an item (success toast); push a quantity past stock limit (error toast) |
| Cart drawer accessibility | Open via the icon, press Escape, click the backdrop |