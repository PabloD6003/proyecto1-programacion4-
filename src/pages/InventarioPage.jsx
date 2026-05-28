import { useEffect, useMemo, useState } from 'react'
import { INVENTORY_SEED } from '../inventory/seed'
import { loadInventory, saveInventory } from '../services/jsonbin'

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function computeEstado(existencia, minimo) {
  if (Number(existencia) <= 0) return 'Agotado'
  if (Number(existencia) <= Number(minimo)) return 'Mínimos'
  return 'Normal'
}

function nowIso() {
  return new Date().toISOString()
}

export default function InventarioPage() {
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState(() => ({ ...INVENTORY_SEED }))
  const productos = inventory.productos ?? []

  const [form, setForm] = useState(() => ({
    id: '',
    nombre: '',
    existencia: 0,
    minimo: 0,
    ubicacion: '',
  }))
  const [editingId, setEditingId] = useState(null)
  const isEditing = Boolean(editingId)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await loadInventory({ seed: INVENTORY_SEED })
        if (!mounted) return
        setInventory({
          version: data?.version ?? 1,
          productos: Array.isArray(data?.productos) ? data.productos : [],
          movimientos: Array.isArray(data?.movimientos) ? data.movimientos : [],
        })
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
      const estado = computeEstado(p.existencia, p.minimo)
      return { ...p, estado }
    })
  }, [productos])

  async function persist(nextInventory) {
    setInventory(nextInventory)
    await saveInventory(nextInventory)
  }

  function resetForm() {
    setForm({ id: '', nombre: '', existencia: 0, minimo: 0, ubicacion: '' })
    setEditingId(null)
  }

  function onEdit(producto) {
    setEditingId(producto.id)
    setForm({
      id: producto.id,
      nombre: producto.nombre ?? '',
      existencia: Number(producto.existencia ?? 0),
      minimo: Number(producto.minimo ?? 0),
      ubicacion: producto.ubicacion ?? '',
    })
  }

  async function onDelete(id) {
    const ok = window.confirm(`¿Eliminar el producto ${id}?`)
    if (!ok) return

    const next = {
      ...inventory,
      productos: productos.filter((p) => p.id !== id),
      movimientos: inventory.movimientos ?? [],
    }
    await persist(next)
    if (editingId === id) resetForm()
  }

  async function onSubmit(e) {
    e.preventDefault()

    const id = form.id.trim()
    const nombre = form.nombre.trim()
    const ubicacion = form.ubicacion.trim()
    const existencia = Number(form.existencia)
    const minimo = Number(form.minimo)

    if (!id) return window.alert('Id es requerido.')
    if (!nombre) return window.alert('Nombre es requerido.')
    if (!Number.isFinite(existencia) || existencia < 0)
      return window.alert('Existencia debe ser un número >= 0.')
    if (!Number.isFinite(minimo) || minimo < 0) return window.alert('Mínimo debe ser un número >= 0.')

    const exists = productos.some((p) => p.id === id)
    if (!isEditing && exists) return window.alert(`Ya existe un producto con id ${id}.`)
    if (isEditing && editingId !== id && exists)
      return window.alert(`No puedes cambiar el id a ${id} porque ya existe.`)

    const ts = nowIso()
    const nextProductos = isEditing
      ? productos.map((p) =>
          p.id === editingId
            ? {
                ...p,
                id,
                nombre,
                ubicacion,
                existencia,
                minimo,
                fechaActualizacion: ts,
              }
            : p,
        )
      : [
          ...productos,
          {
            id,
            nombre,
            ubicacion,
            existencia,
            minimo,
            fechaRegistro: ts,
            fechaActualizacion: ts,
          },
        ]

    const next = { ...inventory, productos: nextProductos, movimientos: inventory.movimientos ?? [] }
    await persist(next)
    resetForm()
  }

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
          <strong>{isEditing ? `Editar producto (${editingId})` : 'Crear producto'}</strong>
        </div>
        <form onSubmit={onSubmit} style={{ padding: 14, display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Id</span>
              <input
                value={form.id}
                onChange={(e) => setForm((s) => ({ ...s, id: e.target.value }))}
                placeholder="Ej: P-004"
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  outline: 'none',
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Nombre</span>
              <input
                value={form.nombre}
                onChange={(e) => setForm((s) => ({ ...s, nombre: e.target.value }))}
                placeholder="Ej: Leche 1L"
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  outline: 'none',
                }}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Existencia</span>
              <input
                type="number"
                min={0}
                value={form.existencia}
                onChange={(e) => setForm((s) => ({ ...s, existencia: e.target.valueAsNumber }))}
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  outline: 'none',
                }}
              />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Mínimo</span>
              <input
                type="number"
                min={0}
                value={form.minimo}
                onChange={(e) => setForm((s) => ({ ...s, minimo: e.target.valueAsNumber }))}
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  outline: 'none',
                }}
              />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Estado (auto)</span>
              <input
                value={computeEstado(form.existencia, form.minimo)}
                disabled
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--bg)',
                }}
              />
            </label>
          </div>

          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Ubicación</span>
            <input
              value={form.ubicacion}
              onChange={(e) => setForm((s) => ({ ...s, ubicacion: e.target.value }))}
              placeholder="Ej: Bodega A - Estante 3"
              style={{
                padding: '10px 12px',
                border: '1px solid var(--border)',
                borderRadius: 8,
                outline: 'none',
              }}
            />
          </label>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            {isEditing ? (
              <button
                type="button"
                onClick={resetForm}
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
            ) : null}
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
                  'Acciones',
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
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
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
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
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

