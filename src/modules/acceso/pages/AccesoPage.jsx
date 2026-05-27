import { useState } from 'react'
import RoleForm from '../components/RoleForm'
import RolesTable from '../components/RolesTable'
import useRoles from '../hooks/useRoles'
import { RoleSchema } from '../types/role.types'

export default function AccesoPage() {
  const { roles, loading, crearRol, editarRol, eliminarRol } = useRoles()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [rolEditando, setRolEditando] = useState(null)

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
    const confirmado = window.confirm('¿Seguro que deseas eliminar este rol?')

    if (!confirmado) {
      return
    }

    eliminarRol(id)
  }

  if (loading) {
    return <p>Cargando roles...</p>
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestión de roles</h2>
        <button type="button" onClick={abrirFormularioCreacion}>
          Crear nuevo rol
        </button>
      </div>

      {mostrarFormulario ? (
        <RoleForm
          rolInicial={rolEditando ?? RoleSchema}
          onSubmit={manejarSubmit}
          onCancelar={manejarCancelar}
        />
      ) : null}

      <RolesTable roles={roles} onEditar={manejarEditar} onEliminar={manejarEliminar} />
    </section>
  )
}
