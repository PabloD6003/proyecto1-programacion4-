import jsonbinClient from './jsonbinClient'
import { getEnv } from '../utils/env'

const BIN_ID = getEnv('VITE_JSONBIN_DONACIONES_ID')

export const getDonaciones = async () => {
  const response = await jsonbinClient.get(`/${BIN_ID}/latest`)
  return response.data.record?.donaciones ?? []
}

export const createDonacion = async (donaciones, nuevaDonacion) => {
  const updatedDonaciones = [...donaciones, { ...nuevaDonacion, estado: 'activa' }]
  await jsonbinClient.put(`/${BIN_ID}`, { donaciones: updatedDonaciones })
}

export const updateDonacion = async (donaciones, index, donacionActualizada) => {
  const updatedDonaciones = donaciones.map((d, i) => (i === index ? donacionActualizada : d))
  await jsonbinClient.put(`/${BIN_ID}`, { donaciones: updatedDonaciones })
}

export const deleteDonacion = async (donaciones, index) => {
  const updatedDonaciones = donaciones.filter((_, i) => i !== index)
  await jsonbinClient.put(`/${BIN_ID}`, { donaciones: updatedDonaciones })
}

export const anularDonacion = async (donaciones, index) => {
  const updatedDonaciones = donaciones.map((d, i) =>
    i === index ? { ...d, estado: d.estado === 'anulada' ? 'activa' : 'anulada' } : d,
  )
  await jsonbinClient.put(`/${BIN_ID}`, { donaciones: updatedDonaciones })
}
