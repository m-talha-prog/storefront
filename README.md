# Storefront — Weeks 1–6: Foundation → Real-Time Inventory → 3D Product Viewer → Performance & PWA

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

### Week 6 — Performance, PWA & Production Readiness

**Task 1 — Installable, offline-capable PWA.** `vite-plugin-pwa` generates a manifest and a Workbox service worker: stale-while-revalidate for the mock `/api/*` routes, cache-first for product images (30-day expiry, capped entry count). A `PWAUpdatePrompt` component surfaces a *persistent* banner — not an auto-dismissing toast — when a new version is ready, because "reload now vs. keep working" is a decision the user has to actually make, plus a background check every hour for tabs left open a long time.

**Task 2 — Route-based code splitting + bundle budgets.** `CatalogPage`, `ProductDetailPage`, and `CheckoutPage` are each `React.lazy()`-loaded in `router.jsx` behind one `Suspense` boundary in `App.jsx`, so visiting the catalog no longer downloads checkout's code. `.size-limit.cjs` sets enforceable KB budgets per chunk (checked via `npm run size`), and `rollup-plugin-visualizer` emits a `dist/stats.html` treemap on every build to see exactly what's contributing to bundle weight.

**Task 3 — Image optimization.** This is a Vite SPA, not Next.js, so there's no `next/image` pipeline — optimization is manual `srcset`/`sizes`, built in `src/utils/responsiveImage.js`. Product photos come from Unsplash, which accepts a `w=` query param and does content negotiation via `auto=format` (serves AVIF/WebP automatically based on `Accept` headers — real next-gen-format delivery, no extra tooling required). The catalog's first row and the product-detail hero image (the LCP candidates on their respective pages) load eagerly at `fetchPriority="high"`; everything else stays `loading="lazy"`. Two `<link rel="preconnect">` hints in `index.html` warm the connection to Unsplash's hosts before React even resolves the mock API response. iStock-hosted images (a minority of the catalog) don't expose a documented resize param, so they fall back to a plain `src` rather than guessing at an API that isn't ours to rely on.

**Task 4 — Lighthouse CI.** `lighthouserc.cjs` builds the production bundle, serves it via `vite preview`, and runs 3 Lighthouse passes (median reported) against `http://localhost:4173/`. Performance, accessibility, LCP, CLS, and TBT are asserted as hard errors; best-practices/SEO as warnings. Three responsive-image-specific audits (`uses-responsive-images`, `offscreen-images`, `unsized-images`) are asserted at `minScore: 1` so a future change that reintroduces an unoptimized image fails CI immediately instead of quietly regressing. Run it with `npm run lighthouse`.

**Task 5 — README finalized.** Setup instructions and a performance-benchmark section added below.

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
│   ├── webgl.js                    # isWebGLAvailable() feature detection
│   └── responsiveImage.js          # srcset/sizes builder for Unsplash-hosted images
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

## Setup Instructions

**Prerequisites:** Node.js 20+ and npm.

```bash
git clone <this repo's URL>
cd storefront
npm install
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts the Vite dev server (mock API via MSW). |
| `npm run build` | Production build to `dist/` (also emits `dist/stats.html`, a bundle treemap). |
| `npm run preview` | Serves the `dist/` build locally, as production would. |
| `npm run storybook` | Starts Storybook for the UI primitives in `src/components/ui`. |
| `npm run test` | Runs unit + Storybook-story tests via Vitest. First run: `npx playwright install chromium`. |
| `npm run size` | Checks bundle sizes against the budgets in `.size-limit.cjs`. |
| `npm run lighthouse` | Builds, serves, and runs Lighthouse CI (see below). First run: `npx playwright install chromium` if not already installed — Lighthouse needs a Chromium binary, and this project already depends on Playwright's, so no separate download is required. Set `CHROME_PATH` to that binary if Lighthouse can't find a system Chrome automatically. |

## Performance Benchmarks

Generated with `npm run lighthouse` (desktop preset — see the reasoning in `lighthouserc.cjs` for why desktop, not mobile, is the honest target for a project shipping a Three.js 3D viewer). Numbers below are from a run in this project's own sandboxed dev environment, **where outbound requests to Unsplash/iStock (the product image CDNs) are blocked by the sandbox's network policy** — every product image failed to load (403), which understates real image payload and overstates the score. Treat the table below as "the pipeline works end-to-end," not as the real-world number.

| Category | Score (this sandbox, images blocked) |
|---|---|
| Performance | 99–100 |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | 100 |

**To get a trustworthy number:** run `npm run lighthouse` on a machine with normal internet access, so the actual product images download. Paste the real scores here afterward. One known, real (not sandbox-artifact) gap already caught: a low-contrast review-count `<span>` on `ProductCard` (`text-gray-400` on white, ratio 2.6:1 against a 4.5:1 requirement) — worth a follow-up Tailwind class change, not fixed here since it wasn't part of this week's scope.

## Known Limitations / Next Steps

- The 3D viewer is a generic textured box, not a real per-product 3D scan/model — an honest placeholder given 51 mock products, not a claim of photorealistic product representation.
- `BroadcastChannel`-based real-time sync only works across tabs of the same browser, not across devices or real users.
- Checkout does not persist across a page refresh; optimistic rollback restores full snapshots rather than surgically undoing single operations.
- Payment fields validate realistically (including Luhn) but connect to no real payment processor.
- `role="application"` on the 3D viewer is the most honest available ARIA choice, not a perfect one — no standard ARIA pattern exists for a custom 3D orbit widget.
- Responsive `srcset` generation only works for Unsplash-hosted images (the majority of the catalog); iStock-hosted images serve a single fixed size since iStock doesn't expose a documented resize param.
- A real low-contrast text issue (`ProductCard`'s review-count span) was surfaced by the Lighthouse accessibility audit and is tracked but not yet fixed.

## Testing Manually

| Feature | How to verify |
|---|---|
| 3D viewer | Product detail → "3D View" → drag to orbit, scroll to zoom |
| Lazy loading | DevTools Network (JS filter) → confirm R3F/drei/three chunks load only after clicking "3D View" |
| WebGL fallback | Temporarily force `isWebGLAvailable` to return false → confirm the toggle disappears, only Photos shows |
| Keyboard controls | Tab to the viewer, use arrow keys + / − , confirm identical motion to mouse drag |
| Screen reader | Navigate to the viewer with a screen reader active, confirm it announces as an application with a clear description |
| Mobile performance | DevTools device emulation + CPU throttling, or a real phone — confirm smooth rotation and clean recovery after backgrounding the tab |