const CHANNEL_NAME = 'inventory-updates'

const BASE_DELAY_MS = 1000
const MAX_DELAY_MS = 30000

const RANDOM_DROP_CHECK_INTERVAL_MS = 20000
const RANDOM_DROP_CHANCE = 0.15

export class InventorySocket {
  constructor() {
    this.channel = null
    this.status = 'closed'
    this.listeners = { open: [], message: [], close: [], statuschange: [] }
    this.reconnectAttempt = 0
    this.reconnectTimeoutId = null
    this.randomDropIntervalId = null
    this.intentionalDisconnect = false
  }

  on(event, handler) {
    this.listeners[event].push(handler)
    return () => {
      this.listeners[event] = this.listeners[event].filter((h) => h !== handler)
    }
  }

  emit(event, payload) {
    this.listeners[event].forEach((handler) => handler(payload))
  }

  setStatus(status) {
    this.status = status
    this.emit('statuschange', { status, reconnectAttempt: this.reconnectAttempt })
  }

  connect() {
    this.intentionalDisconnect = false
    this.setStatus(this.reconnectAttempt > 0 ? 'reconnecting' : 'connecting')

    this.channel = new BroadcastChannel(CHANNEL_NAME)

    this.channel.onmessage = (event) => {
      this.emit('message', event.data)
    }

    queueMicrotask(() => {
      this.reconnectAttempt = 0
      this.setStatus('open')
      this.emit('open')
      this.startRandomDropSimulation()
    })
  }

  send(data) {
    if (this.status !== 'open') {
      throw new Error('Cannot send: socket is not open')
    }
    this.channel.postMessage(data)
  }

  disconnect() {
    this.intentionalDisconnect = true
    this.clearRandomDropSimulation()
    clearTimeout(this.reconnectTimeoutId)

    this.channel?.close()
    this.channel = null
    this.reconnectAttempt = 0
    this.setStatus('closed')
    this.emit('close', { intentional: true })
  }

  simulateDrop() {
    this.clearRandomDropSimulation()
    this.channel?.close()
    this.channel = null

    this.emit('close', { intentional: false })
    this.scheduleReconnect()
  }

  scheduleReconnect() {
    // A drop arriving while a previous reconnect is already scheduled would
    // otherwise leave BOTH timers alive — the earlier, shorter one still
    // firing and reconnecting prematurely instead of respecting the newer,
    // longer backoff delay this attempt should actually wait for.
    clearTimeout(this.reconnectTimeoutId)

    this.setStatus('reconnecting')

    const rawDelay = Math.min(BASE_DELAY_MS * 2 ** this.reconnectAttempt, MAX_DELAY_MS)
    const jitter = 0.5 + Math.random() * 0.5
    const delay = Math.round(rawDelay * jitter)

    this.reconnectAttempt += 1

    this.reconnectTimeoutId = setTimeout(() => {
      if (this.intentionalDisconnect) return
      this.connect()
    }, delay)
  }

  startRandomDropSimulation() {
    this.randomDropIntervalId = setInterval(() => {
      if (Math.random() < RANDOM_DROP_CHANCE) {
        this.simulateDrop()
      }
    }, RANDOM_DROP_CHECK_INTERVAL_MS)
  }

  clearRandomDropSimulation() {
    clearInterval(this.randomDropIntervalId)
    this.randomDropIntervalId = null
  }
}