import { useEffect, useMemo, useState } from 'react'
import { loadInventory, saveInventory } from '../services/jsonbin'
import { computeEstado, nowIso } from '../utils/inventario.utils'
import { useNotifications } from './useNotifications'

const EMPTY_FORM = { id: '', nombre: '', existencia: 0, minimo: 0, ubicacion: '' }
const EMPTY_MOV_FORM = { productoId: '', tipo: 'entrada', cantidad: 1 }
const EMPTY_INVENTORY = { version: 1, productos: [], movimientos: [] }

/**
 * Custom hook principal del módulo de inventario.
 * Gestiona carga (Axios vía jsonbin service), estado, y operaciones CRUD
 * de productos y movimientos de stock.
 */
export function useInventario() {
  // ── Estado del inventario ────────────────────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [inventory, setInventory] = useState(() => EMPTY_INVENTORY)

  const productos = inventory.productos ?? []
  const movimientos = inventory.movimientos ?? []

  // ── Estado del formulario de producto ───────────────────────────────────
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM }))
  const [editingId, setEditingId] = useState(null)
  const isEditing = Boolean(editingId)

  // ── Estado del formulario de movimiento ─────────────────────────────────
  const [movForm, setMovForm] = useState(() => ({ ...EMPTY_MOV_FORM }))

  // ── Notificaciones ───────────────────────────────────────────────────────
  const { notifications, pushNotification, removeNotification } = useNotifications()

  // ── Carga inicial desde JsonBin (Axios) ──────────────────────────────────
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
        setInventory(EMPTY_INVENTORY)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [])

  // ── Filas derivadas ──────────────────────────────────────────────────────
  const rows = useMemo(
    () => productos.map((p) => ({ ...p, estado: computeEstado(p.existencia, p.minimo) })),
    [productos],
  )

  const movimientosRows = useMemo(
    () => [...movimientos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [movimientos],
  )

  // ── Persistencia ─────────────────────────────────────────────────────────
  async function persist(nextInventory) {
    setInventory(nextInventory)
    await saveInventory(nextInventory)
  }

  // ── Formulario de producto ───────────────────────────────────────────────
  function resetForm() {
    setForm({ ...EMPTY_FORM })
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
    if (!Number.isFinite(minimo) || minimo < 0)
      return window.alert('Mínimo debe ser un número >= 0.')

    const exists = productos.some((p) => p.id === id)
    if (!isEditing && exists) return window.alert(`Ya existe un producto con id ${id}.`)
    if (isEditing && editingId !== id && exists)
      return window.alert(`No puedes cambiar el id a ${id} porque ya existe.`)

    const ts = nowIso()
    const nextProductos = isEditing
      ? productos.map((p) =>
          p.id === editingId
            ? { ...p, id, nombre, ubicacion, existencia, minimo, fechaActualizacion: ts }
            : p,
        )
      : [
          ...productos,
          { id, nombre, ubicacion, existencia, minimo, fechaRegistro: ts, fechaActualizacion: ts },
        ]

    await persist({ ...inventory, productos: nextProductos })
    if (!isEditing) {
      pushNotification('create', `Producto creado: ${id} - ${nombre}. Stock inicial: ${existencia}.`)
    }
    resetForm()
  }

  // ── Formulario de movimiento ─────────────────────────────────────────────
  async function onSubmitMovimiento(e) {
    e.preventDefault()
    const { productoId, tipo } = movForm
    const cantidad = Number(movForm.cantidad)

    if (!productoId) return window.alert('Seleccione un producto para mover stock.')
    if (!Number.isFinite(cantidad) || cantidad <= 0)
      return window.alert('La cantidad debe ser mayor que 0.')

    const idx = productos.findIndex((p) => p.id === productoId)
    if (idx < 0) return window.alert('Producto no encontrado.')
    const producto = productos[idx]

    const existenciaActual = Number(producto.existencia ?? 0)
    const delta = tipo === 'entrada' ? cantidad : -cantidad
    const existenciaNueva = existenciaActual + delta

    if (existenciaNueva < 0) {
      return window.alert(
        `Stock insuficiente. Existencia actual: ${existenciaActual}, salida solicitada: ${cantidad}.`,
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

    await persist({ ...inventory, productos: nextProductos, movimientos: nextMovimientos })

    pushNotification(
      tipo,
      tipo === 'entrada'
        ? `Entrada registrada: +${cantidad} unidades a ${producto.id}.`
        : `Salida registrada: -${cantidad} unidades de ${producto.id}.`,
    )
    setMovForm((s) => ({ ...s, cantidad: 1 }))
  }

  return {
    // estado de carga
    loading,
    loadError,
    // datos derivados
    rows,
    movimientosRows,
    // formulario producto
    form,
    setForm,
    isEditing,
    editingId,
    onEdit,
    onDelete,
    onSubmit,
    resetForm,
    // formulario movimiento
    movForm,
    setMovForm,
    onSubmitMovimiento,
    // notificaciones
    notifications,
    removeNotification,
  }
}