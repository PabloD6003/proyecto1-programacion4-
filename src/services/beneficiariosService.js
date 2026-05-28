import jsonbinClient from './jsonbinClient'

const BIN_ID = import.meta.env.VITE_JSONBIN_BIN1_ID

const beneficiariosService = {
  getAll: async () => {
    const response = await jsonbinClient.get(`/${BIN_ID}/latest`)
    return response.data.record.beneficiarios
  },

  create: async (nuevoBeneficiario) => {
    const actuales = await beneficiariosService.getAll()
    const actualizados = [...actuales, nuevoBeneficiario]
    const response = await jsonbinClient.put(`/${BIN_ID}`, {
      beneficiarios: actualizados,
    })
    return response.data.record.beneficiarios
  },

  update: async (id, datosActualizados) => {
    const actuales = await beneficiariosService.getAll()
    const actualizados = actuales.map((b) =>
      b.id === id ? { ...b, ...datosActualizados } : b,
    )
    const response = await jsonbinClient.put(`/${BIN_ID}`, {
      beneficiarios: actualizados,
    })
    return response.data.record.beneficiarios
  },

  toggleStatus: async (id) => {
    const actuales = await beneficiariosService.getAll()
    const actualizados = actuales.map((b) =>
      b.id === id ? { ...b, activo: !b.activo } : b,
    )
    const response = await jsonbinClient.put(`/${BIN_ID}`, {
      beneficiarios: actualizados,
    })
    return response.data.record.beneficiarios
  },
}

export default beneficiariosService
