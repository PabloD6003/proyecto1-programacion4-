import apiClient from './apiClient'

const beneficiariosService = {
  getAll: async () => {
    const { data } = await apiClient.get('/beneficiarios')
    return data
  },

  create: async (form) => {
    const { data } = await apiClient.post('/beneficiarios', form)
    return data
  },

  update: async (id, form) => {
    const { data } = await apiClient.put(`/beneficiarios/${id}`, form)
    return data
  },

  toggleStatus: async (id) => {
    const { data } = await apiClient.put(`/beneficiarios/${id}/toggle`)
    return data
  },
}

export default beneficiariosService
