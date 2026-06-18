import apiClient from './apiClient'

const asistenciaService = {
  getByFecha: async (fecha) => {
    const { data } = await apiClient.get(`/asistencia/${fecha}`)
    return data
  },

  toggleAsistencia: async (fecha, beneficiarioId) => {
    const { data } = await apiClient.put(`/asistencia/${fecha}/${beneficiarioId}/toggle`)
    return data
  },
}

export default asistenciaService
