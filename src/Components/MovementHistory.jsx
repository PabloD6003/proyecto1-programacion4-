import { useMemo, useState } from 'react'
import {
  filterMovementsByDate,
  getAllMovements,
  MOVEMENT_TYPES,
} from '../utils/inventory'

export function MovementHistory({ items }) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [tipoFilter, setTipoFilter] = useState('')

  const movements = useMemo(() => {
    let list = getAllMovements(items)
    list = filterMovementsByDate(list, fromDate || null, toDate || null)
    if (tipoFilter) list = list.filter((m) => m.tipo === tipoFilter)
    return list
  }, [items, fromDate, toDate, tipoFilter])

  return (
    <div className="card movement-history">
      <h3>Historial de movimientos</h3>

      <div className="filters-row">
        <label>
          Desde
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          Hasta
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <label>
          Tipo
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value={MOVEMENT_TYPES.ENTRADA}>Entrada</option>
            <option value={MOVEMENT_TYPES.SALIDA}>Salida</option>
          </select>
        </label>
        {(fromDate || toDate || tipoFilter) && (
          <button
            type="button"
            onClick={() => {
              setFromDate('')
              setToDate('')
              setTipoFilter('')
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {movements.length === 0 ? (
        <p className="empty">No hay movimientos en el rango seleccionado.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Recurso</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id}>
                <td>{m.fecha}</td>
                <td>
                  {m.itemNombre} <span className="muted">({m.itemSku})</span>
                </td>
                <td>
                  <span className={`badge badge-${m.tipo}`}>{m.tipo}</span>
                </td>
                <td>{m.cantidad}</td>
                <td>{m.nota || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
