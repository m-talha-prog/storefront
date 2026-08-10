import { http, HttpResponse, delay } from 'msw'
import { products } from './data/products'

export const handlers = [
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')

    let result = products

    if (category) {
      result = result.filter((p) => p.category === category)
    }

    if (search) {
      const term = search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(term))
    }

    return HttpResponse.json(result)
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = products.find((p) => p.id === Number(params.id))

    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return HttpResponse.json(product)
  }),

  http.post('/api/cart/sync', async ({ request }) => {
    await delay(400)
    const body = await request.json()
    const shouldFail = Math.random() < 0.2

    if (shouldFail) {
      return HttpResponse.json(
        { error: 'Could not sync cart change' },
        { status: 500 }
      )
    }

    return HttpResponse.json({ success: true, received: body })
  }),

  http.post('/api/orders', async ({ request }) => {
    await delay(600)
    const body = await request.json()

    // Authoritative stock check — this does NOT trust whatever the client's
    // live inventory view believed. A real backend would check its own
    // database here; this mock checks the base product data as its stand-in
    // "source of truth." The client-side live-stock check in ConfirmationStep
    // is a UX convenience that catches the common case early — this is the
    // check that actually decides whether the order is valid.
    const insufficientItem = (body.items || []).find((item) => {
      const product = products.find((p) => p.id === item.id)
      return !product || item.quantity > product.stockCount
    })

    if (insufficientItem) {
      return HttpResponse.json(
        {
          error: `${insufficientItem.name} no longer has enough stock for this order. Please update your cart.`,
        },
        { status: 409 }
      )
    }

    const shouldFail = Math.random() < 0.15

    if (shouldFail) {
      return HttpResponse.json(
        { error: 'Payment could not be processed. Please try again.' },
        { status: 500 }
      )
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
    return HttpResponse.json({ orderId, ...body })
  }),
]