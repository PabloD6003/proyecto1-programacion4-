import { Link, Outlet } from '@tanstack/react-router'
import './beneficiarios.css'

function BeneficiariosLayout() {
  return (
    <div className="beneficiarios-module">
      <div className="module-header">
        <h1 className="module-title">
          <i className="fas fa-people-group" />
          Gestión de Beneficiarios
        </h1>

        <nav className="module-tabs">
          <Link
            to="/beneficiarios"
            className="tab-link"
            activeProps={{ className: 'tab-link tab-link--active' }}
            activeOptions={{ exact: true }}
          >
            <i className="fas fa-list" />
            Beneficiarios
          </Link>
          <Link
            to="/beneficiarios/asistencia"
            className="tab-link"
            activeProps={{ className: 'tab-link tab-link--active' }}
          >
            <i className="fas fa-clipboard-check" />
            Asistencia
          </Link>
        </nav>
      </div>

      <div className="module-content">
        <Outlet />
      </div>
    </div>
  )
}

export default BeneficiariosLayout
