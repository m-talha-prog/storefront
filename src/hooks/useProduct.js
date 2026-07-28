import { useEffect, useState } from 'react'

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchProduct() {
      setStatus('loading')
      setError(null)

      try {
        const res = await fetch(`/api/products/${id}`, {
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error(
            res.status === 404 ? 'Product not found' : `Request failed: ${res.status}`
          )
        }

        const data = await res.json()
        setProduct(data)
        setStatus('success')
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      }
    }

    fetchProduct()

    return () => controller.abort()
  }, [id])

  return { product, status, error }
}