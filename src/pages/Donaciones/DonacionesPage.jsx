import React, { useState } from 'react'
import TablaDonaciones from '../../components/TablaDonaciones'
import FormularioDonacion from '../../components/FormularioDonacion'
import useDonaciones from '../../hooks/useDonaciones'
import './DonacionesPage.css'

const DonacionesPage = () => {
  const { donaciones, loading, error, agregarDonacion, editarDonacion, anularDonacion } = useDonaciones()
  const [donacionEditar, setDonacionEditar] = useState(null)
  const [indexEditar, setIndexEditar] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  const handleEditar = (index, donacion) => {
    setDonacionEditar(donacion)
    setIndexEditar(index)
  }

  const handleActualizar = async (donacionActualizada) => {
    await editarDonacion(indexEditar, donacionActualizada)
    setDonacionEditar(null)
    setIndexEditar(null)
  }

  const handleCancelar = () => {
    setDonacionEditar(null)
    setIndexEditar(null)
  }

  const donacionesFiltradas = donaciones.filter((d) => {
    const coincideBusqueda = d.donante?.toLowerCase().includes(busqueda.toLowerCase())
    const coincideTipo = filtroTipo ? d.tipo === filtroTipo : true
    const coincideEstado = filtroEstado ? d.estado === filtroEstado : true
    return coincideBusqueda && coincideTipo && coincideEstado
  })

  return (
    <div className="donaciones-module">
      <div className="don-header">
        <h1 className="don-title">
          <i className="fas fa-hand-holding-heart" />
          Gestión de Donaciones
        </h1>
      </div>

      <div className="don-content">
        {error && (
          <div className="don-alert don-alert--error">
            <i className="fas fa-circle-exclamation" />
            {error}
          </div>
        )}
        {loading && (
          <div className="don-alert don-alert--loading">
            <i className="fas fa-spinner fa-spin" />
            Cargando...
          </div>
        )}

        <FormularioDonacion
          onAgregar={agregarDonacion}
          donacionEditar={donacionEditar}
          onActualizar={handleActualizar}
          onCancelar={handleCancelar}
        />

        <div className="don-filtros">
          <div className="don-filtros__search">
            <i className="fas fa-magnifying-glass" />
            <input
              className="don-form-input"
              placeholder="Buscar por donante..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <select
            className="don-form-input don-form-select don-filtros__select"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="Dinero">Dinero</option>
            <option value="Especie">Especie</option>
          </select>
          <select
            className="don-form-input don-form-select don-filtros__select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="activa">Activas</option>
            <option value="anulada">Anuladas</option>
          </select>
        </div>

        <TablaDonaciones
          donaciones={donacionesFiltradas}
          onAnular={anularDonacion}
          onEditar={handleEditar}
        />
      </div>
    </div>
  )
}

export default DonacionesPage
