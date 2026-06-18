import { formatDateTime } from '../../utils/inventario.utils'

const BG_MAP = {
  create: 'var(--blue-bg)',
  entrada: '#dcfce7',
  salida: '#fee2e2',
}

const LABEL_MAP = {
  create: 'Producto creado',
  entrada: 'Entrada de stock',
  salida: 'Salida de stock',
}

/**
 * Muestra las notificaciones recientes de inventario (creaciones, entradas y salidas).
 *
 * @param {{ notifications: Array, onRemove: (id: string) => void }} props
 */
export default function NotificacionesPanel({ notifications, onRemove }) {
  if (notifications.length === 0) return null

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
        <strong>Notificaciones</strong>
      </div>
      <div style={{ display: 'grid', gap: 8, padding: 12 }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              padding: 10,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: BG_MAP[n.type] ?? 'var(--bg)',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 10,
              alignItems: 'start',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {LABEL_MAP[n.type] ?? n.type}
              </div>
              <div style={{ fontSize: 13 }}>{n.message}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                {formatDateTime(n.createdAt)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(n.id)}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'var(--white)',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Cerrar
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}