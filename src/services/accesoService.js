import apiClient from './apiClient'

export const getRoles = async () => {
  const { data } = await apiClient.get('/roles')
  return data
}

export const crearRol = async ({ nombre, descripcion, permisos }) => {
  const { data } = await apiClient.post('/roles', { nombre, descripcion, permisos })
  return data
}

export const editarRol = async (id, { nombre, descripcion, permisos }) => {
  const { data } = await apiClient.put(`/roles/${id}`, { nombre, descripcion, permisos })
  return data
}

export const eliminarRol = async (id) => {
  await apiClient.delete(`/roles/${id}`)
}

export const getPermisos = async () => {
  const { data } = await apiClient.get('/permisos')
  return data
}

export const getUsuarios = async () => {
  const { data } = await apiClient.get('/usuarios')
  return data
}

export const asignarRolUsuario = async (id, rolId) => {
  const { data } = await apiClient.put(`/usuarios/${id}/rol`, { rolId })
  return data
}
