export const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
}

export function getStockStatus(item) {
  const cantidad = Number(item.cantidad) || 0
  const minimo = Number(item.stockMinimo) ?? 0

  if (cantidad <= 0) return 'agotado'
  if (cantidad <= minimo) return 'bajo'
  return 'ok'
}

export function getStockLabel(status) {
  const labels = {
    ok: 'Normal',
    bajo: 'Stock bajo',
    agotado: 'Agotado',
  }
  return labels[status] || status
}

export function applyMovement(item, { tipo, cantidad }) {
  const qty = Number(cantidad)
  if (!qty || qty <= 0) {
    throw new Error('La cantidad debe ser mayor a 0')
  }

  const actual = Number(item.cantidad) || 0

  if (tipo === MOVEMENT_TYPES.SALIDA && qty > actual) {
    throw new Error(`Stock insuficiente. Disponible: ${actual}`)
  }

  const nuevaCantidad =
    tipo === MOVEMENT_TYPES.ENTRADA ? actual + qty : actual - qty

  return { ...item, cantidad: nuevaCantidad }
}

export function createMovement({ tipo, cantidad, fecha, nota = '' }) {
  return {
    id: Date.now(),
    tipo,
    cantidad: Number(cantidad),
    fecha: fecha || new Date().toISOString().slice(0, 10),
    nota,
    registradoEn: new Date().toISOString(),
  }
}

export function normalizeItem(item) {
  return {
    stockMinimo: 0,
    movimientos: [],
    ...item,
    cantidad: Number(item.cantidad) || 0,
    stockMinimo: Number(item.stockMinimo) ?? 0,
    movimientos: Array.isArray(item.movimientos) ? item.movimientos : [],
  }
}

export function getAllMovements(items) {
  return items
    .flatMap((item) =>
      (item.movimientos || []).map((m) => ({
        ...m,
        itemId: item.id,
        itemNombre: item.nombre,
        itemSku: item.sku,
      })),
    )
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}

export function filterMovementsByDate(movements, fromDate, toDate) {
  if (!fromDate && !toDate) return movements
  return movements.filter((m) => {
    const d = m.fecha
    if (fromDate && d < fromDate) return false
    if (toDate && d > toDate) return false
    return true
  })
}

export function getLowStockItems(items) {
  return items.filter((item) => {
    const status = getStockStatus(item)
    return status === 'bajo' || status === 'agotado'
  })
}
