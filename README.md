# Storefront — Weeks 1–5: Foundation → Real-Time Inventory → 3D Product Viewer

A responsive, accessible e-commerce storefront built with React, Vite, and Tailwind CSS — backed by a mock API, with cart and checkout logic managed by XState, optimistic UI with rollback, comprehensive validation, real-time cross-tab inventory sync, and an accessible, performant 3D product viewer.

## What I Built

### Week 1 — Foundation & Catalog
Mock API (MSW), Storybook-documented UI primitives, responsive product catalog with search/filter/grid-list, skeleton loaders, empty states, and a scoped error boundary.

### Week 2 — Product Detail, Cart & Notifications
Accessible product detail page with a roving-tabindex image gallery, React Router, an XState-managed cart with guarded stock-limit transitions, a validated cart drawer UI, and a decoupled toast notification system.

### Week 3 — Optimistic UI & Checkout
Optimistic cart updates with automatic rollback (via a pure, unit-tested `performOptimisticUpdate` helper), a multi-step checkout flow governed by a second independent XState machine, comprehensive Luhn-validated form validation, and responsive testing that caught and fixed a real checkout step-indicator overflow bug.

### Week 4 — Real-Time WebSockets
A WebSocket-shaped `InventorySocket` abstraction (backed by `BroadcastChannel`, since no real backend exists) with exponential-backoff reconnection, a connection status indicator, a request/resync handshake fixing a real gap where reconnecting tabs missed updates, deterministic automated tests (which caught a real overlapping-reconnect-timer bug), and a two-layer stock guard (client UX check + server-side authoritative validation) protecting checkout against stale inventory data.

### Week 5 — WebGL & 3D Product Viewer

**Task 1 — Interactive 3D product viewer.** No real per-product 3D model files exist for a 51-item mock catalog, so — consistent with every other honest placeholder decision in this project (product images, the WebSocket transport) — the viewer is a texture-mapped rotating box using each product's own real photo, built with React Three Fiber. Users drag to orbit and scroll to zoom via `OrbitControls`, toggled alongside the existing photo gallery rather than replacing it.

**Task 2 — Lazy loading + a matched-dimension placeholder.** The entire Three.js/R3F/drei bundle (several hundred KB) is deferred via `React.lazy()`, downloading only the moment a user clicks "3D View" — verified directly in the Network tab. A `Viewer3DSkeleton` matching the viewer's exact `h-96` dimensions prevents layout shift during the swap. Two distinct Suspense boundaries handle two genuinely different async concerns: one for the lazy-loaded *code*, one (from Task 1) for the texture *image*.

**Task 3 — WebGL-unsupported fallback.** Two layers: a preventive `isWebGLAvailable()` feature-detection check hides the "3D View" option entirely on devices that never had WebGL support (rather than offering something guaranteed to fail), and the existing Week 1 `ErrorBoundary` wraps the viewer as a runtime safety net for context failures that happen *after* the initial check passed.

**Task 4 — Accessibility: keyboard controls + screen reader description.** Arrow keys and +/− drive the *same* spherical-coordinate camera math `OrbitControls` uses internally for mouse drag, so keyboard and mouse interaction feel identical rather than being two disconnected input models. `role="application"` hands keyboard behavior fully to the custom implementation; a screen-reader-only description explicitly reassures non-visual users that the full product information already exists elsewhere on the page, since a `<canvas>` is otherwise a black hole to assistive technology.

**Task 5 — Mobile performance.** Three targeted fixes: capped device pixel ratio (`dpr={[1, 2]}` — a 3x Retina display would otherwise render 9x the pixels of a 1x screen for identical visible size), a `low-power` GPU hint, and explicit `webglcontextlost`/`webglcontextrestored` handling — necessary because mobile browsers reclaim WebGL contexts aggressively when tabs are backgrounded, and context loss does not throw a catchable error, so the Task 3 error boundary alone can't handle it. Verified via DevTools CPU throttling and confirmed on real devices.

## Tech Stack & Why

| Choice | Reasoning |
|---|---|
| **Vite + React** | Fast iteration, no SSR requirement |
| **Tailwind CSS v4** | CSS-native config, class-based dark mode |
| **MSW** | Network-level interception for REST |
| **React Router v7** | Modern data-router pattern |
| **XState** (cart + checkout) | Guards-heavy vs. genuinely sequential — different shapes for different problems |
| **BroadcastChannel** | Real cross-tab API, wrapped behind a WebSocket-shaped interface |
| **Three.js / React Three Fiber / drei** | Declarative 3D scene composition inside the existing React component tree, rather than hand-rolled imperative Three.js setup |
| **Vitest** | Unit + Storybook story tests from one command; fake timers + mocked randomness for deterministic async/backoff testing |

## Architecture Decisions

- **The 3D viewer uses each product's real photo as a texture on a generic box**, rather than fictional or generic 3D assets — the same honesty applied to product images and the mock WebSocket transport, carried into a new medium.
- **Two separate Suspense boundaries around the 3D viewer** — one for the lazily-loaded component code, one for the async-loaded texture — because they're genuinely different resources with different lifetimes (code is cached after first load; a new texture downloads per product).
- **Keyboard controls reuse the exact spherical-coordinate math `OrbitControls` uses for mouse drag**, rather than inventing a separate keyboard-only interaction model — consistency of feel across input methods mattered more than implementation convenience.
- **WebGL support is checked preventively AND backed by a runtime error boundary** — the same "client check + authoritative safety net" pattern used for checkout stock validation in Week 4, applied here to a browser capability instead of business data.
- **Mobile performance fixes are the ones with well-established, predictable payoff** (pixel ratio capping, power hints, context-loss recovery) applied proactively, with real-device verification treated as confirmation rather than pure discovery — the difference between engineering judgment and guesswork.

## Project Structure

```
src/
├── components/
│   └── product-detail/
│       ├── ProductViewer3D.jsx     # R3F scene, keyboard controls, context-loss recovery
│       ├── Viewer3DSkeleton.jsx    # matched-dimension loading placeholder
│       └── Viewer3DFallback.jsx    # shown when WebGL unsupported or on error
├── utils/
│   └── webgl.js                    # isWebGLAvailable() feature detection
├── realtime/
│   └── InventorySocket.js / .test.js
├── context/
│   ├── CartContext.jsx
│   ├── ToastContext.jsx
│   └── InventoryContext.jsx
├── machines/
│   ├── cartMachine.js / .test.js
│   └── checkoutMachine.js
├── hooks/ · mocks/ · pages/
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

- The 3D viewer is a generic textured box, not a real per-product 3D scan/model — an honest placeholder given 51 mock products, not a claim of photorealistic product representation.
- `BroadcastChannel`-based real-time sync only works across tabs of the same browser, not across devices or real users.
- Checkout does not persist across a page refresh; optimistic rollback restores full snapshots rather than surgically undoing single operations.
- Payment fields validate realistically (including Luhn) but connect to no real payment processor.
- `role="application"` on the 3D viewer is the most honest available ARIA choice, not a perfect one — no standard ARIA pattern exists for a custom 3D orbit widget.

## Testing Manually

| Feature | How to verify |
|---|---|
| 3D viewer | Product detail → "3D View" → drag to orbit, scroll to zoom |
| Lazy loading | DevTools Network (JS filter) → confirm R3F/drei/three chunks load only after clicking "3D View" |
| WebGL fallback | Temporarily force `isWebGLAvailable` to return false → confirm the toggle disappears, only Photos shows |
| Keyboard controls | Tab to the viewer, use arrow keys + / − , confirm identical motion to mouse drag |
| Screen reader | Navigate to the viewer with a screen reader active, confirm it announces as an application with a clear description |
| Mobile performance | DevTools device emulation + CPU throttling, or a real phone — confirm smooth rotation and clean recovery after backgrounding the tab |