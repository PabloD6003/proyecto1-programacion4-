import { useState } from 'react'
import useBeneficiarios from '../../../hooks/useBeneficiarios'
import useAsistencia from '../../../hooks/useAsistencia'
import CheckInList from '../components/CheckInList'

const hoy = () => new Date().toISOString().split('T')[0]

function AsistenciaPage() {
  const [fecha, setFecha] = useState(hoy)

  const { beneficiarios, loading: loadingBeneficiarios } = useBeneficiarios()
  const { loading: loadingAsistencia, estaPresente, toggleAsistencia, error } =
    useAsistencia(fecha)

  const activos = beneficiarios.filter((b) => b.activo)
  const loading = loadingBeneficiarios || loadingAsistencia

  return (
    <div className="page">
      <div className="asistencia-header">
        <div className="asistencia-date-picker">
          <label className="form-label" htmlFor="fecha-asistencia">
            <i className="fas fa-calendar-days" />
            Fecha de asistencia
          </label>
          <input
            id="fecha-asistencia"
            type="date"
            className="form-input date-input"
            value={fecha}
            max={hoy()}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="asistencia-date-info">
          <i className="fas fa-circle-info" />
          <span>
            Haz clic en el botón de cada beneficiario para marcar o quitar su
            asistencia del día seleccionado.
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert--error">
          <i className="fas fa-circle-exclamation" />
          {error}
        </div>
      )}

      <CheckInList
        beneficiariosActivos={activos}
        estaPresente={estaPresente}
        onToggle={toggleAsistencia}
        loading={loading}
      />
    </div>
  )
}

export default AsistenciaPage
