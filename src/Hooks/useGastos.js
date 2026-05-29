import { useState, useEffect, useCallback } from 'react'
import jsonbinClient from '../services/jsonbinClient'
import { getEnv } from '../utils/env'

const BIN_ID =
  getEnv('VITE_JSONBIN_GASTOS_ID') ||
  getEnv('VITE_JSONBIN_REGISTRO_GASTOS_ID')

export default function useGastos() {
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchGastos = useCallback(async () => {
    if (!BIN_ID) {
      setError('Falta VITE_JSONBIN_GASTOS_ID en .env')
      return
    }

    setLoading(true)
    try {
      const response = await jsonbinClient.get(`/${BIN_ID}/latest`)
      const record = response.data.record ?? {}
      const expenses = record.gastos ?? record.Gasto ?? []
      const gastosNormalizados = expenses.map((gasto, index) => ({
        ...gasto,
        id: index + 1,
      }))
      setGastos(gastosNormalizados)
      setError(null)
    } catch {
      setError('Error, no se puede cargar el registro de gastos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGastos()
  }, [fetchGastos])

  const agregarGasto = useCallback(
    async ({ detalle, monto, descripcion, fecha_gasto }) => {
      if (!BIN_ID) {
        setError('Falta VITE_JSONBIN_GASTOS_ID en .env')
        return
      }

      setLoading(true)
      try {
        const response = await jsonbinClient.get(`/${BIN_ID}/latest`)
        const record = response.data.record ?? {}
        const expenseKey = record.gastos ? 'gastos' : record.Gasto ? 'Gasto' : 'gastos'
        const gastosActuales = record[expenseKey] ?? []
        const nuevoGasto = {
          detalle,
          monto: parseFloat(monto),
          descripcion,
          fecha_gasto,
        }
        const gastosActualizados = [...gastosActuales, nuevoGasto].map((gasto, index) => ({
          ...gasto,
          id: index + 1,
        }))

        await jsonbinClient.put(`/${BIN_ID}`, {
          ...record,
          [expenseKey]: gastosActualizados,
        })

        setGastos(gastosActualizados)
        setError(null)
      } catch {
        setError('Error, no es posible agregar el gasto')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { gastos, loading, error, agregarGasto }
}
