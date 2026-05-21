import React, { useState } from 'react'
import TablaDonaciones from '../../components/TablaDonaciones'
import FormularioDonacion from '../../components/FormularioDonacion'
import useDonaciones from '../../hooks/useDonaciones'
import './DonacionesPage.css'

const DonacionesPage = () => {
  const { donaciones, loading, error, agregarDonacion, editarDonacion, eliminarDonacion } = useDonaciones()
  const [donacionEditar, setDonacionEditar] = useState(null)
  const [indexEditar, setIndexEditar] = useState(null)

  const handleEditar = (index, donacion) => {
    setDonacionEditar(donacion)
    setIndexEditar(index)
  }

  const handleActualizar = async (donacionActualizada) => {
    await editarDonacion(indexEditar, donacionActualizada)
    setDonacionEditar(null)
    setIndexEditar(null)
  }

  return (
    <div className="donaciones-container">
      <h1>Gestión de Donaciones</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Cargando...</p>}

      <FormularioDonacion
        onAgregar={agregarDonacion}
        donacionEditar={donacionEditar}
        onActualizar={handleActualizar}
      />

      <TablaDonaciones
        donaciones={donaciones}
        onEliminar={eliminarDonacion}
        onEditar={handleEditar}
      />
    </div>
  )
}

export default DonacionesPage