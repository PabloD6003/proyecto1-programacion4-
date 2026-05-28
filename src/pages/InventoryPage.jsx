import { useCallback, useMemo, useState } from 'react'
import { useInventory } from '../hooks/useInventory'
import { InventoryForm } from '../components/InventoryForm'
import { InventoryTable } from '../components/InventoryTable'
import { StockAlerts } from '../components/StockAlerts'
import { StockMovementForm } from '../components/StockMovementForm'
import { MovementHistory } from '../components/MovementHistory'
import { getJsonBinConfigError } from '../services/inventoryBinService'
import { useNotifications } from '../context/NotificationContext'

export default function InventoryPage() {
  const { notify } = useNotifications()
  const {
    items,
    loading,
    refreshing,
    saving,
    error,
    lowStockItems,
    addItem,
    updateItem,
    deleteItem,
    recordMovement,
    refetch,
  } = useInventory()

  const [editing, setEditing] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [movementItemId, setMovementItemId] = useState(null)
  const [activeTab, setActiveTab] = useState('recursos')
  const [formError, setFormError] = useState(null)

  const configError = getJsonBinConfigError()

  const editFormValues = useMemo(
    () =>
      editing
        ? {
            sku: editing.sku,
            nombre: editing.nombre,
            cantidad: String(editing.cantidad),
            stockMinimo: String(editing.stockMinimo ?? 0),
            ubicacion: editing.ubicacion,
          }
        : null,
    [editing],
  )

  const formPanelOpen = Boolean(editing) || showNewForm

  const handleSubmit = async (data) => {
    setFormError(null)
    try {
      if (editing) {
        await updateItem(editing.id, data)
        notify(`Recurso "${data.nombre}" actualizado correctamente`)
        setEditing(null)
      } else {
        await addItem(data)
        notify(`Recurso "${data.nombre}" creado correctamente`)
        setShowNewForm(false)
      }
    } catch (err) {
      setFormError(err.message)
      notify(err.message, 'error')
    }
  }

  const handleDelete = useCallback(
    async (id) => {
      const item = items.find((i) => i.id === id)
      if (!window.confirm(`¿Eliminar "${item?.nombre ?? 'este recurso'}"?`)) return
      setFormError(null)
      try {
        await deleteItem(id)
        notify(`Recurso "${item?.nombre ?? 'eliminado'}" eliminado correctamente`)
        setEditing((current) => (current?.id === id ? null : current))
      } catch (err) {
        setFormError(err.message)
        notify(err.message, 'error')
      }
    },
    [items, deleteItem, notify],
  )

  const handleMovement = async (itemId, movementInput) => {
    const item = items.find((i) => i.id === itemId)
    try {
      await recordMovement(itemId, movementInput)
      const tipoLabel =
        movementInput.tipo === 'entrada' ? 'Entrada' : 'Salida'
      notify(
        `${tipoLabel} de ${movementInput.cantidad} un. registrada para "${item?.nombre ?? 'el recurso'}"`,
      )
    } catch (err) {
      notify(err.message, 'error')
      throw err
    }
  }

  const handleStartEdit = useCallback((item) => {
    setFormError(null)
    setEditing(item)
    setShowNewForm(false)
  }, [])

  const handleCancelForm = useCallback(() => {
    setEditing(null)
    setShowNewForm(false)
  }, [])

  const handleTableMovement = useCallback((id) => {
    setMovementItemId(id)
    setActiveTab('movimientos')
  }, [])

  if (loading) {
    return (
      <section className="page inventory-page">
        <p>Cargando recursos...</p>
      </section>
    )
  }

  return (
    <section className="page inventory-page">
      <div className="page-header-row">
        <div>
          <h1>Inventario</h1>
          <p>Ver, crear, editar y eliminar recursos (JsonBin).</p>
        </div>
        <button type="button" onClick={refetch} disabled={refreshing || saving}>
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {configError && <p className="error config-error">{configError}</p>}
      {error && <p className="error">{error}</p>}
      {formError && <p className="error">{formError}</p>}
      {saving && <p className="hint">Guardando en JsonBin...</p>}

      <StockAlerts items={lowStockItems} />

      <p className="hint">
        {items.length} recurso{items.length !== 1 ? 's' : ''} en el bin
      </p>

      <div className="tabs">
        <button
          type="button"
          className={activeTab === 'recursos' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('recursos')}
        >
          Recursos
        </button>
        <button
          type="button"
          className={activeTab === 'movimientos' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('movimientos')}
        >
          Entradas / Salidas
        </button>
        <button
          type="button"
          className={activeTab === 'historial' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('historial')}
        >
          Historial
        </button>
      </div>

      {activeTab === 'recursos' && (
        <div className="tab-panel">
          <div className="form-panel-header">
            {!editing && (
              <button
                type="button"
                className="btn-toggle-form"
                aria-expanded={formPanelOpen}
                onClick={() => setShowNewForm((open) => !open)}
                disabled={saving || !!configError}
              >
                {formPanelOpen ? '▲ Ocultar formulario' : '▼ Nuevo recurso'}
              </button>
            )}
            {editing && <h2>Editar recurso</h2>}
          </div>

          {formPanelOpen && (
            <div className="collapsible-panel is-open">
              <InventoryForm
                key={editing?.id ?? 'new'}
                editingId={editing?.id ?? null}
                onSubmit={handleSubmit}
                disabled={saving || !!configError}
                initialValues={editFormValues ?? undefined}
                onCancel={handleCancelForm}
              />
            </div>
          )}

          <h2>Listado de recursos</h2>
          <InventoryTable
            items={items}
            onEdit={handleStartEdit}
            onDelete={handleDelete}
            onMovement={handleTableMovement}
          />
        </div>
      )}

      {activeTab === 'movimientos' && (
        <div className="tab-panel">
          <StockMovementForm
            items={items}
            selectedItemId={movementItemId}
            onSubmit={handleMovement}
          />
        </div>
      )}

      {activeTab === 'historial' && (
        <div className="tab-panel">
          <MovementHistory items={items} />
        </div>
      )}
    </section>
  )
}
