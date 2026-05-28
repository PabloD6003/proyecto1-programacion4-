import { useState } from 'react'
import useBeneficiarios from '../../../hooks/useBeneficiarios'
import Toolbar from '../components/Toolbar'
import BeneficiariosTable from '../components/BeneficiariosTable'
import FormModal from '../components/FormModal'

function BeneficiariosPage() {
  const { beneficiarios, loading, error, crearBeneficiario, actualizarBeneficiario, toggleStatus } =
    useBeneficiarios()

  const [filtroGlobal, setFiltroGlobal] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [beneficiarioSeleccionado, setBeneficiarioSeleccionado] = useState(null)

  const abrirCrear = () => {
    setBeneficiarioSeleccionado(null)
    setModalAbierto(true)
  }

  const abrirEditar = (beneficiario) => {
    setBeneficiarioSeleccionado(beneficiario)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setBeneficiarioSeleccionado(null)
  }

  const handleSubmit = async (datos) => {
    if (beneficiarioSeleccionado) {
      await actualizarBeneficiario(beneficiarioSeleccionado.id, datos)
    } else {
      await crearBeneficiario(datos)
    }
    cerrarModal()
  }

  if (loading) {
    return (
      <div className="page-state page-state--loading">
        <i className="fas fa-spinner fa-spin" />
        <p>Cargando beneficiarios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-state page-state--error">
        <i className="fas fa-triangle-exclamation" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="page">
      <Toolbar
        filtro={filtroGlobal}
        onFiltroChange={setFiltroGlobal}
        onNuevoBeneficiario={abrirCrear}
      />

      <BeneficiariosTable
        data={beneficiarios}
        globalFilter={filtroGlobal}
        onEditar={abrirEditar}
        onToggleStatus={toggleStatus}
      />

      <FormModal
        key={beneficiarioSeleccionado?.id ?? 'new'}
        isOpen={modalAbierto}
        onClose={cerrarModal}
        beneficiario={beneficiarioSeleccionado}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default BeneficiariosPage
