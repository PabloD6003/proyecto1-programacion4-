import { useState } from 'react'

const TIPO_LABELS = {
  jefa_de_hogar: 'Jefa de Hogar',
  adulto_mayor: 'Adulto Mayor',
  familia: 'Familia',
  nino: 'Niño/a',
  vulnerable: 'Vulnerable',
}

function CheckInList({ beneficiariosActivos, estaPresente, onToggle, loading }) {
  const [togglingId, setTogglingId] = useState(null)

  const handleToggle = async (id) => {
    if (togglingId) return
    try {
      setTogglingId(id)
      await onToggle(id)
    } finally {
      setTogglingId(null)
    }
  }

  const totalPresentes = beneficiariosActivos.filter((b) => estaPresente(b.id)).length

  if (loading) {
    return (
      <div className="page-state page-state--loading">
        <i className="fas fa-spinner fa-spin" />
        <p>Cargando asistencia...</p>
      </div>
    )
  }

  if (beneficiariosActivos.length === 0) {
    return (
      <div className="page-state">
        <i className="fas fa-inbox" />
        <p>No hay beneficiarios activos registrados</p>
      </div>
    )
  }

  return (
    <div className="checkin-list">
      <div className="checkin-summary">
        <span className="checkin-summary__count">
          <i className="fas fa-user-check" />
          <strong>{totalPresentes}</strong> de {beneficiariosActivos.length} presentes
        </span>
        <div className="checkin-summary__bar">
          <div
            className="checkin-summary__bar-fill"
            style={{ width: `${(totalPresentes / beneficiariosActivos.length) * 100}%` }}
          />
        </div>
      </div>

      <ul className="checkin-items">
        {beneficiariosActivos.map((b) => {
          const presente = estaPresente(b.id)
          const toggling = togglingId === b.id

          return (
            <li
              key={b.id}
              className={`checkin-item ${presente ? 'checkin-item--presente' : ''}`}
            >
              <div className="checkin-item__info">
                <span className="checkin-item__name">{b.nombreCompleto}</span>
                <span className={`badge badge--tipo badge--${b.tipoBeneficiario}`}>
                  {TIPO_LABELS[b.tipoBeneficiario] ?? b.tipoBeneficiario}
                </span>
                {b.telefono && (
                  <span className="checkin-item__phone">
                    <i className="fas fa-phone" /> {b.telefono}
                  </span>
                )}
              </div>

              <button
                className={`checkin-toggle ${presente ? 'checkin-toggle--presente' : 'checkin-toggle--ausente'}`}
                onClick={() => handleToggle(b.id)}
                disabled={toggling}
                title={presente ? 'Marcar como ausente' : 'Marcar como presente'}
              >
                {toggling ? (
                  <i className="fas fa-spinner fa-spin" />
                ) : presente ? (
                  <><i className="fas fa-check" /> Presente</>
                ) : (
                  <><i className="fas fa-xmark" /> Ausente</>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CheckInList
