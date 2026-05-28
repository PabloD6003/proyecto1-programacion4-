import { formatDateTime } from '../../utils/inventario.utils'

const HEADERS = [
  'Fecha', 'Producto', 'Tipo', 'Cantidad', 'Existencia anterior', 'Existencia nueva',
]

const cellStyle = { padding: 12, borderBottom: '1px solid var(--border)' }

/**
 * Tabla del historial de movimientos de stock, ordenados del más reciente al más antiguo.
 *
 * @param {{ movimientosRows: Array }} props
 */
export default function MovimientosTable({ movimientosRows }) {
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
        <strong>Historial de movimientos</strong>
      </div>

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
            {movimientosRows.map((m) => (
              <tr key={m.id}>
                <td style={cellStyle}>{formatDateTime(m.fecha)}</td>
                <td style={cellStyle}>{m.productoId} - {m.nombreProducto}</td>
                <td style={cellStyle}>{m.tipo === 'entrada' ? 'Entrada' : 'Salida'}</td>
                <td style={cellStyle}>{m.cantidad}</td>
                <td style={cellStyle}>{m.existenciaAnterior}</td>
                <td style={cellStyle}>{m.existenciaNueva}</td>
              </tr>
            ))}
            {movimientosRows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: 16, color: 'var(--text-secondary)', textAlign: 'center' }}
                >
                  Sin movimientos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}