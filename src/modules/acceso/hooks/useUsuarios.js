import { useState, useEffect, useCallback } from 'react'
import { getUsuarios, asignarRolUsuario } from '../../../services/accesoService'

export default function useUsuarios(enabled = true) {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargarUsuarios = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getUsuarios()
      setUsuarios(data)
    } catch {
      setError('Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    cargarUsuarios()
  }, [enabled, cargarUsuarios])

  const asignarRol = async (id, rolId) => {
    const usuarioActualizado = await asignarRolUsuario(id, rolId)
    setUsuarios((prev) => prev.map((u) => (u.id === id ? usuarioActualizado : u)))
  }

  return { usuarios, loading, error, asignarRol }
}
