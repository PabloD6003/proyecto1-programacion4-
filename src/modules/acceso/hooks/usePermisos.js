import { useState, useEffect } from 'react'
import { getPermisos } from '../../../services/accesoService'

export default function usePermisos(enabled = true) {
  const [permisos, setPermisos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled) return

    const cargarPermisos = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPermisos()
        setPermisos(data)
      } catch {
        setError('Error al cargar el catálogo de permisos')
      } finally {
        setLoading(false)
      }
    }

    cargarPermisos()
  }, [enabled])

  return { permisos, loading, error }
}
