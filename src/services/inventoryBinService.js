import axios from 'axios'
import { normalizeItem } from '../utils/inventory'

function cleanEnv(value) {
  if (!value) return ''
  return String(value)
    .replace(/^['"]|['"]$/g, '')
    .replace(/\\\$/g, '$')
    .trim()
}

const BIN_ID = cleanEnv(import.meta.env.VITE_JSONBIN_BIN_ID_Inven)
const ACCESS_KEY =
  cleanEnv(import.meta.env.VITE_JSONBIN_ACCESS_KEY_Inven) ||
  cleanEnv(import.meta.env.VITE_JSONBIN_API_KEY_Inven)

const PLACEHOLDERS = new Set(['', 'tu_access_key', 'tu_master_key', 'tu_api_key'])

export function isJsonBinConfigured() {
  return BIN_ID && BIN_ID !== 'tu_bin_id' && ACCESS_KEY && !PLACEHOLDERS.has(ACCESS_KEY)
}

export function getJsonBinConfigError() {
  if (!BIN_ID || BIN_ID === 'tu_bin_id') {
    return 'Falta VITE_JSONBIN_BIN_ID_Inven en el archivo .env'
  }
  if (!ACCESS_KEY || PLACEHOLDERS.has(ACCESS_KEY)) {
    return 'Falta VITE_JSONBIN_ACCESS_KEY_Inven en el archivo .env'
  }
  return null
}

export const jsonbinClient = axios.create({
  baseURL: `https://api.jsonbin.io/v3/b/${BIN_ID}`,
  headers: {
    'X-Access-Key': ACCESS_KEY,
    'Content-Type': 'application/json',
  },
})

export function parseInventoryRecord(record) {
  if (!record) return []
  if (Array.isArray(record.inventory)) {
    return record.inventory.map(normalizeItem)
  }
  if (Array.isArray(record)) {
    return record.map(normalizeItem)
  }
  return []
}

export function getApiErrorMessage(err) {
  const data = err.response?.data
  if (typeof data === 'string') return data
  if (data?.message) return data.message
  if (err.response?.status === 401) {
    return 'Access Key inválida. Revisa VITE_JSONBIN_ACCESS_KEY en .env.'
  }
  if (err.response?.status === 403) {
    return 'Access Key sin permisos para esta operación. Revisa permisos read/update en JsonBin.'
  }
  if (err.response?.status === 404) {
    return 'Bin no encontrado. Revisa VITE_JSONBIN_BIN_ID en .env.'
  }
  if (err.code === 'ERR_NETWORK') {
    return 'Sin conexión a JsonBin. Revisa tu internet o la Access Key.'
  }
  return err.message || 'Error de JsonBin'
}

export async function fetchInventoryFromBin() {
  const configError = getJsonBinConfigError()
  if (configError) throw new Error(configError)

  const res = await jsonbinClient.get('/latest')
  return parseInventoryRecord(res.data.record)
}

export async function saveInventoryToBin(inventory) {
  const configError = getJsonBinConfigError()
  if (configError) throw new Error(configError)

  await jsonbinClient.put('', { inventory })
  return inventory.map(normalizeItem)
}
