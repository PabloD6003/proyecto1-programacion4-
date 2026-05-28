import { useEffect, useMemo, useState } from 'react'
import { INVENTORY_SEED } from '../inventory/seed'
import { loadInventory } from '../services/jsonbin'

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export default function InventarioPage() {
  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await loadInventory({ seed: INVENTORY_SEED })
        if (!mounted) return
        setProductos(Array.isArray(data?.productos) ? data.productos : [])
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const rows = useMemo(() => {
    return productos.map((p) => {
      const estado =
        p.existencia <= 0 ? 'Agotado' : p.existencia <= p.minimo ? 'Mínimos' : 'Normal'
      return { ...p, estado }
    })
  }, [productos])

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>Inventario</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Productos cargados desde JsonBin (o localStorage si falta configuración).
          </p>
        </div>
      </header>

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
        {loading ? (
          <div style={{ padding: 16, color: 'var(--text-secondary)' }}>Cargando inventario…</div>
        ) : null}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: 'left', background: 'var(--bg)' }}>
                {[
                  'Id',
                  'Nombre',
                  'Existencia',
                  'Mínimo',
                  'Estado',
                  'Ubicación',
                  'Fecha registro',
                  'Última actualización',
                ].map((h) => (
                  <th key={h} style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>{p.id}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {p.nombre}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {p.existencia}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {p.minimo}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {p.estado}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {p.ubicacion}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {formatDateTime(p.fechaRegistro)}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {formatDateTime(p.fechaActualizacion)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ padding: 16, color: 'var(--text-secondary)', textAlign: 'center' }}
                  >
                    Sin productos
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

