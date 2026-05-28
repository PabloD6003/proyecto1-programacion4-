import { useEffect, useMemo, useState } from 'react'
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
  const [inventory, setInventory] = useState(() => ({ version: 1, productos: [], movimientos: [] }))
  const productos = inventory.productos ?? []
  const movimientos = inventory.movimientos ?? []
  const [loadError, setLoadError] = useState('')

  const [form, setForm] = useState(() => ({
    id: '',
    nombre: '',
    existencia: 0,
    minimo: 0,
    ubicacion: '',
  }))
  const [editingId, setEditingId] = useState(null)
  const isEditing = Boolean(editingId)
  const [movForm, setMovForm] = useState(() => ({
    productoId: '',
    tipo: 'entrada',
    cantidad: 1,
  }))
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await loadInventory()
        if (!mounted) return
        setInventory({
          version: data?.version ?? 1,
          productos: Array.isArray(data?.productos) ? data.productos : [],
          movimientos: Array.isArray(data?.movimientos) ? data.movimientos : [],
        })
        setLoadError('')
      } catch (err) {
        if (!mounted) return
        setLoadError(err?.message ?? 'Error al cargar inventario desde JsonBin.')
        setInventory({ version: 1, productos: [], movimientos: [] })
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
  const movimientosRows = useMemo(() => {
    return [...movimientos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }, [movimientos])

  async function persist(nextInventory) {
    setInventory(nextInventory)
    await saveInventory(nextInventory)
  }

  function pushNotification(type, message) {
    const item = {
      id: `N-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      message,
      createdAt: nowIso(),
    }
    setNotifications((prev) => [item, ...prev].slice(0, 8))
  }

  function removeNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
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
    if (!isEditing) {
      pushNotification('create', `Producto creado: ${id} - ${nombre}. Stock inicial: ${existencia}.`)
    }
    resetForm()
  }

  async function onSubmitMovimiento(e) {
    e.preventDefault()
    const productoId = movForm.productoId
    const tipo = movForm.tipo
    const cantidad = Number(movForm.cantidad)

    if (!productoId) return window.alert('Seleccione un producto para mover stock.')
    if (!Number.isFinite(cantidad) || cantidad <= 0) return window.alert('La cantidad debe ser mayor que 0.')

    const idx = productos.findIndex((p) => p.id === productoId)
    if (idx < 0) return window.alert('Producto no encontrado.')
    const producto = productos[idx]

    const existenciaActual = Number(producto.existencia ?? 0)
    const delta = tipo === 'entrada' ? cantidad : -cantidad
    const existenciaNueva = existenciaActual + delta
    if (existenciaNueva < 0) {
      return window.alert(
        `Stock insuficiente para salida. Existencia actual: ${existenciaActual}, salida solicitada: ${cantidad}.`,
      )
    }

    const ts = nowIso()
    const nextProductos = productos.map((p, i) =>
      i === idx ? { ...p, existencia: existenciaNueva, fechaActualizacion: ts } : p,
    )
    const nextMovimientos = [
      ...movimientos,
      {
        id: `M-${Date.now()}`,
        productoId: producto.id,
        nombreProducto: producto.nombre,
        tipo,
        cantidad,
        existenciaAnterior: existenciaActual,
        existenciaNueva,
        fecha: ts,
      },
    ]

    const next = {
      ...inventory,
      productos: nextProductos,
      movimientos: nextMovimientos,
    }
    await persist(next)
    if (tipo === 'entrada') {
      pushNotification('entrada', `Entrada registrada: +${cantidad} unidades a ${producto.id}.`)
    } else {
      pushNotification('salida', `Salida registrada: -${cantidad} unidades de ${producto.id}.`)
    }
    setMovForm((s) => ({ ...s, cantidad: 1 }))
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
      {loadError ? (
        <div
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1px solid var(--red-bg)',
            background: 'var(--red-bg)',
            color: '#991b1b',
            fontSize: 13.5,
          }}
        >
          {loadError}
        </div>
      ) : null}

      {notifications.length > 0 ? (
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
            {notifications.map((n) => {
              const bg =
                n.type === 'create'
                  ? 'var(--blue-bg)'
                  : n.type === 'entrada'
                    ? '#dcfce7'
                    : n.type === 'salida'
                      ? '#fee2e2'
                      : 'var(--bg)'
              return (
                <div
                  key={n.id}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: bg,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 10,
                    alignItems: 'start',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {n.type === 'create'
                        ? 'Producto creado'
                        : n.type === 'entrada'
                          ? 'Entrada de stock'
                          : 'Salida de stock'}
                    </div>
                    <div style={{ fontSize: 13 }}>{n.message}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                      {formatDateTime(n.createdAt)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNotification(n.id)}
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
              )
            })}
          </div>
        </section>
      ) : null}

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
          <strong>Entrada / Salida de stock</strong>
        </div>
        <form onSubmit={onSubmitMovimiento} style={{ padding: 14, display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 12 }}>
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
                {[
                  'Fecha',
                  'Producto',
                  'Tipo',
                  'Cantidad',
                  'Existencia anterior',
                  'Existencia nueva',
                ].map((h) => (
                  <th key={h} style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movimientosRows.map((m) => (
                <tr key={m.id}>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {formatDateTime(m.fecha)}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {m.productoId} - {m.nombreProducto}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {m.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>{m.cantidad}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {m.existenciaAnterior}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                    {m.existenciaNueva}
                  </td>
                </tr>
              ))}
              {movimientosRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ padding: 16, color: 'var(--text-secondary)', textAlign: 'center' }}
                  >
                    Sin movimientos
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

