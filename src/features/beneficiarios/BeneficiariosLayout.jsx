import { Link, Outlet } from '@tanstack/react-router'
import useAuth from '../../modules/auth/hooks/useAuth'
import SinPermisoPage from '../../modules/acceso/pages/SinPermisoPage'
import './beneficiarios.css'

function BeneficiariosLayout() {
  const { usuario } = useAuth()
  const rol = usuario?.rol

  const puedeVerBeneficiarios = rol === 'superusuario'
  const puedeVerAsistencia = rol === 'superusuario' || rol === 'administrador'

  if (!puedeVerAsistencia) {
    return <SinPermisoPage />
  }

  return (
    <div className="beneficiarios-module">
      <div className="module-header">
        <h1 className="module-title">
          <i className="fas fa-people-group" />
          Gestión de Beneficiarios
        </h1>

        <nav className="module-tabs">
          {puedeVerBeneficiarios && (
            <Link
              to="/beneficiarios"
              className="tab-link"
              activeProps={{ className: 'tab-link tab-link--active' }}
              activeOptions={{ exact: true }}
            >
              <i className="fas fa-list" />
              Beneficiarios
            </Link>
          )}
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
