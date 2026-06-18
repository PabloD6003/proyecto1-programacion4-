import { useState } from 'react'
import RoleForm from '../components/RoleForm'
import RolesTable from '../components/RolesTable'
import UsuariosTable from '../components/UsuariosTable'
import ConfirmModal from '../../../components/ConfirmModal'
import '../../../components/ConfirmModal.css'
import useRoles from '../../../hooks/useRoles'
import usePermisos from '../hooks/usePermisos'
import useUsuarios from '../hooks/useUsuarios'
import useAuth from '../../auth/hooks/useAuth'
import { RoleSchema } from '../types/role.types'
import './AccesoPage.css'

export default function AccesoPage() {
  const { tienePermiso } = useAuth()
  const puedeGestionarRoles = tienePermiso('roles.gestionar')
  const puedeAsignarRoles = tienePermiso('roles.asignar')

  const { roles, loading: cargandoRoles, error: errorRoles, crearRol, editarRol, eliminarRol } = useRoles()
  const { permisos: catalogoPermisos } = usePermisos(puedeGestionarRoles)
  const { usuarios, loading: cargandoUsuarios, error: errorUsuarios, asignarRol } = useUsuarios(puedeAsignarRoles)

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

  return (
    <div className="acceso-module">
      <div className="acc-header">
        <h1 className="acc-title">
          <i className="fas fa-user-shield" />
          Gestión de Acceso
        </h1>
        {puedeGestionarRoles && !mostrarFormulario && (
          <button type="button" className="acc-btn-nuevo" onClick={abrirFormularioCreacion}>
            <i className="fas fa-plus" /> Nuevo Rol
          </button>
        )}
      </div>

      <div className="acc-content">
        {puedeGestionarRoles && (
          <>
            {mostrarFormulario && (
              <div className="acc-form-card">
                <RoleForm
                  rolInicial={rolEditando ?? RoleSchema}
                  catalogoPermisos={catalogoPermisos}
                  onSubmit={manejarSubmit}
                  onCancelar={manejarCancelar}
                />
              </div>
            )}

            {cargandoRoles ? (
              <div className="acc-alert acc-alert--loading">
                <i className="fas fa-spinner fa-spin" />
                Cargando roles...
              </div>
            ) : errorRoles ? (
              <div className="acc-alert acc-alert--error">{errorRoles}</div>
            ) : (
              <div className="acc-table-card">
                <RolesTable roles={roles} onEditar={manejarEditar} onEliminar={manejarEliminar} />
              </div>
            )}
          </>
        )}

        {puedeAsignarRoles && (
          <div className="acc-table-card">
            <h3>Usuarios</h3>
            {cargandoUsuarios ? (
              <div className="acc-alert acc-alert--loading">
                <i className="fas fa-spinner fa-spin" />
                Cargando usuarios...
              </div>
            ) : errorUsuarios ? (
              <div className="acc-alert acc-alert--error">{errorUsuarios}</div>
            ) : (
              <UsuariosTable usuarios={usuarios} roles={roles} onAsignarRol={asignarRol} />
            )}
          </div>
        )}
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
