import { useState, useEffect } from 'react'
import { getRoles, saveRoles } from '../services/accesoService'

export default function useRoles() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true)
      try {
        const data = await getRoles()
        setRoles(data)
      } catch {
        setError('Error al cargar los roles')
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  const crearRol = async ({ nombre, descripcion }) => {
    const nuevoRol = {
      id: roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1,
      nombre,
      descripcion,
      creadoEn: new Date().toISOString(),
    }
    const updatedRoles = [...roles, nuevoRol]
    await saveRoles(updatedRoles)
    setRoles(updatedRoles)
  }

  const editarRol = async (id, { nombre, descripcion }) => {
    const updatedRoles = roles.map((r) => r.id === id ? { ...r, nombre, descripcion } : r)
    await saveRoles(updatedRoles)
    setRoles(updatedRoles)
  }

  const eliminarRol = async (id) => {
    const updatedRoles = roles.filter((r) => r.id !== id)
    await saveRoles(updatedRoles)
    setRoles(updatedRoles)
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