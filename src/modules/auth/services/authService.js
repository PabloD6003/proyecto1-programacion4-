import apiClient from '../../../services/apiClient'

export async function login({ email, password }) {
  const { data } = await apiClient.post('/Auth/login', { email, password })
  return data
}

export async function register({ nombre, email, password }) {
  const { data } = await apiClient.post('/Auth/register', { nombre, email, password })
  return data
}

export async function me() {
  const { data } = await apiClient.get('/Auth/me')
  return data
}
