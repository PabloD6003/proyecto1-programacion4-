import './App.css'
import { Link, Outlet } from '@tanstack/react-router'
import useAuth from './modules/auth/hooks/useAuth'

function App() {
  const { usuario, logout, tienePermiso } = useAuth()
  const puedeGestionarAcceso = tienePermiso('roles.gestionar') || tienePermiso('roles.asignar')
  const puedeDonar = tienePermiso('donaciones.crear')
  const puedeVerBeneficiarios = usuario?.rol === 'superusuario' || usuario?.rol === 'administrador'
  const visualizarGastos = usuario?.rol === 'superusuario' || usuario?.rol === 'administrador'
  return (
    <>
      <aside className="sidebar" id="sidebar">
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
          <button className="sidebar-close" id="sidebarClose">
            <i className="fas fa-times" />
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <i className="fas fa-house" />
            <span>Inicio</span>
          </Link>
          <Link to="/inventario" className="nav-item">
            <i className="fas fa-box-archive" />
            <span>Inventario</span>
           </Link>
          {visualizarGastos && (
          <Link to="/gastos" className="nav-item">
            <i className="fas fa-cart-shopping" />
            <span>Registro de Gastos</span>
          </Link>
          )}
          {puedeVerBeneficiarios && (
            <Link to="/beneficiarios" className="nav-item">
              <i className="fas fa-people-group" />
              <span>Gestión de Beneficiarios</span>
            </Link>
          )}
          {puedeDonar && (
            <Link to="/donaciones" className="nav-item">
              <i className="fas fa-hand-holding-heart" />
              <span>Donaciones</span>
            </Link>
          )}
          {puedeGestionarAcceso && (
            <Link to="/acceso" className="nav-item">
              <i className="fas fa-chart-bar" />
              <span>Gestión de Acceso</span>
            </Link>
          )}
        </nav>
      </aside>

      <div className="overlay" id="overlay" />

      <div className="main-wrapper">
        <header className="topbar">
          <button className="hamburger" id="hamburgerBtn">
            <i className="fas fa-bars" />
          </button>
          <div className="topbar-right">
            <span className="usuario-nombre">{usuario?.nombre}</span>
            <button type="button" className="btn-cerrar-sesion" onClick={logout}>
              <i className="fas fa-right-from-bracket" />
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