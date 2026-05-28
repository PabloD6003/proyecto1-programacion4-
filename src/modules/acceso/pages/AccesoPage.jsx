import { useState } from 'react'
import RoleForm from '../components/RoleForm'
import RolesTable from '../components/RolesTable'
import ConfirmModal from '../../../components/ConfirmModal'
import '../../../components/ConfirmModal.css'
import useRoles from '../../../Hooks/useRoles'
import { RoleSchema } from '../types/role.types'
import './AccesoPage.css'

export default function AccesoPage() {
  const { roles, loading, crearRol, editarRol, eliminarRol } = useRoles()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [rolEditando, setRolEditando] = useState(null)
  const [idAEliminar, setIdAEliminar] = useState(null)

  const abrirFormularioCreacion = () => {
    setRolEditando(null)
    setMostrarFormulario(true)
  }

  const manejarSubmit = (data) => {
    if (rolEditando?.id) {
      editarRol(rolEditando.id, data)
    } else {
      crearRol(data)
    }
    setMostrarFormulario(false)
    setRolEditando(null)
  }

  const manejarCancelar = () => {
    setMostrarFormulario(false)
    setRolEditando(null)
  }

  const manejarEditar = (rol) => {
    setRolEditando(rol)
    setMostrarFormulario(true)
  }

  const manejarEliminar = (id) => {
    setIdAEliminar(id)
  }

  const confirmarEliminar = async () => {
    await eliminarRol(idAEliminar)
    setIdAEliminar(null)
  }

  if (loading) {
    return (
      <div className="acc-alert acc-alert--loading">
        <i className="fas fa-spinner fa-spin" />
        Cargando roles...
      </div>
    )
  }

  return (
    <div className="acceso-module">
      <div className="acc-header">
        <h1 className="acc-title">
          <i className="fas fa-user-shield" />
          Gestión de Acceso
        </h1>
        {!mostrarFormulario && (
          <button type="button" className="acc-btn-nuevo" onClick={abrirFormularioCreacion}>
            <i className="fas fa-plus" /> Nuevo Rol
          </button>
        )}
      </div>

      <div className="acc-content">
        {mostrarFormulario && (
          <div className="acc-form-card">
            <RoleForm
              rolInicial={rolEditando ?? RoleSchema}
              onSubmit={manejarSubmit}
              onCancelar={manejarCancelar}
            />
          </div>
        )}

        <div className="acc-table-card">
          <RolesTable roles={roles} onEditar={manejarEditar} onEliminar={manejarEliminar} />
        </div>
      </div>

      {idAEliminar && (
        <ConfirmModal
          mensaje="¿Seguro que deseas eliminar este rol?"
          onConfirmar={confirmarEliminar}
          onCancelar={() => setIdAEliminar(null)}
        />
      )}
    </div>
  )
}