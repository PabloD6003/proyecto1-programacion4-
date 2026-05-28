import { useInventario } from '../hooks/useInventario'
import NotificacionesPanel from '../components/inventario/NotificacionesPanel'
import ProductoForm from '../components/inventario/ProductoForm'
import MovimientoForm from '../components/inventario/MovimientoForm'
import ProductosTable from '../components/inventario/ProductosTable'
import MovimientosTable from '../components/inventario/MovimientosTable'

/**
 * Página principal del módulo de Inventario.
 * Solo compone los componentes — toda la lógica vive en useInventario.
 */
export default function InventarioPage() {
  const {
    loading,
    loadError,
    rows,
    movimientosRows,
    form,
    setForm,
    isEditing,
    editingId,
    onEdit,
    onDelete,
    onSubmit,
    resetForm,
    movForm,
    setMovForm,
    onSubmitMovimiento,
    notifications,
    removeNotification,
  } = useInventario()

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

      {loadError && (
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
      )}

      <NotificacionesPanel notifications={notifications} onRemove={removeNotification} />

      <ProductoForm
        form={form}
        setForm={setForm}
        isEditing={isEditing}
        editingId={editingId}
        onSubmit={onSubmit}
        onCancel={resetForm}
      />

      <MovimientoForm
        movForm={movForm}
        setMovForm={setMovForm}
        onSubmit={onSubmitMovimiento}
        rows={rows}
      />

      <ProductosTable
        rows={rows}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <MovimientosTable movimientosRows={movimientosRows} />
    </div>
  )
}
