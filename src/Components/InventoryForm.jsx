import { useForm } from '@tanstack/react-form'

const emptyValues = {
  sku: '',
  nombre: '',
  cantidad: '',
  stockMinimo: '',
  ubicacion: '',
}

export function InventoryForm({
  onSubmit,
  initialValues,
  onCancel,
  disabled,
  editingId = null,
}) {
  const isEditing = editingId != null

  const form = useForm({
    defaultValues: initialValues ?? emptyValues,
    onSubmit: async ({ value }) => {
      const payload = {
        sku: value.sku,
        nombre: value.nombre,
        stockMinimo: Number(value.stockMinimo),
        ubicacion: value.ubicacion,
      }
      if (!isEditing) {
        payload.cantidad = Number(value.cantidad)
      }
      await onSubmit(payload)
      if (!isEditing) {
        form.reset(emptyValues)
      }
    },
  })

  return (
    <form
      className="card form-card"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <h3>{isEditing ? 'Editar recurso' : 'Nuevo recurso'}</h3>

      <form.Field name="sku">
        {(field) => (
          <label>
            SKU
            <input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required
              disabled={disabled || form.state.isSubmitting}
            />
          </label>
        )}
      </form.Field>

      <form.Field name="nombre">
        {(field) => (
          <label>
            Nombre
            <input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required
              disabled={disabled || form.state.isSubmitting}
            />
          </label>
        )}
      </form.Field>

      {!isEditing && (
        <form.Field name="cantidad">
          {(field) => (
            <label>
              Cantidad inicial
              <input
                type="number"
                min="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                disabled={disabled || form.state.isSubmitting}
              />
            </label>
          )}
        </form.Field>
      )}

      <form.Field name="stockMinimo">
        {(field) => (
          <label>
            Stock mínimo (alerta)
            <input
              type="number"
              min="0"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required
              disabled={disabled || form.state.isSubmitting}
            />
          </label>
        )}
      </form.Field>

      <form.Field name="ubicacion">
        {(field) => (
          <label>
            Ubicación
            <input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required
              disabled={disabled || form.state.isSubmitting}
            />
          </label>
        )}
      </form.Field>

      <div className="form-actions">
        <button
          type="submit"
          disabled={disabled || form.state.isSubmitting}
        >
          {form.state.isSubmitting
            ? 'Guardando...'
            : isEditing
              ? 'Guardar cambios'
              : 'Crear recurso'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled || form.state.isSubmitting}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
