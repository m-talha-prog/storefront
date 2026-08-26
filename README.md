# Storefront — Modern E-Commerce Frontend

A production-oriented e-commerce storefront built with **React, Vite, and Tailwind CSS**, designed to demonstrate modern frontend engineering practices across state management, accessibility, real-time UI synchronization, 3D interaction, performance optimization, and progressive web capabilities.

> **Portfolio project:** This application uses a mock API and simulated infrastructure where a production backend or third-party service is not available. The implementation focuses on demonstrating robust frontend architecture and engineering practices rather than pretending to provide production infrastructure that does not exist.

---

## Overview

Storefront is a responsive e-commerce application developed progressively from a basic product catalog into a feature-rich frontend application.

The project demonstrates:

* Responsive product discovery and filtering
* Product detail pages and image galleries
* Shopping cart and multi-step checkout
* Optimistic UI with rollback
* State machines for complex application flows
* Cross-tab inventory synchronization
* Interactive 3D product visualization
* WebGL capability detection and fallbacks
* Route-based code splitting
* Responsive image delivery
* Progressive Web App functionality
* Accessibility-focused interactions
* Automated testing
* Bundle-size budgets
* Lighthouse-based performance validation

The application currently contains a **51-product mock catalog** and uses MSW for API simulation.

---

## Key Features

### 🛍️ E-Commerce Experience

* Product catalog with search and filtering
* Grid/list product views
* Product detail pages
* Responsive image gallery
* Shopping cart
* Stock-aware cart interactions
* Multi-step checkout
* Form validation
* Loading, empty, and error states
* Toast notifications
* Dark mode

### ⚡ Advanced State Management

Complex application flows are modeled explicitly rather than being scattered across component state.

* **XState** for cart behavior
* **XState** for checkout workflow
* Guarded state transitions
* Optimistic updates
* Automatic rollback
* Snapshot restoration
* Stock validation during checkout

### 🔄 Real-Time Inventory Synchronization

Because this project does not have a real backend, cross-tab synchronization is implemented through a `BroadcastChannel`-backed abstraction that exposes a WebSocket-shaped interface.

Features include:

* Connection state management
* Reconnection with exponential backoff
* Cross-tab inventory updates
* Resynchronization after reconnection
* Checkout stock protection
* Automated tests for asynchronous behavior

This architecture intentionally separates the transport abstraction from the UI so a real WebSocket backend could replace the simulated transport later.

### 🧊 Interactive 3D Product Viewer

Product detail pages include an optional 3D viewing mode built with:

* React Three Fiber
* Three.js
* Drei
* OrbitControls

The viewer supports:

* Mouse orbit controls
* Scroll zoom
* Keyboard controls
* WebGL capability detection
* Runtime error fallback
* Screen-reader guidance
* Mobile-oriented rendering optimizations
* WebGL context-loss recovery

The project uses product photography as textures on a generic 3D object because the mock catalog does not contain real product-specific 3D models.

### 🚀 Performance Engineering

Performance was treated as an architectural concern rather than a final optimization pass.

Implemented techniques include:

* Route-based lazy loading
* React `Suspense`
* Deferred 3D dependencies
* Responsive image `srcset`
* `sizes` attributes
* Lazy loading for non-critical images
* High-priority loading for LCP candidates
* CDN preconnect hints
* Bundle-size budgets
* Rollup bundle visualization
* Lighthouse CI
* PWA caching strategies

### 📱 Progressive Web App

The application includes PWA capabilities through `vite-plugin-pwa` and Workbox.

Implemented features:

* Web app manifest
* Service worker
* Installable application
* Runtime caching
* Image caching
* API caching
* Update detection
* User-controlled application updates

### ♿ Accessibility

Accessibility is considered throughout the application rather than treated as a single audit step.

Examples include:

* Keyboard-accessible controls
* Focus management
* Accessible image gallery navigation
* Screen-reader descriptions
* Accessible loading/error states
* Semantic UI primitives
* WebGL fallback behavior
* Lighthouse accessibility validation

---

## Technology Stack

| Technology        | Purpose                                  |
| ----------------- | ---------------------------------------- |
| React             | UI architecture                          |
| Vite              | Development and production build tooling |
| Tailwind CSS      | Styling and responsive design            |
| React Router      | Client-side routing                      |
| XState            | Complex state machines                   |
| MSW               | Mock API layer                           |
| React Three Fiber | React-based 3D rendering                 |
| Three.js          | WebGL / 3D rendering                     |
| Drei              | Three.js helper components               |
| Vitest            | Unit testing                             |
| Storybook         | Component development and documentation  |
| Playwright        | Browser automation support               |
| vite-plugin-pwa   | PWA and service worker generation        |
| Workbox           | Runtime caching                          |
| Lighthouse CI     | Performance and accessibility validation |
| Size Limit        | Bundle-size enforcement                  |

---

## Architecture

```text
src/
├── components/
│   ├── catalog/
│   ├── cart/
│   ├── checkout/
│   ├── inventory/
│   ├── product-detail/
│   ├── toast/
│   └── ui/
│
├── context/
│   ├── CartContext.jsx
│   ├── InventoryContext.jsx
│   └── ToastContext.jsx
│
├── hooks/
│
├── machines/
│   ├── cartMachine.js
│   └── checkoutMachine.js
│
├── mocks/
│   ├── browser.js
│   ├── handlers.js
│   └── data/
│
├── pages/
│   ├── CatalogPage.jsx
│   ├── ProductDetailPage.jsx
│   └── CheckoutPage.jsx
│
├── realtime/
│   └── InventorySocket.js
│
├── utils/
│   ├── responsiveImage.js
│   ├── webgl.js
│   └── validators.js
│
├── App.jsx
├── router.jsx
└── main.jsx
```

---

## Engineering Highlights

### Explicit State Machines

Cart and checkout behavior are modeled as state machines instead of relying entirely on ad-hoc component state.

This makes guarded transitions, validation, rollback, and workflow states explicit and testable.

### Optimistic UI

Cart mutations update the interface immediately while retaining a previous snapshot for rollback if the operation fails.

### Defensive Real-Time Architecture

Inventory synchronization is separated behind an abstraction that can later be connected to a real WebSocket backend without rewriting the UI layer.

### Progressive Enhancement

The 3D viewer is optional.

If WebGL is unavailable, the application falls back to the standard product gallery instead of making the entire product experience dependent on WebGL.

### Performance-Aware Loading

Large dependencies such as Three.js are not loaded with the initial application bundle.

The 3D viewer is downloaded only when the user requests it.

### Honest Infrastructure Boundaries

The project deliberately distinguishes between simulated infrastructure and real infrastructure.

| Area           | Current implementation       |
| -------------- | ---------------------------- |
| Product API    | MSW mock API                 |
| Inventory sync | BroadcastChannel abstraction |
| Payments       | Validation only              |
| Product models | Textured generic 3D object   |
| Database       | Not required                 |
| Authentication | Not implemented              |
| Backend        | Not implemented              |

This keeps the project technically honest while demonstrating how the frontend architecture could evolve toward real services.

---

## Testing & Quality

The project includes automated tests for critical behavior including:

* Cart state transitions
* Optimistic update rollback
* Inventory synchronization
* Reconnection behavior
* Checkout validation
* Storybook component behavior

Run the test suite:

```bash
npm run test
```

Build the production application:

```bash
npm run build
```

Check bundle budgets:

```bash
npm run size
```

Run Lighthouse CI:

```bash
npm run lighthouse
```

Start Storybook:

```bash
npm run storybook
```

---

## Performance Validation

Lighthouse CI is configured to validate:

* Performance
* Accessibility
* Largest Contentful Paint
* Cumulative Layout Shift
* Total Blocking Time
* Responsive image usage
* Offscreen image loading
* Image sizing
* Best practices
* SEO

The repository also contains bundle-size budgets and a Rollup visualization output for inspecting bundle composition.

> Performance numbers should be regenerated on the machine/environment where the application will actually be evaluated. External image CDN availability can materially affect Lighthouse results.

---

## Getting Started

### Requirements

* Node.js 20+
* npm

### Installation

```bash
git clone https://github.com/m-talha-prog/storefront.git
cd storefront
npm install
```

### Development

```bash
npm run dev
```

The application will start through Vite and use MSW for the mock API.

### Production Build

```bash
npm run build
npm run preview
```

---

## Available Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start Vite development server |
| `npm run build`      | Create production build       |
| `npm run preview`    | Preview production build      |
| `npm run test`       | Run automated tests           |
| `npm run storybook`  | Start Storybook               |
| `npm run size`       | Validate bundle-size budgets  |
| `npm run lighthouse` | Run Lighthouse CI             |

---

## Known Limitations

This project is intentionally frontend-focused.

Current limitations include:

* No production backend
* No real payment processor
* No authentication system
* Inventory synchronization is limited to browser tabs
* Checkout state is not persisted across refreshes
* Product 3D visualization uses a generic textured object rather than real product models
* Responsive image generation is optimized primarily for Unsplash-hosted images
* Production performance depends on external image CDN availability

These limitations are intentional boundaries of the current project rather than hidden dependencies.

---

## Future Improvements

A production version could extend the architecture with:

* Real REST or GraphQL backend
* PostgreSQL database
* Authentication and authorization
* Server-side inventory management
* WebSocket or SSE infrastructure
* Persistent shopping carts
* Stripe or another payment provider
* Real product 3D models
* Product reviews and ratings
* Order management
* Admin dashboard
* CI/CD deployment pipeline
* Error monitoring and analytics

---

## Project Status

**Status: Completed frontend engineering project**

The project demonstrates six progressive development stages:

1. Foundation & catalog
2. Product detail, cart & notifications
3. Optimistic UI & checkout
4. Real-time inventory synchronization
5. 3D product visualization
6. Performance, PWA & production-readiness engineering

---

## Author

**Malik Talha**

Computer Science | Frontend & AI Application Development

GitHub: [@m-talha-prog](https://github.com/m-talha-prog)

---

## License

This project is available for educational and portfolio purposes.
