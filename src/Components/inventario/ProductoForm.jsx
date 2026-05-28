import { computeEstado } from '../../utils/inventario.utils'

const inputStyle = {
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: 8,
  outline: 'none',
}

/**
 * Formulario para crear o editar un producto del inventario.
 *
 * @param {{
 *   form: object,
 *   setForm: Function,
 *   isEditing: boolean,
 *   editingId: string | null,
 *   onSubmit: Function,
 *   onCancel: Function,
 * }} props
 */
export default function ProductoForm({ form, setForm, isEditing, editingId, onSubmit, onCancel }) {
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
        <strong>{isEditing ? `Editar producto (${editingId})` : 'Crear producto'}</strong>
      </div>

      <form onSubmit={onSubmit} style={{ padding: 14, display: 'grid', gap: 12 }}>
        {/* Fila 1: Id + Nombre */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Id</span>
            <input
              value={form.id}
              onChange={(e) => setForm((s) => ({ ...s, id: e.target.value }))}
              placeholder="Ej: P-004"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Nombre</span>
            <input
              value={form.nombre}
              onChange={(e) => setForm((s) => ({ ...s, nombre: e.target.value }))}
              placeholder="Ej: Leche 1L"
              style={inputStyle}
            />
          </label>
        </div>

        {/* Fila 2: Existencia + Mínimo + Estado */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Existencia</span>
            <input
              type="number"
              min={0}
              value={form.existencia}
              onChange={(e) => setForm((s) => ({ ...s, existencia: e.target.valueAsNumber }))}
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Mínimo</span>
            <input
              type="number"
              min={0}
              value={form.minimo}
              onChange={(e) => setForm((s) => ({ ...s, minimo: e.target.valueAsNumber }))}
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Estado (auto)</span>
            <input
              value={computeEstado(form.existencia, form.minimo)}
              disabled
              style={{ ...inputStyle, background: 'var(--bg)' }}
            />
          </label>
        </div>

        {/* Fila 3: Ubicación */}
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Ubicación</span>
          <input
            value={form.ubicacion}
            onChange={(e) => setForm((s) => ({ ...s, ubicacion: e.target.value }))}
            placeholder="Ej: Bodega A - Estante 3"
            style={inputStyle}
          />
        </label>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--white)',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          )}
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
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </section>
  )
}