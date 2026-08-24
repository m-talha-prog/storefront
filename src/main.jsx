import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router.jsx'

async function enableMocking() {
  // This project has no real backend — MSW effectively IS the backend.
  // A real app would never ship API mocks to production; here, disabling
  // MSW in production would just mean the deployed build has no data
  // source at all, making "offline browsing" (Week 6) meaningless since
  // there'd be nothing working online to begin with. Deliberate exception,
  // documented here and in the README.
  const { worker } = await import('./mocks/browser.js')
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})