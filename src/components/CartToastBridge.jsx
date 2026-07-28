import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export function CartToastBridge() {
  const { notification, dismissNotification } = useCart()
  const { addToast } = useToast()

  useEffect(() => {
    if (notification) {
      addToast(notification.type, notification.message)
      dismissNotification()
    }
  }, [notification, addToast, dismissNotification])

  return null
}