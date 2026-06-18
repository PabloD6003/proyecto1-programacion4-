import { useState, useEffect, useCallback } from 'react'
import { gastosService } from '../services/gastosService'

export default function useGastos() {
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGastos = async () => {
      setLoading(true)
      try {
        const response = await gastosService.getAll()
        setGastos(response.data)
      } catch {
        setError('Error, no se puede cargar el registro de gastos')
      } finally {
        setLoading(false)
      }
    }
    fetchGastos()
  }, [])

  const agregarGasto = useCallback(async ({ detalle, monto, descripcion, fecha_gasto }) => {
    setLoading(true)
    try {
      const response = await gastosService.create({
        detalle,
        monto: parseFloat(monto),
        descripcion,
        fecha_gasto,
      })
      setGastos((prev) => [...prev, response.data])
    } catch {
      setError('Error, no es posible agregar el gasto')
    } finally {
      setLoading(false)
    }
  }, [])

  const editarGasto = useCallback(async (id, data) => {
    setLoading(true)
    try {
      const response = await gastosService.update(id, {
        ...data,
        monto: parseFloat(data.monto),
      })
      setGastos((prev) => prev.map((g) => (g.id === id ? response.data : g)))
    } catch {
      setError('Error, no es posible editar el gasto')
    } finally {
      setLoading(false)
    }
  }, [])

  const eliminarGasto = useCallback(async (id) => {
    setLoading(true)
    try {
      await gastosService.remove(id)
      setGastos((prev) => prev.filter((g) => g.id !== id))
    } catch {
      setError('Error, no es posible eliminar el gasto')
    } finally {
      setLoading(false)
    }
  }, [])

  return { gastos, loading, error, agregarGasto, editarGasto, eliminarGasto }
}