import { useState, useEffect, useCallback } from 'react'
import {
  getRoles,
  crearRol as crearRolApi,
  editarRol as editarRolApi,
  eliminarRol as eliminarRolApi,
} from '../services/accesoService'

export default function useRoles() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargarRoles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRoles()
      setRoles(data)
    } catch {
      setError('Error al cargar los roles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarRoles()
  }, [cargarRoles])

  const crearRol = async ({ nombre, descripcion, permisoIds }) => {
    const nuevoRol = await crearRolApi({ nombre, descripcion, permisoIds })
    setRoles((prev) => [...prev, nuevoRol])
  }

  const editarRol = async (id, { nombre, descripcion, permisoIds }) => {
    const rolActualizado = await editarRolApi(id, { nombre, descripcion, permisoIds })
    setRoles((prev) => prev.map((r) => (r.id === id ? rolActualizado : r)))
  }

  const eliminarRol = async (id) => {
    await eliminarRolApi(id)
    setRoles((prev) => prev.filter((r) => r.id !== id))
  }

  return {
    roles,
    loading,
    error,
    crearRol,
    editarRol,
    eliminarRol,
  }
}
