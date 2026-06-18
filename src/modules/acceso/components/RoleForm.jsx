import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'

const getInitialValues = (rolInicial) => ({
  nombre: rolInicial?.nombre ?? '',
  descripcion: rolInicial?.descripcion ?? '',
  permisos: rolInicial?.permisos ?? [],
})

export default function RoleForm({ rolInicial, catalogoPermisos = [], onSubmit, onCancelar }) {
  const isEditando = Boolean(rolInicial?.id || rolInicial?.nombre)

  const form = useForm({
    defaultValues: getInitialValues(rolInicial),
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
  })

  useEffect(() => {
    form.reset(getInitialValues(rolInicial))
  }, [form, rolInicial])

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <h3>{isEditando ? 'Editar rol' : 'Nuevo rol'}</h3>

      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) => (!value?.trim() ? 'El nombre es requerido' : undefined),
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="descripcion"
        validators={{
          onChange: ({ value }) => (!value?.trim() ? 'La descripción es requerida' : undefined),
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
          </div>
        )}
      </form.Field>

      <form.Field name="permisos">
        {(field) => (
          <div>
            <label>Permisos</label>
            <div className="acc-permisos-grid">
              {catalogoPermisos.map((permiso) => {
                const checked = field.state.value.includes(permiso)
                return (
                  <label key={permiso} className="acc-permiso-item">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        const seleccionado = event.target.checked
                        const siguiente = seleccionado
                          ? [...field.state.value, permiso]
                          : field.state.value.filter((p) => p !== permiso)
                        field.handleChange(siguiente)
                      }}
                    />
                    {permiso}
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </form.Field>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
