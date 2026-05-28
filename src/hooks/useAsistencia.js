import { useState, useEffect, useCallback } from 'react'
import asistenciaService from '../services/asistenciaService'

const useAsistencia = (fecha) => {
  const [presentes, setPresentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPresentes = useCallback(async () => {
    if (!fecha) {
      setPresentes([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const data = await asistenciaService.getByFecha(fecha)
      setPresentes(data)
    } catch (err) {
      setError(err.message || 'Error al cargar la asistencia')
    } finally {
      setLoading(false)
    }
  }, [fecha])

  useEffect(() => {
    fetchPresentes()
  }, [fetchPresentes])

  const toggleAsistencia = async (beneficiarioId) => {
    try {
      setError(null)
      const presentesActualizados = await asistenciaService.toggleAsistencia(
        fecha,
        beneficiarioId,
      )
      setPresentes(presentesActualizados)
    } catch (err) {
      setError(err.message || 'Error al registrar la asistencia')
      throw err
    }
  }

  const estaPresente = (beneficiarioId) => presentes.includes(beneficiarioId)

  return {
    presentes,
    loading,
    error,
    toggleAsistencia,
    estaPresente,
    refetch: fetchPresentes,
  }
}

export default useAsistencia
