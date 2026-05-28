import { useState } from 'react'
import { nowIso } from '../utils/inventario.utils'

/**
 * Custom hook que maneja las notificaciones de inventario.
 * Expone: notifications, pushNotification, removeNotification
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([])

  function pushNotification(type, message) {
    const item = {
      id: `N-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      message,
      createdAt: nowIso(),
    }
    setNotifications((prev) => [item, ...prev].slice(0, 8))
  }

  function removeNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return { notifications, pushNotification, removeNotification }
}