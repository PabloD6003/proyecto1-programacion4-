import axios from 'axios'

const API_URL = `https://api.jsonbin.io/v3/b/${import.meta.env.VITE_JSONBIN_DONACIONES_ID}`
const ACCESS_KEY = import.meta.env.VITE_JSONBIN_API_KEY
console.log('ACCESS_KEY:', ACCESS_KEY)
const headers = {
  'X-Master-Key': ACCESS_KEY,
  'Content-Type': 'application/json'
}

// Obtener todas las donaciones
export const getDonaciones = async () => {
  const response = await axios.get(API_URL, { headers })
  return response.data.record.donaciones
}

// Crear una donación
export const createDonacion = async (donaciones, nuevaDonacion) => {
  const updatedDonaciones = [...donaciones, nuevaDonacion]
  await axios.put(API_URL, { donaciones: updatedDonaciones }, { headers })
}

// Actualizar una donación
export const updateDonacion = async (donaciones, index, donacionActualizada) => {
  const updatedDonaciones = donaciones.map((d, i) => i === index ? donacionActualizada : d)
  await axios.put(API_URL, { donaciones: updatedDonaciones }, { headers })
}

// Eliminar una donación
export const deleteDonacion = async (donaciones, index) => {
  const updatedDonaciones = donaciones.filter((_, i) => i !== index)
  await axios.put(API_URL, { donaciones: updatedDonaciones }, { headers })
}

// Anular/Reactivar donación cambiando el estado
export const anularDonacion = async (donaciones, index) => {
  const updatedDonaciones = donaciones.map((d, i) =>
    i === index ? { ...d, estado: d.estado === 'anulada' ? 'activa' : 'anulada' } : d
  )
  await axios.put(API_URL, { donaciones: updatedDonaciones }, { headers })
}
