import { useEffect, useState } from 'react'

export function useProducts({ search, category }) {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchProducts() {
      setStatus('loading')
      setError(null)

      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category) params.set('category', category)

      try {
        const res = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`)
        }

        const data = await res.json()
        setProducts(data)
        setStatus('success')
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      }
    }

    fetchProducts()

    return () => controller.abort()
  }, [search, category])

  return { products, status, error }
}