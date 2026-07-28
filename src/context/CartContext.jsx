import { createContext, useContext, useState } from 'react'
import { useMachine } from '@xstate/react'
import { cartMachine } from '../machines/cartMachine'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [snapshot, send] = useMachine(cartMachine)
  const [isOpen, setIsOpen] = useState(false)

  const value = {
    items: snapshot.context.items,
    notification: snapshot.context.notification,
    itemCount: snapshot.context.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: snapshot.context.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    addItem: (product) => send({ type: 'ADD_ITEM', product }),
    removeItem: (id) => send({ type: 'REMOVE_ITEM', id }),
    updateQuantity: (id, quantity) => send({ type: 'UPDATE_QUANTITY', id, quantity }),
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