import { useState, useEffect } from 'react'
import {
  getDonaciones,
  createDonacion,
  updateDonacion,
  deleteDonacion,
  anularDonacion as anularDonacionService,
} from '../services/donacionesService'

const useDonaciones = () => {
  const [donaciones, setDonaciones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDonaciones = async () => {
    setLoading(true)
    try {
      const data = await getDonaciones()
      setDonaciones(data)
    } catch (err) {
      setError('Error al cargar las donaciones')
    } finally {
      setLoading(false)
    }
  }

  const agregarDonacion = async (nuevaDonacion) => {
    try {
      await createDonacion(donaciones, nuevaDonacion)
      await fetchDonaciones()
    } catch (err) {
      setError('Error al agregar la donación')
    }
  }

  const editarDonacion = async (index, donacionActualizada) => {
    try {
      await updateDonacion(donaciones, index, donacionActualizada)
      await fetchDonaciones()
    } catch (err) {
      setError('Error al editar la donación')
    }
  }

  const eliminarDonacion = async (index) => {
    try {
      await deleteDonacion(donaciones, index)
      await fetchDonaciones()
    } catch (err) {
      setError('Error al eliminar la donación')
    }
  }

  const anularDonacion = async (index) => {
    try {
      await anularDonacionService(donaciones, index)
      await fetchDonaciones()
    } catch (err) {
      setError('Error al anular la donación')
    }
  }

  useEffect(() => {
    fetchDonaciones()
  }, [])

  return {
    donaciones,
    loading,
    error,
    agregarDonacion,
    editarDonacion,
    eliminarDonacion,
    anularDonacion,
  }
}

export default useDonaciones