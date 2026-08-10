import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { InventorySocket } from '../realtime/InventorySocket'
import { products } from '../mocks/data/products'

const InventoryContext = createContext(null)

const SIMULATION_INTERVAL_MS = 10000

export function InventoryProvider({ children }) {
  const [stockOverrides, setStockOverrides] = useState({})
  const [status, setStatus] = useState('closed')
  const [reconnectAttempt, setReconnectAttempt] = useState(0)
  const socketRef = useRef(null)
  // Overrides can be read inside message handlers registered once on mount,
  // so we track the latest value in a ref to avoid stale-closure reads.
  const overridesRef = useRef({})

  useEffect(() => {
    overridesRef.current = stockOverrides
  }, [stockOverrides])

  useEffect(() => {
    const socket = new InventorySocket()
    socketRef.current = socket

    const unsubStatus = socket.on('statuschange', ({ status, reconnectAttempt }) => {
      setStatus(status)
      setReconnectAttempt(reconnectAttempt)
    })

    const unsubMessage = socket.on('message', (data) => {
      if (data.type === 'STOCK_UPDATE') {
        setStockOverrides((prev) => ({ ...prev, [data.productId]: data.stockCount }))
        return
      }

      // Another tab just (re)connected and is asking what it might have
      // missed. Respond with everything WE currently know, but only if we
      // actually have something to share — an empty snapshot broadcast is
      // just noise on the channel every other tab has to process for nothing.
      if (data.type === 'REQUEST_SYNC') {
        if (Object.keys(overridesRef.current).length > 0) {
          socketRef.current?.send({
            type: 'SYNC_SNAPSHOT',
            overrides: overridesRef.current,
          })
        }
        return
      }

      // A response to OUR request — merge in whatever this tab knew that we
      // might have missed while disconnected. Merging (not replacing) means
      // multiple tabs answering the same request just layer on top of each
      // other safely.
      if (data.type === 'SYNC_SNAPSHOT') {
        setStockOverrides((prev) => ({ ...prev, ...data.overrides }))
      }
    })

    const unsubOpen = socket.on('open', () => {
      // Ask every other open tab "what did I miss?" — covers both the very
      // first connect (harmless no-op if nothing else is open yet) and,
      // more importantly, every RECONNECT after a drop.
      socketRef.current?.send({ type: 'REQUEST_SYNC' })
    })

    socket.connect()

    return () => {
      unsubStatus()
      unsubMessage()
      unsubOpen()
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (socketRef.current?.status !== 'open') return

      const inStock = products.filter((p) => {
        const current = stockOverrides[p.id] ?? p.stockCount
        return current > 0
      })
      if (inStock.length === 0) return

      const product = inStock[Math.floor(Math.random() * inStock.length)]
      const currentStock = stockOverrides[product.id] ?? product.stockCount
      const nextStock = currentStock - 1

      setStockOverrides((prev) => ({ ...prev, [product.id]: nextStock }))
      socketRef.current?.send({
        type: 'STOCK_UPDATE',
        productId: product.id,
        stockCount: nextStock,
      })
    }, SIMULATION_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [stockOverrides])

  function getLiveStock(product) {
    return stockOverrides[product.id] ?? product.stockCount
  }

  function broadcastStockChange(productId, stockCount) {
    setStockOverrides((prev) => ({ ...prev, [productId]: stockCount }))
    if (socketRef.current?.status === 'open') {
      socketRef.current.send({ type: 'STOCK_UPDATE', productId, stockCount })
    }
  }

  function simulateDisconnect() {
    socketRef.current?.simulateDrop()
  }

  const value = {
    status,
    reconnectAttempt,
    getLiveStock,
    broadcastStockChange,
    simulateDisconnect,
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}