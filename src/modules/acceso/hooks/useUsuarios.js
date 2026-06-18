import { useState, useEffect, useCallback } from 'react'
import {
  getUsuarios,
  asignarRolUsuario,
  cambiarEstadoUsuario,
} from '../../../services/accesoService'

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

  // El backend responde { mensaje }, no el usuario actualizado: recargamos la lista
  // para reflejar el nuevo rol/estado.
  const asignarRol = async (id, rolId) => {
    await asignarRolUsuario(id, rolId)
    await cargarUsuarios()
  }

  const cambiarEstado = async (id, activo) => {
    await cambiarEstadoUsuario(id, activo)
    await cargarUsuarios()
  }

  return { usuarios, loading, error, asignarRol, cambiarEstado }
}
