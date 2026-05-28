import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  </AuthProvider>,
)
