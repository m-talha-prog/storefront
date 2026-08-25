// Lighthouse CI config — run with `npm run lighthouse`.
//
// This audits the PRODUCTION build (`dist/`), not the dev server: `vite`
// dev mode skips minification and code-splitting boundaries behave
// differently, so a dev-server score is not representative of what a real
// user gets. `startServerCommand` builds first, then serves `dist/` via
// `vite preview`, matching what actually ships.
//
// MSW is intentionally still active in production for this project (see
// the comment in `src/main.jsx`) — it registers a service worker on first
// load, which means the *first* Lighthouse run in a fresh profile can
// score lower than subsequent runs simply because the network tab includes
// the mock worker registering itself. `numberOfRuns: 3` with the median
// reported is a deliberate hedge against that variance, not padding.
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run build && npm run preview -- --port 4173',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      url: ['http://localhost:4173/'],
      numberOfRuns: 3,
      settings: {
        // Lighthouse's default preset simulates a throttled mid-tier mobile
        // device — appropriate for most sites, but this project ships a
        // multi-hundred-KB Three.js/R3F chunk (lazy-loaded, but still
        // downloaded the moment "3D View" is clicked) and a 2MB+ PWA
        // precache manifest. Under mobile throttling those alone make a
        // literal 100 unrealistic without gutting the 3D-viewer feature
        // this project is built to demonstrate. `desktop` is the honest
        // choice for what this app actually targets — run
        // `lhci autorun --collect.settings.preset=mobile` separately to see
        // the (lower) mobile-throttled number.
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],

        // Core Web Vitals — the metrics that actually compose the
        // performance score, asserted individually so a regression shows
        // up as "LCP got slower" instead of just "score dropped 4 points".
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],

        // Directly ties back to the Week 6 image-optimization work —
        // fails loudly if a future change reintroduces unsized or
        // non-lazy-loaded images.
        'uses-responsive-images': ['error', { minScore: 1 }],
        'offscreen-images': ['error', { minScore: 1 }],
        'unsized-images': ['error', { minScore: 1 }],
      },
    },
    upload: {
      // No LHCI server for this project — reports upload to Lighthouse
      // CI's free temporary-storage host and print a shareable link in
      // the terminal output. Good enough for a portfolio project; a real
      // team setup would point this at a self-hosted LHCI server instead.
      target: 'temporary-public-storage',
    },
  },
}
