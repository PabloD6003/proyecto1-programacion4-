import jsonbinClient from './jsonbinClient'

const BIN_ID = import.meta.env.VITE_JSONBIN_BIN2_ID

const asistenciaService = {
  getAll: async () => {
    const response = await jsonbinClient.get(`/${BIN_ID}/latest`)
    return response.data.record.asistencia
  },

  getByFecha: async (fecha) => {
    const asistencia = await asistenciaService.getAll()
    return asistencia[fecha] || []
  },

  toggleAsistencia: async (fecha, beneficiarioId) => {
    const asistencia = await asistenciaService.getAll()
    const presentesHoy = asistencia[fecha] || []

    const yaPresente = presentesHoy.includes(beneficiarioId)
    const presentesActualizados = yaPresente
      ? presentesHoy.filter((id) => id !== beneficiarioId)
      : [...presentesHoy, beneficiarioId]

    const asistenciaActualizada = {
      ...asistencia,
      [fecha]: presentesActualizados,
    }

    const response = await jsonbinClient.put(`/${BIN_ID}`, {
      asistencia: asistenciaActualizada,
    })

    return response.data.record.asistencia[fecha] || []
  },
}

export default asistenciaService