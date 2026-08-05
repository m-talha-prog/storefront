import { setup, assign, fromPromise } from 'xstate'

async function submitOrder({ input }) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Order submission failed: ${res.status}`)
  }

  return res.json()
}

export const checkoutMachine = setup({
  actors: {
    submitOrder: fromPromise(submitOrder),
  },
}).createMachine({
  id: 'checkout',
  initial: 'cart',
  context: {
    items: [],
    shippingInfo: null,
    paymentInfo: null,
    orderId: null,
    error: null,
  },
  states: {
    cart: {
      on: {
        PROCEED: 'shipping',
      },
    },

    shipping: {
      on: {
        SUBMIT_SHIPPING: {
          target: 'payment',
          actions: assign({
            shippingInfo: ({ event }) => event.data,
          }),
        },
        BACK: 'cart',
      },
    },

    payment: {
      on: {
        SUBMIT_PAYMENT: {
          target: 'confirmation',
          actions: assign({
            paymentInfo: ({ event }) => event.data,
          }),
        },
        BACK: 'shipping',
      },
    },

    confirmation: {
      on: {
        PLACE_ORDER: {
          target: 'submitting',
          actions: assign({
            items: ({ event }) => event.items,
            error: () => null,
          }),
        },
        BACK: 'payment',
      },
    },

    submitting: {
      invoke: {
        src: 'submitOrder',
        input: ({ context }) => ({
          items: context.items,
          shippingInfo: context.shippingInfo,
          paymentInfo: context.paymentInfo,
        }),
        onDone: {
          target: 'success',
          actions: assign({
            orderId: ({ event }) => event.output.orderId,
          }),
        },
        onError: {
          target: 'confirmation',
          actions: assign({
            error: ({ event }) => event.error.message,
          }),
        },
      },
    },

    success: {
      // Terminal for this flow — a fresh checkout would mount a new
      // machine instance rather than trying to reset this one.
    },
  },
})