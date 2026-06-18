import './App.css'
import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import useAuth from './modules/auth/hooks/useAuth'

function App() {
  const { usuario, logout, tienePermiso } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const esAdminOSuper =
    usuario?.rol === 'superusuario' || usuario?.rol === 'administrador'

  const puedeGestionarAcceso =
    tienePermiso('roles.gestionar') || tienePermiso('roles.asignar')

  const puedeDonar = true // todos pueden donar

  const puedeVerInventario = esAdminOSuper || tienePermiso('INVENTARIO_VER')
  const puedeVerGastos = esAdminOSuper || tienePermiso('GASTOS_VER')

  const puedeVerBeneficiarios =
    usuario?.rol === 'superusuario' || usuario?.rol === 'administrador'

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <i className="fas fa-cube" />
            </div>
            <span className="logo-text">
              SISTEMA
              <br />
              SIGAC
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">

          {/* Inicio */}
          <Link to="/" className="nav-item">
            <i className="fas fa-house" />
            <span>Inicio</span>
          </Link>

          {/* Inventario */}
          {puedeVerInventario && (
            <Link to="/inventario" className="nav-item">
              <i className="fas fa-box-archive" />
              <span>Inventario</span>
            </Link>
          )}

          {/* Gastos */}
          {puedeVerGastos && (
            <Link to="/gastos" className="nav-item">
              <i className="fas fa-cart-shopping" />
              <span>Registro de Gastos</span>
            </Link>
          )}

          {/* Beneficiarios */}
          {puedeVerBeneficiarios && (
            <Link to="/beneficiarios" className="nav-item">
              <i className="fas fa-people-group" />
              <span>Gestión de Beneficiarios</span>
            </Link>
          )}

          {/* Donaciones (clave) */}
          {puedeDonar && (
            <Link
              to={esAdminOSuper ? "/donaciones" : "/donar"}
              className="nav-item"
            >
              <i className="fas fa-hand-holding-heart" />
              <span>Donaciones</span>
            </Link>
          )}

          {/* Acceso */}
          {puedeGestionarAcceso && (
            <Link to="/acceso" className="nav-item">
              <i className="fas fa-chart-bar" />
              <span>Gestión de Acceso</span>
            </Link>
          )}

        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-right">
            <span className="usuario-nombre">{usuario?.nombre}</span>
            <button onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>

        <footer style={{
          textAlign: 'center',
          padding: '16px',
          color: '#6b7280',
          borderTop: '1px solid #e5e7eb',
          fontSize: '13px'
        }}>
          © 2026 Sistema SIGAC - Universidad Nacional de Costa Rica
        </footer>
      </div>
    </>
  )
}

export default App