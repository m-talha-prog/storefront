import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { InventorySocket } from './InventorySocket'

describe('InventorySocket', () => {
  let sockets = []

  beforeEach(() => {
    vi.useFakeTimers()
    sockets = []
  })

  afterEach(() => {
    sockets.forEach((socket) => socket.disconnect())
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  function createSocket() {
    const socket = new InventorySocket()
    sockets.push(socket)
    return socket
  }

  it('transitions to "open" after connecting', async () => {
    const socket = createSocket()
    const statuses = []
    socket.on('statuschange', ({ status }) => statuses.push(status))

    socket.connect()
    await vi.advanceTimersByTimeAsync(0)

    expect(statuses).toContain('connecting')
    expect(statuses).toContain('open')
    expect(socket.status).toBe('open')
  })

  it('delivers a message sent from one socket to another connected instance', async () => {
    vi.useRealTimers()

    const socketA = createSocket()
    const socketB = createSocket()

    await new Promise((resolve) => {
      socketA.on('open', resolve)
      socketA.connect()
    })
    await new Promise((resolve) => {
      socketB.on('open', resolve)
      socketB.connect()
    })

    const messageReceived = new Promise((resolve) => {
      socketB.on('message', resolve)
    })

    socketA.send({ type: 'STOCK_UPDATE', productId: 7, stockCount: 3 })

    const data = await messageReceived
    expect(data).toEqual({ type: 'STOCK_UPDATE', productId: 7, stockCount: 3 })
  })

  it('does not schedule a reconnect after an intentional disconnect', async () => {
    const socket = createSocket()
    socket.connect()
    await vi.advanceTimersByTimeAsync(0)

    socket.disconnect()
    await vi.advanceTimersByTimeAsync(60000)

    expect(socket.status).toBe('closed')
  })

  it('schedules a reconnect after an unexpected drop', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const socket = createSocket()
    socket.connect()
    await vi.advanceTimersByTimeAsync(0)

    socket.simulateDrop()
    expect(socket.status).toBe('reconnecting')

    await vi.advanceTimersByTimeAsync(750)
    await vi.advanceTimersByTimeAsync(0)

    expect(socket.status).toBe('open')
  })

  it('increases the backoff delay across consecutive failed attempts', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const socket = createSocket()
    socket.connect()
    await vi.advanceTimersByTimeAsync(0)

    socket.simulateDrop()
    socket.simulateDrop()

    await vi.advanceTimersByTimeAsync(999)
    expect(socket.status).toBe('reconnecting')

    await vi.advanceTimersByTimeAsync(1)
    await vi.advanceTimersByTimeAsync(0)
    expect(socket.status).toBe('open')
  })

  it('resets the reconnect attempt counter after a successful reconnection', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const socket = createSocket()
    socket.connect()
    await vi.advanceTimersByTimeAsync(0)

    socket.simulateDrop()
    await vi.advanceTimersByTimeAsync(1000)
    await vi.advanceTimersByTimeAsync(0)

    expect(socket.reconnectAttempt).toBe(0)
  })

  it('throws when attempting to send while not connected', () => {
    const socket = createSocket()
    expect(() => socket.send({ type: 'STOCK_UPDATE' })).toThrow()
  })
})