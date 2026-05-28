import { useState } from 'react'
import { useForm } from '@tanstack/react-form'

const TIPOS_BENEFICIARIO = [
  { value: 'jefa_de_hogar', label: 'Jefa de Hogar' },
  { value: 'adulto_mayor', label: 'Adulto Mayor' },
  { value: 'familia', label: 'Familia' },
  { value: 'nino', label: 'Niño/a' },
  { value: 'vulnerable', label: 'Vulnerable' },
]

function FormModal({ isOpen, onClose, beneficiario, onSubmit }) {
  const [submitError, setSubmitError] = useState(null)

  const form = useForm({
    defaultValues: {
      nombreCompleto: beneficiario?.nombreCompleto ?? '',
      cedula: beneficiario?.cedula ?? '',
      fechaNacimiento: beneficiario?.fechaNacimiento ?? '',
      tipoBeneficiario: beneficiario?.tipoBeneficiario ?? 'familia',
      telefono: beneficiario?.telefono ?? '',
      direccion: beneficiario?.direccion ?? '',
      personasACargo: beneficiario?.personasACargo ?? 0,
      observaciones: beneficiario?.observaciones ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        setSubmitError(null)
        await onSubmit(value)
      } catch (err) {
        setSubmitError(err.message || 'Ocurrió un error al guardar')
      }
    },
  })

  if (!isOpen) return null

  const esEdicion = beneficiario !== null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <i className={`fas ${esEdicion ? 'fa-pencil' : 'fa-plus'}`} />
            {esEdicion ? 'Editar Beneficiario' : 'Nuevo Beneficiario'}
          </h2>
          <button className="modal-close" onClick={onClose} type="button">
            <i className="fas fa-times" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="modal-body">
            {submitError && (
              <div className="alert alert--error">
                <i className="fas fa-circle-exclamation" />
                {submitError}
              </div>
            )}

            <fieldset className="form-section">
              <legend className="form-section__title">Datos Personales</legend>
              <div className="form-grid">

                <form.Field
                  name="nombreCompleto"
                  validators={{ onBlur: ({ value }) => !value.trim() ? 'El nombre completo es requerido' : undefined }}
                >
                  {(field) => (
                    <div className="form-group form-group--full">
                      <label className="form-label" htmlFor={field.name}>
                        Nombre Completo <span className="required">*</span>
                      </label>
                      <input
                        id={field.name}
                        className={`form-input ${fieldHasError(field) ? 'form-input--error' : ''}`}
                        type="text"
                        placeholder="Ej: María González Ramírez"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="cedula"
                  validators={{ onBlur: ({ value }) => !value.trim() ? 'La cédula es requerida' : undefined }}
                >
                  {(field) => (
                    <div className="form-group">
                      <label className="form-label" htmlFor={field.name}>
                        Cédula <span className="required">*</span>
                      </label>
                      <input
                        id={field.name}
                        className={`form-input ${fieldHasError(field) ? 'form-input--error' : ''}`}
                        type="text"
                        placeholder="Ej: 503200012"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="fechaNacimiento"
                  validators={{ onBlur: ({ value }) => !value ? 'La fecha de nacimiento es requerida' : undefined }}
                >
                  {(field) => (
                    <div className="form-group">
                      <label className="form-label" htmlFor={field.name}>
                        Fecha de Nacimiento <span className="required">*</span>
                      </label>
                      <input
                        id={field.name}
                        className={`form-input ${fieldHasError(field) ? 'form-input--error' : ''}`}
                        type="date"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="tipoBeneficiario">
                  {(field) => (
                    <div className="form-group">
                      <label className="form-label" htmlFor={field.name}>
                        Tipo de Beneficiario <span className="required">*</span>
                      </label>
                      <select
                        id={field.name}
                        className="form-input form-select"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      >
                        {TIPOS_BENEFICIARIO.map((tipo) => (
                          <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </form.Field>

              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section__title">Contacto y Ubicación</legend>
              <div className="form-grid">

                <form.Field name="telefono">
                  {(field) => (
                    <div className="form-group">
                      <label className="form-label" htmlFor={field.name}>Teléfono</label>
                      <input
                        id={field.name}
                        className="form-input"
                        type="tel"
                        placeholder="Ej: 8888-1234"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="personasACargo"
                  validators={{ onChange: ({ value }) => value < 0 ? 'No puede ser negativo' : undefined }}
                >
                  {(field) => (
                    <div className="form-group">
                      <label className="form-label" htmlFor={field.name}>
                        Personas a Cargo <span className="required">*</span>
                      </label>
                      <input
                        id={field.name}
                        className={`form-input ${fieldHasError(field) ? 'form-input--error' : ''}`}
                        type="number"
                        min="0"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="direccion"
                  validators={{ onBlur: ({ value }) => !value.trim() ? 'La dirección es requerida' : undefined }}
                >
                  {(field) => (
                    <div className="form-group form-group--full">
                      <label className="form-label" htmlFor={field.name}>
                        Dirección <span className="required">*</span>
                      </label>
                      <input
                        id={field.name}
                        className={`form-input ${fieldHasError(field) ? 'form-input--error' : ''}`}
                        type="text"
                        placeholder="Ej: Barrio El Carmen, Nicoya"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section__title">Observaciones</legend>
              <form.Field name="observaciones">
                {(field) => (
                  <div className="form-group form-group--full">
                    <textarea
                      id={field.name}
                      className="form-input form-textarea"
                      placeholder="Notas médicas, condiciones especiales, etc."
                      rows={3}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>
            </fieldset>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><i className="fas fa-spinner fa-spin" /> Guardando...</>
                  ) : (
                    <><i className="fas fa-floppy-disk" /> {esEdicion ? 'Actualizar' : 'Guardar'}</>
                  )}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  )
}

function fieldHasError(field) {
  return field.state.meta.isTouched && field.state.meta.errors.length > 0
}

function FieldError({ field }) {
  if (!field.state.meta.isTouched || field.state.meta.errors.length === 0) return null
  return (
    <span className="form-error">
      <i className="fas fa-circle-exclamation" /> {field.state.meta.errors[0]}
    </span>
  )
}

export default FormModal
