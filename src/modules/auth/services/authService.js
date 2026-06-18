import apiClient from '../../../services/apiClient'

export async function login({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

export async function register({ nombre, email, password }) {
  const { data } = await apiClient.post('/auth/register', { nombre, email, password })
  return data
}

export async function me() {
  const { data } = await apiClient.get('/auth/me')
  return data
}
