import { useState } from 'react'

const mockRoles = [
  {
    id: 1,
    nombre: 'Administrador',
    descripcion: 'Acceso completo a la plataforma',
    creadoEn: '2026-05-20T10:00:00.000Z',
  },
  {
    id: 2,
    nombre: 'Editor',
    descripcion: 'Puede crear y modificar registros operativos',
    creadoEn: '2026-05-21T10:00:00.000Z',
  },
  {
    id: 3,
    nombre: 'Consulta',
    descripcion: 'Solo lectura de información del sistema',
    creadoEn: '2026-05-22T10:00:00.000Z',
  },
   {
    id: 4,
    nombre: 'Editor',
    descripcion: 'Puede crear y modificar registros operativos',
    creadoEn: '2026-05-22T10:00:00.000Z',
  },
]

export default function useRoles() {
  const [roles, setRoles] = useState(mockRoles)
  const [loading] = useState(false)

  const crearRol = ({ nombre, descripcion }) => {
    setRoles((prevRoles) => {
      const nextId = prevRoles.length > 0 ? Math.max(...prevRoles.map((rol) => rol.id)) + 1 : Date.now()

      return [
        ...prevRoles,
        {
          id: nextId,
          nombre,
          descripcion,
          creadoEn: new Date().toISOString(),
        },
      ]
    })
  }

  const editarRol = (id, { nombre, descripcion }) => {
    setRoles((prevRoles) =>
      prevRoles.map((rol) => (rol.id === id ? { ...rol, nombre, descripcion } : rol)),
    )
  }

  const eliminarRol = (id) => {
    setRoles((prevRoles) => prevRoles.filter((rol) => rol.id !== id))
  }

  return {
    roles,
    loading,
    crearRol,
    editarRol,
    eliminarRol,
  }
}
