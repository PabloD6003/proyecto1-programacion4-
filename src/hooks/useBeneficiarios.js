import { useState, useEffect, useCallback } from 'react'
import beneficiariosService from '../services/beneficiariosService'

const useBeneficiarios = () => {
  const [beneficiarios, setBeneficiarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBeneficiarios = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await beneficiariosService.getAll()
      setBeneficiarios(data)
    } catch (err) {
      setError(err.message || 'Error al cargar los beneficiarios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBeneficiarios()
  }, [fetchBeneficiarios])

  const crearBeneficiario = async (datos) => {
    try {
      setError(null)
      const nuevo = await beneficiariosService.create(datos)
      setBeneficiarios((prev) => [...prev, nuevo])
    } catch (err) {
      setError(err.message || 'Error al crear el beneficiario')
      throw err
    }
  }

  const actualizarBeneficiario = async (id, datos) => {
    try {
      setError(null)
      const actualizado = await beneficiariosService.update(id, datos)
      setBeneficiarios((prev) => prev.map((b) => b.id === actualizado.id ? actualizado : b))
    } catch (err) {
      setError(err.message || 'Error al actualizar el beneficiario')
      throw err
    }
  }

  const toggleStatus = async (id) => {
    try {
      setError(null)
      const actualizado = await beneficiariosService.toggleStatus(id)
      setBeneficiarios((prev) => prev.map((b) => b.id === actualizado.id ? actualizado : b))
    } catch (err) {
      setError(err.message || 'Error al cambiar el estado')
      throw err
    }
  }

  return {
    beneficiarios,
    loading,
    error,
    refetch: fetchBeneficiarios,
    crearBeneficiario,
    actualizarBeneficiario,
    toggleStatus,
  }
}

export default useBeneficiarios
