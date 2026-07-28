import { describe, it, expect, beforeEach } from 'vitest'
import { createActor } from 'xstate'
import { cartMachine } from '../machines/cartMachine'

// A reusable fake product, shaped exactly like real data from products.js
function makeProduct(overrides = {}) {
  return {
    id: 1,
    name: 'Wireless Headphones',
    price: 49.99,
    image: 'https://example.com/image.jpg',
    stockCount: 3,
    ...overrides,
  }
}

describe('cartMachine', () => {
  let actor

  // Runs before EVERY test — guarantees each test starts from a fresh,
  // untouched machine instance, so tests can never leak state into each other.
  beforeEach(() => {
    actor = createActor(cartMachine).start()
  })

  it('starts with an empty cart and no notification', () => {
    const { context } = actor.getSnapshot()

    expect(context.items).toEqual([])
    expect(context.notification).toBeNull()
  })

  it('adds a new item with quantity 1 when the product is not already in the cart', () => {
    const product = makeProduct()

    actor.send({ type: 'ADD_ITEM', product })

    const { context } = actor.getSnapshot()
    expect(context.items).toHaveLength(1)
    expect(context.items[0]).toMatchObject({
      id: product.id,
      name: product.name,
      quantity: 1,
    })
  })

  it('increments quantity instead of duplicating when adding the same product twice', () => {
    const product = makeProduct()

    actor.send({ type: 'ADD_ITEM', product })
    actor.send({ type: 'ADD_ITEM', product })

    const { context } = actor.getSnapshot()
    expect(context.items).toHaveLength(1)
    expect(context.items[0].quantity).toBe(2)
  })

  it('does not increment quantity past the product stock limit', () => {
    const product = makeProduct({ stockCount: 2 })

    actor.send({ type: 'ADD_ITEM', product })
    actor.send({ type: 'ADD_ITEM', product })
    actor.send({ type: 'ADD_ITEM', product }) // third add — should be blocked by the limit

    const { context } = actor.getSnapshot()
    expect(context.items[0].quantity).toBe(2)
    expect(context.notification.type).toBe('error')
  })

  it('removes the correct item, leaving other items untouched', () => {
    const headphones = makeProduct({ id: 1, name: 'Headphones' })
    const mug = makeProduct({ id: 2, name: 'Mug' })

    actor.send({ type: 'ADD_ITEM', product: headphones })
    actor.send({ type: 'ADD_ITEM', product: mug })
    actor.send({ type: 'REMOVE_ITEM', id: 1 })

    const { context } = actor.getSnapshot()
    expect(context.items).toHaveLength(1)
    expect(context.items[0].id).toBe(2)
  })

  it('updates quantity to a valid value within stock limits', () => {
    const product = makeProduct({ stockCount: 5 })
    actor.send({ type: 'ADD_ITEM', product })

    actor.send({ type: 'UPDATE_QUANTITY', id: product.id, quantity: 4 })

    const { context } = actor.getSnapshot()
    expect(context.items[0].quantity).toBe(4)
  })

  it('clamps quantity down to stock limit when an out-of-range value is requested', () => {
    const product = makeProduct({ stockCount: 5 })
    actor.send({ type: 'ADD_ITEM', product })

    actor.send({ type: 'UPDATE_QUANTITY', id: product.id, quantity: 99 })

    const { context } = actor.getSnapshot()
    expect(context.items[0].quantity).toBe(5)
    expect(context.notification.type).toBe('error')
  })

  it('clamps quantity up to 1 when a value below 1 is requested', () => {
    const product = makeProduct({ stockCount: 5 })
    actor.send({ type: 'ADD_ITEM', product })

    actor.send({ type: 'UPDATE_QUANTITY', id: product.id, quantity: 0 })

    const { context } = actor.getSnapshot()
    expect(context.items[0].quantity).toBe(1)
  })

  it('clears every item from the cart', () => {
    actor.send({ type: 'ADD_ITEM', product: makeProduct({ id: 1 }) })
    actor.send({ type: 'ADD_ITEM', product: makeProduct({ id: 2 }) })

    actor.send({ type: 'CLEAR_CART' })

    const { context } = actor.getSnapshot()
    expect(context.items).toEqual([])
  })

  it('dismisses the current notification', () => {
    actor.send({ type: 'ADD_ITEM', product: makeProduct() })
    expect(actor.getSnapshot().context.notification).not.toBeNull()

    actor.send({ type: 'DISMISS_NOTIFICATION' })

    expect(actor.getSnapshot().context.notification).toBeNull()
  })
})