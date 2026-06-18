import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes/router'
import useAuth from './modules/auth/hooks/useAuth'

export default function AppRouter() {
  const auth = useAuth()

  if (auth.cargando) {
    return <div className="acc-alert acc-alert--loading">Cargando sesión...</div>
  }

  return <RouterProvider router={router} context={{ auth }} />
}
