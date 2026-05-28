import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

export function AppLayout() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <Link to="/" className="brand">
          Gestion App
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/inventario">Inventario</Link>
            <span className="nav-user">{user?.email}</span>
            <button type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <span className="nav-guest">Invitado</span>
        )}
      </nav>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
