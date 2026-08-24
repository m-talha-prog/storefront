import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useToast } from '../context/ToastContext'
import { Button } from './ui/Button'

export function PWAUpdatePrompt() {
  const { addToast } = useToast()

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      // Check for a new version every hour while the app is open — catches
      // updates for a tab that's been left open for a long time, not just
      // ones that happen to reload on their own.
      if (registration) {
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)
      }
    },
  })

  useEffect(() => {
    if (offlineReady) {
      addToast('success', 'App is ready to work offline')
      setOfflineReady(false) // consume it — this is a one-time informational event
    }
  }, [offlineReady, addToast, setOfflineReady])

  // needRefresh REQUIRES a decision from the user (reload now, or keep
  // working on the current version a bit longer) — an auto-dismissing toast
  // could vanish before they've even noticed it, silently leaving them on
  // a stale version. This is deliberately a persistent banner instead.
  if (!needRefresh) return null

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 shadow-lg"
    >
      <p className="text-sm">A new version is available.</p>
      <Button size="sm" variant="primary" onClick={() => updateServiceWorker(true)}>
        Reload
      </Button>
      <button
        type="button"
        onClick={() => setNeedRefresh(false)}
        aria-label="Dismiss update notification"
        className="text-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
      >
        ✕
      </button>
    </div>
  )
}