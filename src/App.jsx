import React from 'react'
import './App.css'
import { Link, Outlet } from '@tanstack/react-router'
import DonacionesPage from './pages/Donaciones/DonacionesPage'

function App() {
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
          <Link to="/gastos" className="nav-item">
            <i className="fas fa-cart-shopping" />
            <span>Registro de Gastos</span>
          </Link>
          <Link to="/beneficiarios" className="nav-item">
            <i className="fas fa-people-group" />
            <span>Gestión de Beneficiarios</span>
          </Link>
          <Link to="/donaciones" className="nav-item">
            <i className="fas fa-hand-holding-heart" />
            <span>Donaciones</span>
          </Link>
          <Link to="/acceso" className="nav-item">
            <i className="fas fa-chart-bar" />
            <span>Gestión de Acceso</span>
          </Link>
        </nav>
      </aside>
      <div className="overlay" id="overlay" />
      <div className="main-wrapper">
        <header className="topbar">
          <button className="hamburger" id="hamburgerBtn">
            <i className="fas fa-bars" />
          </button>
          <div className="topbar-right">
            <div className="avatar">
              <img
                src="https://i.pinimg.com/236x/00/2e/94/002e94da353f89fc849a7f6112c5b066.jpg"
                alt="user"
              />
              <i className="fas fa-chevron-down" />
            </div>
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