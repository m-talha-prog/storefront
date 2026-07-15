import { http, HttpResponse } from 'msw'
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
]