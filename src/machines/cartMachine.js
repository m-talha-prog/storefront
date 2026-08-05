import { setup, assign } from 'xstate'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export const cartMachine = setup({
  guards: {
    itemExists: ({ context, event }) =>
      context.items.some((item) => item.id === event.product.id),
  },
  actions: {
    addNewItem: assign({
      items: ({ context, event }) => {
        const quantity = clamp(1, 1, event.product.stockCount)
        return [
          ...context.items,
          {
            id: event.product.id,
            name: event.product.name,
            price: event.product.price,
            image: event.product.image,
            stockCount: event.product.stockCount,
            quantity,
          },
        ]
      },
      notification: ({ event }) => ({
        type: 'success',
        message: `${event.product.name} added to cart`,
      }),
    }),

    incrementExistingItem: assign({
      items: ({ context, event }) =>
        context.items.map((item) => {
          if (item.id !== event.product.id) return item
          const nextQuantity = clamp(item.quantity + 1, 1, item.stockCount)
          return { ...item, quantity: nextQuantity }
        }),
      notification: ({ context, event }) => {
        const existing = context.items.find((item) => item.id === event.product.id)
        const atLimit = existing && existing.quantity >= existing.stockCount
        return atLimit
          ? { type: 'error', message: `Only ${existing.stockCount} in stock` }
          : { type: 'success', message: `${event.product.name} quantity updated` }
      },
    }),

    removeItem: assign({
      items: ({ context, event }) =>
        context.items.filter((item) => item.id !== event.id),
      notification: () => ({ type: 'success', message: 'Item removed from cart' }),
    }),

    updateQuantity: assign({
      items: ({ context, event }) =>
        context.items.map((item) => {
          if (item.id !== event.id) return item
          const nextQuantity = clamp(event.quantity, 1, item.stockCount)
          return { ...item, quantity: nextQuantity }
        }),
      notification: ({ context, event }) => {
        const item = context.items.find((item) => item.id === event.id)
        if (!item) return context.notification
        const clamped = clamp(event.quantity, 1, item.stockCount)
        if (clamped !== event.quantity) {
          return { type: 'error', message: `Only ${item.stockCount} in stock` }
        }
        return null
      },
    }),

    clearCart: assign({
      items: () => [],
      notification: () => ({ type: 'success', message: 'Cart cleared' }),
    }),

    dismissNotification: assign({
      notification: () => null,
    }),

    // Restores a previous item list after a failed sync. Deliberately narrow —
    // this only ever restores `items` and sets an error notification. It does
    // NOT accept arbitrary state, so it can't be used to bypass the guards
    // above (e.g. to smuggle in a quantity beyond stock).
    rollbackItems: assign({
      items: ({ event }) => event.items,
      notification: () => ({
        type: 'error',
        message: 'Could not save your change — it was reverted.',
      }),
    }),
  },
}).createMachine({
  id: 'cart',
  initial: 'idle',
  context: {
    items: [],
    notification: null,
  },
  states: {
    idle: {
      on: {
        ADD_ITEM: [
          {
            guard: 'itemExists',
            actions: 'incrementExistingItem',
          },
          {
            actions: 'addNewItem',
          },
        ],
        REMOVE_ITEM: {
          actions: 'removeItem',
        },
        UPDATE_QUANTITY: {
          actions: 'updateQuantity',
        },
        CLEAR_CART: {
          actions: 'clearCart',
        },
        DISMISS_NOTIFICATION: {
          actions: 'dismissNotification',
        },
        ROLLBACK: {
          actions: 'rollbackItems',
        },
      },
    },
  },
})