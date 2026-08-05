# Storefront — Weeks 1–3: Foundation, Catalog, Cart, Checkout & Optimistic UI

A responsive, accessible e-commerce storefront built with React, Vite, and Tailwind CSS — backed by a mock API, with cart and checkout logic managed by XState, optimistic UI updates with automatic rollback, and comprehensive client-side validation.

## What I Built

### Week 1 — Foundation & Catalog
- **Mock API** using MSW, serving 51 realistic products across 7 categories, with search and category filtering.
- **UI primitives** — `Button` and `Input`, documented in Storybook with full variant/state coverage and dark mode.
- **Product catalog page** — responsive, debounced search, category filtering, grid/list toggle, dark mode.
- **Resilient UX states** — skeleton loaders, empty states, and a scoped React error boundary.

### Week 2 — Product Detail, Cart & Notifications
- **Accessible product detail page** with a roving-tabindex image gallery.
- **Client-side routing** via React Router (`createBrowserRouter`).
- **Shopping cart logic** managed by an **XState** machine — guarded transitions enforce stock limits.
- **Cart UI** — slide-out drawer, quantity stepper + validated text input, Escape/backdrop-to-close.
- **Toast notifications** — generic, reusable system connected to the cart via a decoupled bridge component.
- **Unit tests** for every cart machine transition, run via Vitest alongside Storybook's own story-based tests.

### Week 3 — Optimistic UI & Checkout

**Task 1 — Optimistic UI updates with automatic rollback**
Cart mutations (add, remove, update quantity) now apply instantly and separately attempt to sync to a mock server endpoint (`POST /api/cart/sync`, deliberately unreliable — fails ~20% of the time to genuinely exercise the rollback path, not just the happy path). On failure, the change is automatically reverted and an error toast explains what happened. The mechanism itself lives in a small, pure, dependency-injected helper (`performOptimisticUpdate`), decoupled from React, the cart machine, and `fetch` specifically — which is what made Task 5's unit tests possible without a real network or a rendered component.

**Task 2 — Multi-step checkout flow governed by XState**
A second, independent state machine (`checkoutMachine.js`) drives Cart → Shipping → Payment → Confirmation → Submitting → Success. Unlike the cart machine's "one state, many guards" shape, checkout genuinely has sequential modes — so this machine uses many named states instead, each only responding to the events that make sense for that step. Order submission (`POST /api/orders`) is handled via an XState `invoke`d actor (`fromPromise`), with `onDone`/`onError` routing to success or back to a reviewable confirmation screen with an error message.

**Task 3 — Comprehensive client-side form validation**
Shipping and payment forms use a generic, reusable `useFormValidation` hook (built once, used by both forms) backed by pure, composable validator functions — required fields, minimum lengths, postal code format, expiry-date validity (including rejecting already-expired dates), and card number validation via the **Luhn checksum algorithm**. Errors appear progressively (only after a field has been interacted with, not on first render) and are fully wired for accessibility (`aria-invalid`, `aria-describedby`).

**Task 4 — Responsive testing across breakpoints**
Verified cart and checkout interactions at mobile (< 640px), the `sm`/`md`/`lg` breakpoint boundaries, and desktop widths. Found and fixed a real overflow issue in the checkout step indicator, which showed full text labels for all four steps in one row — unworkable at phone widths. Fixed by showing compact circles-only on mobile with a plain-text "Step X of Y" summary beneath, while keeping the fuller inline-label version for larger screens.

**Task 5 — Unit tests for the optimistic update logic**
`performOptimisticUpdate` is tested in isolation using mocked apply/rollback/sync functions (`vi.fn()`) — covering the success path (no rollback, no error callback), the failure path (rollback runs, `onError` receives the actual error), the case where `onError` is omitted entirely, and that operations happen in the correct order (apply before sync, not the reverse). The cart machine's `ROLLBACK` event — added in Task 1 but untested until now — also has dedicated coverage.

## Tech Stack & Why

| Choice | Reasoning |
|---|---|
| **Vite + React** | No SEO/SSR requirement; fast iteration |
| **Tailwind CSS v4** | CSS-native config, class-based dark mode |
| **MSW** | Network-level interception; same handlers across dev, Storybook, and tests |
| **React Router v7** | Modern data-router pattern |
| **XState** (two independent machines) | Cart: rules-heavy but mode-less → one state, many guards. Checkout: genuinely sequential → many named states. Different problems, deliberately different shapes. |
| **Vitest** | Reuses the Vite config; runs plain logic tests and Storybook's browser-based story tests as separate "projects" from one command |

## Architecture Decisions

- **Optimistic-update logic extracted into a pure, dependency-injected function** (`performOptimisticUpdate`) rather than written inline in `CartContext` — the entire reason this was unit-testable without mocking `fetch` or rendering anything.
- **A narrowly-scoped `ROLLBACK` event**, not a generic state-setter — restoring a snapshot after a failed sync without opening a backdoor that could bypass the cart's own stock-limit guards.
- **Two fully independent state machines** (cart, checkout) that never import each other — data crosses between them via component-level props/events at the exact moment it's needed (e.g., cart items are handed to the checkout machine only when `PLACE_ORDER` fires), not through shared context or direct coupling.
- **One generic `useFormValidation` hook backing two different forms** — the same "extract the repeated pattern" instinct as `useDebounce`/`useProducts` in Week 1, scaled from single-field (cart quantity) to whole-form validation.
- **Progressive validation disclosure** (errors only shown after a field is touched, or on a full submit attempt) — deliberately not validating on first render or on every keystroke before any interaction.

## Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.jsx
│   ├── CartToastBridge.jsx
│   ├── ui/
│   ├── catalog/
│   ├── product-detail/
│   ├── cart/
│   │   ├── CartIcon.jsx
│   │   ├── CartDrawer.jsx        # Checkout button navigates to /checkout
│   │   └── CartLineItem.jsx
│   ├── checkout/
│   │   ├── StepIndicator.jsx     # responsive: circles-only + summary on mobile
│   │   ├── CartReviewStep.jsx
│   │   ├── ShippingStep.jsx      # full validation via useFormValidation
│   │   ├── PaymentStep.jsx       # full validation, Luhn-checked card number
│   │   ├── ConfirmationStep.jsx
│   │   └── SuccessStep.jsx
│   └── toast/
├── context/
│   ├── CartContext.jsx           # wraps cartMachine + optimistic sync/rollback
│   └── ToastContext.jsx
├── machines/
│   ├── cartMachine.js
│   ├── cartMachine.test.js
│   └── checkoutMachine.js        # invoke + fromPromise for order submission
├── hooks/
│   ├── useDebounce.js
│   ├── useProduct.js
│   ├── useProducts.js
│   └── useFormValidation.js      # generic form state + validation
├── utils/
│   ├── validators.js             # pure field-level validator functions
│   ├── checkoutValidation.js     # shipping/payment rule sets
│   ├── performOptimisticUpdate.js
│   └── performOptimisticUpdate.test.js
├── mocks/
│   ├── data/products.js
│   └── handlers.js               # products, cart/sync, orders
├── pages/
│   ├── CatalogPage.jsx
│   ├── ProductDetailPage.jsx
│   └── CheckoutPage.jsx
├── router.jsx
├── App.jsx
└── main.jsx
```

## Running the Project

```bash
npm install
npm run dev
```

### Storybook

```bash
npm run storybook
```

### Tests

```bash
npm run test
```

Runs plain unit tests (cart machine, optimistic update logic) and Storybook's story-based tests together. First-time setup for the browser-based tests:

```bash
npx playwright install chromium
```

## Known Limitations / Next Steps

- Checkout does not persist across a page refresh (each visit to `/checkout` starts a fresh machine instance).
- Optimistic rollback restores a full snapshot rather than surgically undoing one operation — rapid, overlapping cart changes could roll back further than strictly necessary in rare cases. A documented, deliberate simplification, not an oversight.
- The cart drawer manages initial focus and Escape-to-close but does not yet fully trap Tab cycling.
- Payment fields collect and validate card data for demonstration only — no real payment processor is integrated, and no card data should ever be entered here beyond test values.
- Product images are sourced from a mix of LoremFlickr placeholders and hand-picked Unsplash photos matched to product names.
- A benign MSW console warning may appear related to the browser's own navigation request; does not affect functionality and does not occur in production (MSW is dev-only).

## Testing Manually

| Feature | How to verify |
|---|---|
| Optimistic cart updates | Add several items quickly; occasionally (~20%) one will roll back with an error toast |
| Checkout flow | Cart → Shipping → Payment → Confirmation → Place Order (may need a retry, ~15% failure rate) |
| Shipping/payment validation | Submit empty, submit a too-short name, submit a Luhn-invalid card number, an expired date |
| Responsive checkout | Resize to <640px — step indicator switches to compact circles + text summary |
| Toast notifications | Trigger a success and a rollback/error to see both styles |