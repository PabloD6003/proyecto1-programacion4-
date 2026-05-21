import React from 'react'
import { useForm } from '@tanstack/react-form'

const FormularioDonacion = ({ onAgregar, donacionEditar, onActualizar }) => {
  const form = useForm({
    defaultValues: {
      donante: donacionEditar?.donante || '',
      tipo: donacionEditar?.tipo || '',
      monto: donacionEditar?.monto || '',
      fecha: donacionEditar?.fecha || '',
    },
    onSubmit: async ({ value }) => {
      if (donacionEditar) {
        onActualizar(value)
      } else {
        onAgregar(value)
      }
      form.reset()
    },
  })

  return (
    <div>
      <h2>{donacionEditar ? 'Editar Donación' : 'Nueva Donación'}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div>
          <label>Donante</label>
          <form.Field name="donante">
            {(field) => (
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Nombre del donante"
              />
            )}
          </form.Field>
        </div>

        <div>
          <label>Tipo</label>
          <form.Field name="tipo">
            {(field) => (
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">Seleccione</option>
                <option value="Dinero">Dinero</option>
                <option value="Especie">Especie</option>
              </select>
            )}
          </form.Field>
        </div>

        <div>
          <label>Monto</label>
          <form.Field name="monto">
            {(field) => (
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Monto o descripción"
              />
            )}
          </form.Field>
        </div>

        <div>
          <label>Fecha</label>
          <form.Field name="fecha">
            {(field) => (
              <input
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        </div>

        <button type="submit">
          {donacionEditar ? 'Actualizar' : 'Agregar'}
        </button>
      </form>
    </div>
  )
}

export default FormularioDonacion