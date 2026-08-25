Storefront

Production-minded React E-Commerce Frontend

A responsive, accessible e-commerce storefront built with React, Vite, and Tailwind CSS, featuring a mock REST API, XState-powered cart and checkout flows, optimistic UI with rollback, cross-tab inventory synchronization, an accessible 3D product viewer, route-based code splitting, image optimization, bundle budgets, Lighthouse CI, and PWA support.

🔗 Live Demo & Repository

Live Demo: https://storefront-sepia-delta.vercel.app/

GitHub: https://github.com/m-talha-prog/storefront

✨ Highlights

🛍️ Responsive product catalog with search, filtering, grid/list views, skeleton states, and empty states

🛒 XState-managed cart with guarded stock-limit transitions

💳 Multi-step checkout state machine with validated forms

⚡ Optimistic cart updates with automatic rollback

🔄 Cross-tab inventory synchronization using BroadcastChannel

🧩 WebSocket-shaped inventory abstraction with reconnection and resync handling

🎮 Interactive 3D product viewer built with React Three Fiber

♿ Keyboard-accessible 3D controls and screen-reader support

📱 Mobile-focused WebGL performance and context-loss recovery

📦 Route-based code splitting and bundle-size budgets

🖼️ Responsive image loading with srcset, sizes, lazy loading, and preload/preconnect hints

📲 Installable/offline-capable PWA with Workbox

🧪 Unit and Storybook-story testing with Vitest

🚦 Lighthouse CI with performance/accessibility regression checks

🌙 Responsive UI with dark-mode support

What I Built

Week 1 — Foundation & Catalog

Mock API using MSW

Storybook-documented UI primitives

Responsive product catalog

Search and filtering

Grid/list view

Skeleton loaders

Empty states

Scoped error boundary

Week 2 — Product Detail, Cart & Notifications

Accessible product-detail page

Roving-tabindex image gallery

React Router

XState-managed cart

Guarded stock-limit transitions

Validated cart drawer

Decoupled toast notification system

Week 3 — Optimistic UI & Checkout

Optimistic cart updates with automatic rollback

Pure, unit-tested performOptimisticUpdate helper

Independent XState checkout machine

Multi-step checkout flow

Luhn-validated payment fields

Comprehensive form validation

Responsive testing that caught and fixed a checkout step-indicator overflow bug

Week 4 — Real-Time Inventory

The project does not have a real backend, so I did not pretend BroadcastChannel was a production WebSocket.

Instead, I created a WebSocket-shaped InventorySocket abstraction backed by BroadcastChannel.

It includes:

Exponential-backoff reconnection

Connection-status indicator

Request/resync handshake

Cross-tab inventory updates

Deterministic automated tests

Two-layer stock protection:

Client-side UX validation

Authoritative validation before checkout

This approach keeps the application architecture replaceable: a real WebSocket transport could be introduced behind the same abstraction later.

Week 5 — WebGL & 3D Product Viewer

Interactive 3D viewer

The catalog contains 51 mock products without individual 3D model files. Rather than presenting fictional models as real product assets, the viewer uses each product's actual image as a texture on a rotating box.

Built with:

React Three Fiber

Three.js

@react-three/drei

OrbitControls

Users can drag to orbit and scroll to zoom while switching between the existing photo gallery and the 3D view.

Lazy loading

The Three.js/R3F/drei bundle is loaded only when the user selects 3D View using React.lazy().

A matched-dimension Viewer3DSkeleton prevents layout shift during loading.

Two Suspense boundaries handle two separate asynchronous resources:

Lazy-loaded viewer code

Product texture image

WebGL fallback

Two safety layers are used:

Preventive isWebGLAvailable() feature detection

Runtime error boundary for failures after initial capability detection

If WebGL is unavailable, the 3D option is hidden and the normal photo gallery remains available.

Accessibility

The viewer supports:

Arrow-key camera movement

+ / − zoom controls

Keyboard navigation

Screen-reader description

Consistent camera math between mouse and keyboard interaction

Mobile performance

The viewer includes:

Capped device pixel ratio: dpr={[1, 2]}

low-power GPU hint

webglcontextlost handling

webglcontextrestored handling

DevTools CPU-throttling verification

Real-device verification

Week 6 — Performance, PWA & Production Readiness

Installable PWA

vite-plugin-pwa generates:

Web app manifest

Workbox service worker

Stale-while-revalidate strategy for mock /api/* routes

Cache-first strategy for product images

30-day image cache expiry

Capped cache entries

Persistent update prompt

Background update checks

The update prompt deliberately does not auto-dismiss because the user should control when the current application version is replaced.

Route-based code splitting

The following routes are lazy-loaded:

CatalogPage

ProductDetailPage

CheckoutPage

This prevents checkout-specific code from being downloaded when the user only visits the catalog.

Bundle budgets

.size-limit.cjs defines enforceable bundle-size budgets.

Run:

npm run size

The production build also generates:

dist/stats.html

using rollup-plugin-visualizer so bundle composition can be inspected.

Image optimization

The Vite SPA uses manual responsive image handling through:

src/utils/responsiveImage.js

For Unsplash-hosted images:

srcset

sizes

auto=format

Responsive width parameters

Lazy loading for non-critical images

High fetch priority for key LCP candidates

Preconnect hints

iStock-hosted images do not expose a documented resize parameter, so they intentionally fall back to a normal src rather than relying on an undocumented API.

Lighthouse CI

lighthouserc.cjs:

Builds the production application

Serves it through vite preview

Runs three Lighthouse passes

Reports the median result

Checks performance

Checks accessibility

Checks LCP

Checks CLS

Checks TBT

Checks responsive-image audits

Warns on best-practices and SEO regressions

Run:

npm run lighthouse

🧠 Architecture Decisions

XState for cart and checkout

The cart is primarily guard-heavy, while checkout is genuinely sequential. Using separate state machines keeps each workflow explicit instead of forcing unrelated states into one global model.

Optimistic updates with rollback

Cart interactions update immediately for responsive UX. If the operation fails, the previous snapshot is restored automatically.

WebSocket-shaped abstraction

InventorySocket intentionally separates the application from the transport. BroadcastChannel provides cross-tab synchronization today, while the interface leaves room for a real WebSocket backend later.

Honest 3D placeholder

The 3D viewer uses each product's real image as a texture on a generic box because the mock catalog does not contain product-specific 3D assets.

Two Suspense boundaries

The 3D viewer's code and product texture are different asynchronous resources with different lifetimes, so they are handled independently.

Preventive capability detection + runtime safety

WebGL support is checked before exposing the feature and the existing error boundary remains available for runtime failures.

Mobile performance over visual excess

The viewer uses established performance safeguards such as DPR capping, low-power GPU hints, and WebGL context recovery rather than adding expensive effects with uncertain benefit.

🛠️ Tech Stack

Technology

Purpose

React

UI architecture

Vite

Fast development and production builds

Tailwind CSS v4

Styling and responsive UI

MSW

Mock REST API/network interception

React Router v7

Client-side routing

XState

Cart and checkout state machines

BroadcastChannel

Cross-tab inventory synchronization

Three.js

3D rendering

React Three Fiber

Declarative Three.js integration

drei

Three.js/R3F helpers

Vitest

Unit and component/story tests

Storybook

UI component documentation/testing

Playwright

Browser automation

vite-plugin-pwa / Workbox

PWA and service-worker support

rollup-plugin-visualizer

Bundle analysis

size-limit

Bundle-size budgets

Lighthouse CI

Performance and quality regression checks

📁 Project Structure

src/
├── components/
│   └── product-detail/
│       ├── ProductViewer3D.jsx
│       ├── Viewer3DSkeleton.jsx
│       └── Viewer3DFallback.jsx
│
├── utils/
│   ├── webgl.js
│   └── responsiveImage.js
│
├── realtime/
│   ├── InventorySocket.js
│   └── InventorySocket.test.js
│
├── context/
│   ├── CartContext.jsx
│   ├── ToastContext.jsx
│   └── InventoryContext.jsx
│
├── machines/
│   ├── cartMachine.js
│   ├── cartMachine.test.js
│   └── checkoutMachine.js
│
├── hooks/
├── mocks/
├── pages/
├── router.jsx
├── App.jsx
└── main.jsx

🚀 Setup

Prerequisites

Node.js 20+

npm

Installation

git clone https://github.com/m-talha-prog/storefront.git
cd storefront
npm install

Available commands

Command

Description

npm run dev

Start the Vite development server

npm run build

Create a production build and bundle visualization

npm run preview

Preview the production build locally

npm run storybook

Start Storybook

npm run test

Run unit and Storybook-story tests

npm run size

Check bundle-size budgets

npm run lighthouse

Run the Lighthouse CI workflow

For browser-based testing, install the required Chromium binary if necessary:

npx playwright install chromium

📊 Performance

The project includes a Lighthouse CI pipeline rather than treating performance as a one-time manual check.

Run:

npm run lighthouse

## 📊 Performance Benchmarks

Generated with `npm run lighthouse`.

| Category | Score |
|---|---:|
| Performance | 99–100 |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | 100 |

Performance goals enforced by the project

Responsive images

Lazy loading of non-critical images

High priority for key LCP images

Route-based code splitting

Lazy-loaded 3D dependencies

Bundle-size budgets

PWA caching

Lighthouse regression checks

WebGL DPR limits

Mobile context-loss recovery

♿ Accessibility

Accessibility is considered throughout the application:

Keyboard-accessible interactions

Roving tabindex image gallery

Screen-reader descriptions

Accessible product and cart controls

Error states

Loading states

Responsive layouts

Keyboard controls for the 3D viewer


🧪 Testing & Verification

Feature

Verification

3D viewer

Product detail → 3D View → drag to orbit and scroll to zoom

Lazy loading

DevTools Network → confirm Three/R3F chunks load after opening 3D View

WebGL fallback

Temporarily force isWebGLAvailable() to return false

Keyboard controls

Focus viewer → use arrow keys and + / −

Screen reader

Navigate to the viewer with a screen reader enabled

Mobile performance

Device emulation + CPU throttling or a real phone

Bundle size

npm run size

Lighthouse

npm run lighthouse

PWA

Install the application from a supported browser and test offline behavior

⚠️ Known Limitations

This is a frontend-focused application with a mock backend, so the following limitations are intentional:

The 3D viewer is a generic textured box rather than a real per-product 3D model.

BroadcastChannel synchronizes inventory across tabs in the same browser, not across devices or real users.

Checkout state does not persist across a page refresh.

Payment fields perform realistic validation but are not connected to a real payment processor.

Responsive srcset generation is available for Unsplash-hosted images; iStock-hosted images use a fixed source.

A custom 3D canvas does not have a perfect standardized ARIA pattern; the implementation uses keyboard controls and an explicit screen-reader description.

The mock API is intentionally client-side and is not a production inventory/payment backend.

These limitations are documented deliberately rather than presenting prototype functionality as production infrastructure.

🎯 What This Project Demonstrates

This project goes beyond a static e-commerce UI and demonstrates practical frontend engineering skills in:

React architecture

State-machine design

Async state handling

Optimistic UI

Error recovery

Form validation

Responsive design

Accessibility

Cross-tab communication

WebGL integration

Performance optimization

Code splitting

Bundle analysis

PWA architecture

Automated testing

Lighthouse-based regression testing

Production-oriented frontend development

👨‍💻 Project Context

Built as the final Storefront project for a Frontend Developer Internship at Parallax Labs.

The project evolved across six development phases:

Foundation → Catalog → Cart & Checkout → Real-Time Inventory → 3D Product Viewer → Performance, PWA & Production Readiness

📄 License

This project is intended as a portfolio/internship project.
