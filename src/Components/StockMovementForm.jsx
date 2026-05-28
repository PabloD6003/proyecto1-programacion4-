import { useState } from 'react'
import { MOVEMENT_TYPES } from '../utils/inventory'

const today = () => new Date().toISOString().slice(0, 10)

export function StockMovementForm({ items, selectedItemId, onSubmit }) {
  const [itemId, setItemId] = useState(selectedItemId ?? '')
  const [tipo, setTipo] = useState(MOVEMENT_TYPES.ENTRADA)
  const [cantidad, setCantidad] = useState('')
  const [fecha, setFecha] = useState(today())
  const [nota, setNota] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const selected = items.find((i) => String(i.id) === String(itemId))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!itemId) {
      setError('Selecciona un recurso')
      return
    }
    setLoading(true)
    try {
      await onSubmit(Number(itemId), {
        tipo,
        cantidad: Number(cantidad),
        fecha,
        nota,
      })
      setCantidad('')
      setNota('')
      setFecha(today())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card form-card movement-form" onSubmit={handleSubmit}>
      <h3>Entrada / Salida de stock</h3>

      <label>
        Recurso
        <select
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          required
        >
          <option value="">— Seleccionar —</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nombre} ({item.sku}) — disp. {item.cantidad}
            </option>
          ))}
        </select>
      </label>

      {selected && (
        <p className="hint">
          Stock actual: <strong>{selected.cantidad}</strong> · Mínimo:{' '}
          {selected.stockMinimo}
        </p>
      )}

      <label>
        Tipo de movimiento
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value={MOVEMENT_TYPES.ENTRADA}>Entrada (+)</option>
          <option value={MOVEMENT_TYPES.SALIDA}>Salida (−)</option>
        </select>
      </label>

      <label>
        Cantidad
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />
      </label>

      <label>
        Fecha
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </label>

      <label>
        Nota (opcional)
        <input
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Ej. compra proveedor, préstamo aula..."
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar movimiento'}
      </button>
    </form>
  )
}
