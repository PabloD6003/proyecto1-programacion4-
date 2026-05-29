import jsonbinClient from './jsonbinClient'
import { getEnv } from '../utils/env'

const BIN_ID = getEnv('VITE_JSONBIN_BENEFICIARIOS_ID')

const beneficiariosService = {
  getAll: async () => {
    const response = await jsonbinClient.get(`/${BIN_ID}/latest`)
    return response.data.record?.beneficiarios ?? []
  },

  create: async (nuevoBeneficiario) => {
    const actuales = await beneficiariosService.getAll()
    const actualizados = [...actuales, nuevoBeneficiario]
    const response = await jsonbinClient.put(`/${BIN_ID}`, {
      beneficiarios: actualizados,
    })
    return response.data.record?.beneficiarios ?? actualizados
  },

  update: async (id, datosActualizados) => {
    const actuales = await beneficiariosService.getAll()
    const actualizados = actuales.map((b) =>
      b.id === id ? { ...b, ...datosActualizados } : b,
    )
    const response = await jsonbinClient.put(`/${BIN_ID}`, {
      beneficiarios: actualizados,
    })
    return response.data.record?.beneficiarios ?? actualizados
  },

  toggleStatus: async (id) => {
    const actuales = await beneficiariosService.getAll()
    const actualizados = actuales.map((b) =>
      b.id === id ? { ...b, activo: !b.activo } : b,
    )
    const response = await jsonbinClient.put(`/${BIN_ID}`, {
      beneficiarios: actualizados,
    })
    return response.data.record?.beneficiarios ?? actualizados
  },
}

export default beneficiariosService
