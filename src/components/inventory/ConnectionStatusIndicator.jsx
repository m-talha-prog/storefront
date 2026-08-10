import { useInventory } from '../../context/InventoryContext'

const STATUS_CONFIG = {
  connecting: { color: 'bg-gray-400', label: 'Connecting…' },
  open: { color: 'bg-green-500', label: 'Live' },
  reconnecting: { color: 'bg-amber-500 animate-pulse', label: 'Reconnecting…' },
  closed: { color: 'bg-red-500', label: 'Offline' },
}

export function ConnectionStatusIndicator() {
  const { status, reconnectAttempt, simulateDisconnect } = useInventory()
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.closed

  const label =
    status === 'reconnecting' && reconnectAttempt > 0
      ? `Reconnecting… (attempt ${reconnectAttempt})`
      : config.label

  return (
    <div className="flex items-center gap-2">
      <span
        role="status"
        aria-label={`Inventory connection: ${label}`}
        className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
      >
        <span className={`w-2 h-2 rounded-full ${config.color}`} aria-hidden="true" />
        <span className="hidden sm:inline">{label}</span>
      </span>

      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={simulateDisconnect}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          title="Dev only: simulate a connection drop to test reconnection"
        >
          Simulate drop
        </button>
      )}
    </div>
  )
}