import jsonbinClient from './jsonbinClient'
import { getEnv } from '../utils/env'

const BIN_ID = getEnv('VITE_JSONBIN_ACCESO_ID')

export const getRoles = async () => {
  const response = await jsonbinClient.get(`/${BIN_ID}/latest`)
  return response.data.record?.roles ?? []
}

export const saveRoles = async (roles) => {
  await jsonbinClient.put(`/${BIN_ID}`, { roles })
}
