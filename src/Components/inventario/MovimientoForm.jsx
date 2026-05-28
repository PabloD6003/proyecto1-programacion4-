/**
 * Formulario para registrar entradas y salidas de stock.
 *
 * @param {{
 *   movForm: object,
 *   setMovForm: Function,
 *   onSubmit: Function,
 *   rows: Array,           // productos con estado calculado
 * }} props
 */
export default function MovimientoForm({ movForm, setMovForm, onSubmit, rows }) {
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
        <strong>Entrada / Salida de stock</strong>
      </div>

      <form onSubmit={onSubmit} style={{ padding: 14, display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 12 }}>
          {/* Producto */}
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Producto</span>
            <select
              value={movForm.productoId}
              onChange={(e) => setMovForm((s) => ({ ...s, productoId: e.target.value }))}
              style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8 }}
            >
              <option value="">Seleccione…</option>
              {rows.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} - {p.nombre} (Stock: {p.existencia})
                </option>
              ))}
            </select>
          </label>

          {/* Tipo */}
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Tipo</span>
            <select
              value={movForm.tipo}
              onChange={(e) => setMovForm((s) => ({ ...s, tipo: e.target.value }))}
              style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8 }}
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </label>

          {/* Cantidad */}
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Cantidad</span>
            <input
              type="number"
              min={1}
              value={movForm.cantidad}
              onChange={(e) => setMovForm((s) => ({ ...s, cantidad: e.target.valueAsNumber }))}
              style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8 }}
            />
          </label>

          {/* Botón */}
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button
              type="submit"
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--accent)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Registrar
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}