import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { ToastContainer } from '../components/toast/ToastContainer'

const ToastContext = createContext(null)

let nextId = 1
const AUTO_DISMISS_MS = 4000

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timeoutsRef = useRef({})

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    clearTimeout(timeoutsRef.current[id])
    delete timeoutsRef.current[id]
  }, [])

  const addToast = useCallback(
    (type, message) => {
      const id = nextId++
      setToasts((current) => [...current, { id, type, message }])

      timeoutsRef.current[id] = setTimeout(() => {
        removeToast(id)
      }, AUTO_DISMISS_MS)
    },
    [removeToast]
  )

  const value = { addToast, removeToast }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}