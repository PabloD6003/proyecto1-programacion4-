import React, { useState } from 'react'
import { useForm } from '@tanstack/react-form'

const FormularioDonacion = ({ onAgregar, donacionEditar, onActualizar, onCancelar }) => {
  const [tipoActual, setTipoActual] = useState(donacionEditar?.tipo || '')
  const [errores, setErrores] = useState({})

  const form = useForm({
    defaultValues: {
      donante:     donacionEditar?.donante     || '',
      tipo:        donacionEditar?.tipo        || '',
      monto:       donacionEditar?.monto       || '',
      descripcion: donacionEditar?.descripcion || '',
      cantidad:    donacionEditar?.cantidad    || '',
      unidad:      donacionEditar?.unidad      || '',
      fecha:       donacionEditar?.fecha       || '',
    },
    onSubmit: async ({ value }) => {
      if (donacionEditar) {
        onActualizar(value)
      } else {
        onAgregar(value)
      }
      form.reset()
      setTipoActual('')
    },
  })

  const validar = () => {
    const valores = form.state.values
    const nuevosErrores = {}
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    if (!valores.donante?.trim()) {
      nuevosErrores.donante = 'El donante es requerido.'
    } else if (valores.donante.trim().length < 3) {
      nuevosErrores.donante = 'El donante debe tener al menos 3 caracteres.'
    }

    if (!valores.tipo) {
      nuevosErrores.tipo = 'El tipo es requerido.'
    }

    if (valores.tipo === 'Dinero') {
      const monto = Number(valores.monto)
      if (valores.monto === '' || valores.monto === null || Number.isNaN(monto)) {
        nuevosErrores.monto = 'El monto es requerido.'
      } else if (monto <= 0) {
        nuevosErrores.monto = 'El monto debe ser mayor a 0.'
      }
    }

    if (valores.tipo === 'Especie') {
      if (!valores.descripcion?.trim()) {
        nuevosErrores.descripcion = 'La descripción es requerida.'
      }
      const cantidad = Number(valores.cantidad)
      if (valores.cantidad === '' || valores.cantidad === null || Number.isNaN(cantidad)) {
        nuevosErrores.cantidad = 'La cantidad es requerida.'
      } else if (cantidad <= 0) {
        nuevosErrores.cantidad = 'La cantidad debe ser mayor a 0.'
      }
      if (!valores.unidad) {
        nuevosErrores.unidad = 'La unidad es requerida.'
      }
    }

    if (!valores.fecha) {
      nuevosErrores.fecha = 'La fecha es requerida.'
    } else {
      const fechaSeleccionada = new Date(`${valores.fecha}T00:00:00`)
      if (fechaSeleccionada > hoy) {
        nuevosErrores.fecha = 'La fecha no puede ser mayor a hoy.'
      }
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  return (
    <div className="don-form-card">
      <div className="don-form-card__header">
        <i className={donacionEditar ? 'fas fa-pen' : 'fas fa-plus-circle'} />
        {donacionEditar ? 'Editar Donación' : 'Nueva Donación'}
      </div>

      <div className="don-form-card__body">
        <form onSubmit={(e) => { e.preventDefault(); if (!validar()) return; form.handleSubmit() }}>
          <div className="don-form-grid">

            <div className="don-form-group">
              <label className="don-form-label">Donante <span className="don-required">*</span></label>
              <form.Field name="donante">
                {(field) => (
                  <input
                    className={`don-form-input ${errores.donante ? 'don-form-input--error' : ''}`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Nombre del donante"
                  />
                )}
              </form.Field>
              {errores.donante && <p className="don-form-error">{errores.donante}</p>}
            </div>

            <div className="don-form-group">
              <label className="don-form-label">Tipo <span className="don-required">*</span></label>
              <form.Field name="tipo">
                {(field) => (
                  <select
                    className={`don-form-input don-form-select ${errores.tipo ? 'don-form-input--error' : ''}`}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setTipoActual(e.target.value)
                      setErrores((prev) => {
                        const updated = { ...prev }
                        delete updated.tipo
                        delete updated.monto
                        delete updated.descripcion
                        delete updated.cantidad
                        delete updated.unidad
                        return updated
                      })
                      form.setFieldValue('monto', '')
                      form.setFieldValue('descripcion', '')
                      form.setFieldValue('cantidad', '')
                      form.setFieldValue('unidad', '')
                    }}
                  >
                    <option value="">Seleccione</option>
                    <option value="Dinero">Dinero</option>
                    <option value="Especie">Especie</option>
                  </select>
                )}
              </form.Field>
              {errores.tipo && <p className="don-form-error">{errores.tipo}</p>}
            </div>

            {tipoActual === 'Dinero' && (
              <div className="don-form-group">
                <label className="don-form-label">Monto (₡) <span className="don-required">*</span></label>
                <form.Field name="monto">
                  {(field) => (
                    <input
                      className={`don-form-input ${errores.monto ? 'don-form-input--error' : ''}`}
                      type="number"
                      min="0"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ej: 50000"
                    />
                  )}
                </form.Field>
                {errores.monto && <p className="don-form-error">{errores.monto}</p>}
              </div>
            )}

            {tipoActual === 'Especie' && (
              <>
                <div className="don-form-group">
                  <label className="don-form-label">Descripción <span className="don-required">*</span></label>
                  <form.Field name="descripcion">
                    {(field) => (
                      <input
                        className={`don-form-input ${errores.descripcion ? 'don-form-input--error' : ''}`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Ej: Arroz, Ropa, Medicamentos"
                      />
                    )}
                  </form.Field>
                  {errores.descripcion && <p className="don-form-error">{errores.descripcion}</p>}
                </div>

                <div className="don-form-group">
                  <label className="don-form-label">Cantidad <span className="don-required">*</span></label>
                  <form.Field name="cantidad">
                    {(field) => (
                      <input
                        className={`don-form-input ${errores.cantidad ? 'don-form-input--error' : ''}`}
                        type="number"
                        min="1"
                        step="1"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Ej: 10"
                      />
                    )}
                  </form.Field>
                  {errores.cantidad && <p className="don-form-error">{errores.cantidad}</p>}
                </div>

                <div className="don-form-group">
                  <label className="don-form-label">Unidad <span className="don-required">*</span></label>
                  <form.Field name="unidad">
                    {(field) => (
                      <select
                        className={`don-form-input don-form-select ${errores.unidad ? 'don-form-input--error' : ''}`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      >
                        <option value="">Seleccione</option>
                        <option value="Bolsas">Bolsas</option>
                        <option value="Kilos">Kilos</option>
                        <option value="Unidades">Unidades</option>
                        <option value="Cajas">Cajas</option>
                        <option value="Litros">Litros</option>
                      </select>
                    )}
                  </form.Field>
                  {errores.unidad && <p className="don-form-error">{errores.unidad}</p>}
                </div>
              </>
            )}

            <div className="don-form-group">
              <label className="don-form-label">Fecha <span className="don-required">*</span></label>
              <form.Field name="fecha">
                {(field) => (
                  <input
                    type="date"
                    className={`don-form-input ${errores.fecha ? 'don-form-input--error' : ''}`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
              {errores.fecha && <p className="don-form-error">{errores.fecha}</p>}
            </div>

          </div>

          <div className="don-form-actions">
            {donacionEditar && (
              <button type="button" className="don-btn don-btn--ghost" onClick={onCancelar}>
                Cancelar
              </button>
            )}
            <button type="submit" className="don-btn don-btn--primary">
              <i className={donacionEditar ? 'fas fa-floppy-disk' : 'fas fa-plus'} />
              {donacionEditar ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioDonacion
