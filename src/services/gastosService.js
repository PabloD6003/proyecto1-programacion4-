import { apiClient } from './apiClient'

export const gastosService = {
  getAll:  ()         => apiClient.get('/gastos'),
  create:  (data)     => apiClient.post('/gastos', data),
  update:  (id, data) => apiClient.put(`/gastos/${id}`, data),
  remove:  (id)       => apiClient.delete(`/gastos/${id}`),
}