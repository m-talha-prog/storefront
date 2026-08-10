# Storefront — Weeks 1–4: Foundation → Real-Time Inventory

A responsive, accessible e-commerce storefront built with React, Vite, and Tailwind CSS — backed by a mock API, with cart and checkout logic managed by XState, optimistic UI with rollback, comprehensive validation, and real-time cross-tab inventory sync with resilient reconnection.

## What I Built

### Week 1 — Foundation & Catalog
Mock API (MSW), Storybook-documented UI primitives, responsive product catalog with search/filter/grid-list, skeleton loaders, empty states, and a scoped error boundary.

### Week 2 — Product Detail, Cart & Notifications
Accessible product detail page with a roving-tabindex image gallery, React Router, an XState-managed cart with guarded stock-limit transitions, a validated cart drawer UI, and a decoupled toast notification system.

### Week 3 — Optimistic UI & Checkout

**Task 1 — Optimistic UI with automatic rollback.** Cart mutations apply instantly and sync to a mock endpoint (intentionally unreliable, ~20% failure) via a pure, dependency-injected `performOptimisticUpdate` helper — decoupled from React/fetch/XState specifically so it could be unit tested without any of them.

**Task 2 — Multi-step checkout governed by XState.** A second, independent machine (`checkoutMachine.js`) drives Cart → Shipping → Payment → Confirmation → Submitting → Success, using many named states (unlike the cart's single-state-many-guards shape) since checkout genuinely has sequential modes. Order submission uses an `invoke`d `fromPromise` actor.

**Task 3 — Comprehensive client-side validation.** A reusable `useFormValidation` hook backs both shipping and payment forms, with pure composable validators including a Luhn-checksum card number check and expiry-date validity. Errors appear progressively, only after a field is touched.

**Task 4 — Responsive testing.** Verified across breakpoints; found and fixed a real overflow issue in the checkout step indicator at phone widths (now shows compact circles + a text summary below 640px).

**Task 5 — Unit tests for optimistic update logic.** `performOptimisticUpdate` tested via mocked apply/rollback/sync functions, covering both success and failure paths and correct call ordering.

### Week 4 — Real-Time WebSockets

**Task 1 — Real-time inventory updates.** There's no real backend WebSocket server in this project, so this is built as an honest, deliberate architecture choice: `InventorySocket` exposes the same event-based interface a real WebSocket wrapper would (`connect`, `on('message', ...)`, connection status), but its transport is the browser's native `BroadcastChannel` API — the tool actually built for relaying messages between tabs of the same origin. A periodic simulated "someone else bought this" event demonstrates live updates without requiring manual action; stock changes are visible across multiple open tabs.

**Task 2 — Reconnection with exponential backoff + status indicator.** `InventorySocket` distinguishes an intentional `disconnect()` (never reconnects) from an unexpected drop (schedules a reconnect with `delay = min(base × 2^attempt, max)` plus jitter, to avoid many clients retrying in lockstep). A status dot in the header shows connecting/live/reconnecting/offline, with a dev-only button to trigger a test drop.

**Task 3 — Hardened cross-tab sync.** Reconnection introduced a real gap: a tab misses every update broadcast while it was down, and `BroadcastChannel` has no message history to catch up on. Fixed with a request/resync handshake — on every successful connection open, a tab broadcasts `REQUEST_SYNC`; any other open tab with known stock data responds with a snapshot, which the reconnecting tab merges in.

**Task 4 — Automated tests for real-time behavior.** `InventorySocket` is tested with Vitest's fake timers (for deterministic backoff timing) and a mocked `Math.random` (for deterministic jitter), plus one genuine cross-instance integration test using Node's real `BroadcastChannel`. Writing these tests caught a real bug — consecutive drops before a reconnect completed could leave two overlapping reconnect timers alive — fixed by clearing any pending timeout before scheduling a new one.

**Task 5 — Handling socket drops mid-checkout.** Uncovered a more fundamental gap first: cart items snapshot `stockCount` at add-time and never update, so checkout could validate against stale numbers even without any socket drop. Fixed with two layers: a client-side check comparing cart quantities against **live** inventory (blocking "Place Order" with a specific message when insufficient — a non-blocking amber notice if the connection itself is down, since a secondary real-time feature being unavailable shouldn't trap users in checkout), and a **server-side authoritative check** on order submission that re-validates stock independently of whatever the client believed, returning a `409` if a conflict is found.

## Tech Stack & Why

| Choice | Reasoning |
|---|---|
| **Vite + React** | Fast iteration, no SSR requirement |
| **Tailwind CSS v4** | CSS-native config, class-based dark mode |
| **MSW** | Network-level interception for REST; same handlers across dev, Storybook, tests |
| **React Router v7** | Modern data-router pattern |
| **XState** (cart + checkout, independent machines) | Different problems, deliberately different shapes — guards-heavy vs. genuinely sequential |
| **BroadcastChannel** (not a mocked WebSocket) | The actual browser API built for same-origin cross-tab messaging; `InventorySocket` wraps it behind a WebSocket-shaped interface so consuming code doesn't know or care about the difference |
| **Vitest** | Reuses Vite config; runs plain unit tests and Storybook's browser-based story tests as separate "projects" from one command; fake timers + mocked randomness make backoff logic deterministically testable |

## Architecture Decisions

- **`InventorySocket` deliberately mimics a WebSocket's event interface while using `BroadcastChannel` internally** — an honest stand-in for a real backend that doesn't exist here, chosen so the abstraction could be swapped for a real WebSocket later without touching any consuming code.
- **Absolute stock values are broadcast, not relative decrements** — with no real server acting as a single source of truth, relative changes risk inconsistency if two tabs independently compute a "next" value around the same time. Absolute values make last-message-wins deterministic, a documented trade-off rather than a hidden one.
- **A request/resync handshake on every reconnect**, not just on first connect — the same lesson real WebSocket clients learn against real servers: a resumed connection must actively recover what it missed, not just trust that nothing changed while it was down.
- **Two independent layers of stock validation at checkout** — client-side for immediate UX feedback, server-side as the actual authority — mirroring the same client-vs-source-of-truth principle used for cart quantity validation in Week 2, now applied to an even higher-stakes moment (placing an order).
- **A secondary real-time feature going down (the socket) never blocks a critical flow (checkout)** — only the things that must be correct (the server-side check) are allowed to block; a live-updating nicety being temporarily unavailable only produces a non-blocking notice.

## Project Structure

```
src/
├── realtime/
│   ├── InventorySocket.js        # WebSocket-shaped, BroadcastChannel-backed
│   └── InventorySocket.test.js
├── context/
│   ├── CartContext.jsx
│   ├── ToastContext.jsx
│   └── InventoryContext.jsx      # live stock + resync handshake
├── components/
│   ├── inventory/
│   │   └── ConnectionStatusIndicator.jsx
│   ├── cart/
│   ├── checkout/
│   │   └── ConfirmationStep.jsx  # live stock check before Place Order
│   ├── product-detail/
│   │   └── StockBadge.jsx        # reads live stock
│   └── ...
├── machines/
│   ├── cartMachine.js / .test.js
│   └── checkoutMachine.js
├── hooks/ · utils/ · mocks/ · pages/
├── router.jsx · App.jsx · main.jsx
```

## Running the Project

```bash
npm install
npm run dev
npm run storybook
npm run test          # first time: npx playwright install chromium
```

## Known Limitations / Next Steps

- No real backend exists for WebSockets — `InventorySocket` uses `BroadcastChannel`, which only syncs tabs of the *same browser*, not across devices or real users. Swapping in a real WebSocket server later would not require changing any consuming code, by design.
- The periodic stock-simulation timer runs independently in every open tab (no central coordinator), so update frequency scales with tab count — an accepted trade-off, not a bug.
- Checkout does not persist across a page refresh.
- Optimistic rollback restores a full snapshot rather than surgically undoing one operation; rapid overlapping changes could roll back further than strictly necessary in rare cases.
- Payment fields validate realistically (including a Luhn check) but connect to no real payment processor — test values only.
- A benign MSW console warning may appear related to the browser's own navigation request; does not affect functionality and does not occur in production.

## Testing Manually

| Feature | How to verify |
|---|---|
| Cross-tab inventory sync | Open two tabs on the same product; wait ~10s for a simulated update to appear in both |
| Reconnection + backoff | Click "Simulate drop" (dev only) in the header; watch the status dot and reconnect delay grow with repeated clicks |
| Cross-tab resync after reconnect | Drop Tab A, let Tab B's stock change while A is down, confirm A catches up once reconnected |
| Checkout stock guard | Reduce a product's live stock below your cart's requested quantity, confirm "Place Order" is blocked with a specific message |
| Server-side authority | Confirm an order is still rejected with a clear error even if the client-side check is somehow bypassed |