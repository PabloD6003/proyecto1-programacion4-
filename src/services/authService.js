import { apiClient } from './apiClient'

export async function login(email, password) {
  const { data } = await apiClient.post('/login', {
    id: 0,
    email,
    password,
    role: '',
  })
  return data.token
}
