import { createContext, useContext, useState } from 'react'
import { useMachine } from '@xstate/react'
import { cartMachine } from '../machines/cartMachine'
import { performOptimisticUpdate } from '../utils/performOptimisticUpdate'

const CartContext = createContext(null)

async function syncCartChange(action, payload) {
  const res = await fetch('/api/cart/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  })

  if (!res.ok) {
    throw new Error(`Cart sync failed: ${res.status}`)
  }

  return res.json()
}

export function CartProvider({ children }) {
  const [snapshot, send] = useMachine(cartMachine)
  const [isOpen, setIsOpen] = useState(false)

  const items = snapshot.context.items

  async function addItem(product) {
    const previousItems = items

    await performOptimisticUpdate({
      applyOptimistic: () => send({ type: 'ADD_ITEM', product }),
      rollback: () => send({ type: 'ROLLBACK', items: previousItems }),
      syncFn: () => syncCartChange('add', { productId: product.id }),
    })
  }

  async function removeItem(id) {
    const previousItems = items

    await performOptimisticUpdate({
      applyOptimistic: () => send({ type: 'REMOVE_ITEM', id }),
      rollback: () => send({ type: 'ROLLBACK', items: previousItems }),
      syncFn: () => syncCartChange('remove', { productId: id }),
    })
  }

  async function updateQuantity(id, quantity) {
    const previousItems = items

    await performOptimisticUpdate({
      applyOptimistic: () => send({ type: 'UPDATE_QUANTITY', id, quantity }),
      rollback: () => send({ type: 'ROLLBACK', items: previousItems }),
      syncFn: () => syncCartChange('update', { productId: id, quantity }),
    })
  }

  const value = {
    items,
    notification: snapshot.context.notification,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    clearCart: () => send({ type: 'CLEAR_CART' }),
    dismissNotification: () => send({ type: 'DISMISS_NOTIFICATION' }),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((prev) => !prev),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}