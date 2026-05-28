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

  const generarId = (lista) => {
    if (lista.length === 0) return 'b001'
    const numeros = lista
      .map((b) => parseInt(b.id.replace('b', ''), 10))
      .filter((n) => !isNaN(n))
    const siguiente = Math.max(...numeros) + 1
    return `b${String(siguiente).padStart(3, '0')}`
  }

  const crearBeneficiario = async (datos) => {
    try {
      setError(null)
      const nuevo = {
        ...datos,
        id: generarId(beneficiarios),
        fechaRegistro: new Date().toISOString().split('T')[0],
        activo: true,
      }
      const actualizados = await beneficiariosService.create(nuevo)
      setBeneficiarios(actualizados)
    } catch (err) {
      setError(err.message || 'Error al crear el beneficiario')
      throw err
    }
  }

  const actualizarBeneficiario = async (id, datos) => {
    try {
      setError(null)
      const actualizados = await beneficiariosService.update(id, datos)
      setBeneficiarios(actualizados)
    } catch (err) {
      setError(err.message || 'Error al actualizar el beneficiario')
      throw err
    }
  }

  const toggleStatus = async (id) => {
    try {
      setError(null)
      const actualizados = await beneficiariosService.toggleStatus(id)
      setBeneficiarios(actualizados)
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
