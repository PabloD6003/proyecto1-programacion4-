import { createContext, useCallback, useContext, useState } from 'react'
import { createPortal } from 'react-dom'

const NotificationContext = createContext(null)

const TOAST_DURATION_MS = 4500

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (message, type = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      setToasts((current) => [...current, { id, message, type }])
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS)
    },
    [dismiss],
  )

  return (
    <NotificationContext.Provider value={{ notify, dismiss }}>
      {children}
      {createPortal(
        <div className="toast-container" aria-live="polite" aria-atomic="false">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              role="status"
            >
              <span>{toast.message}</span>
              <button
                type="button"
                className="toast-close"
                onClick={() => dismiss(toast.id)}
                aria-label="Cerrar notificación"
              >
                ×
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider')
  }
  return ctx
}
