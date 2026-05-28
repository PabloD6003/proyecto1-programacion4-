import { formatDateTime } from '../../utils/inventario.utils'

const HEADERS = [
  'Id', 'Nombre', 'Existencia', 'Mínimo',
  'Estado', 'Ubicación', 'Fecha registro', 'Última actualización', 'Acciones',
]

const cellStyle = { padding: 12, borderBottom: '1px solid var(--border)' }

/**
 * Tabla de productos del inventario con acciones de editar y eliminar.
 *
 * @param {{
 *   rows: Array,
 *   loading: boolean,
 *   onEdit: (producto: object) => void,
 *   onDelete: (id: string) => void,
 * }} props
 */
export default function ProductosTable({ rows, loading, onEdit, onDelete }) {
  return (
    <section
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 14, borderBottom: '1px solid var(--border)' }}>
        <strong>Productos</strong>
      </div>

      {loading && (
        <div style={{ padding: 16, color: 'var(--text-secondary)' }}>Cargando inventario…</div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg)' }}>
              {HEADERS.map((h) => (
                <th key={h} style={cellStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td style={cellStyle}>{p.id}</td>
                <td style={cellStyle}>{p.nombre}</td>
                <td style={cellStyle}>{p.existencia}</td>
                <td style={cellStyle}>{p.minimo}</td>
                <td style={cellStyle}>{p.estado}</td>
                <td style={cellStyle}>{p.ubicacion}</td>
                <td style={cellStyle}>{formatDateTime(p.fechaRegistro)}</td>
                <td style={cellStyle}>{formatDateTime(p.fechaActualizacion)}</td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => onEdit(p)}
                      style={{
                        padding: '7px 10px',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: 'var(--white)',
                        cursor: 'pointer',
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(p.id)}
                      style={{
                        padding: '7px 10px',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: 'var(--red-bg)',
                        color: '#991b1b',
                        cursor: 'pointer',
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  style={{ padding: 16, color: 'var(--text-secondary)', textAlign: 'center' }}
                >
                  Sin productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}