import axios from 'axios'
import { getEnv, getJsonBinApiKey, getJsonBinBaseUrl, hasJsonBinCredentials } from '../utils/env'

const EMPTY_INVENTORY = {
  version: 1,
  productos: [],
  movimientos: [],
}

function getInventarioBinId() {
  return (
    getEnv('VITE_JSONBIN_INVENTARIO_ID') ||
    getEnv('VITE_JSONBIN_BIN_ID_Inventario') ||
    getEnv('VITE_JSONBIN_BIN_ID')
  )
}

function hasInventarioConfig() {
  return Boolean(getInventarioBinId() && hasJsonBinCredentials())
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Master-Key': getJsonBinApiKey(),
  }
}

export async function loadInventory() {
  if (!hasInventarioConfig()) {
    throw new Error(
      'Falta configuración de JsonBin para inventario. Revise VITE_JSONBIN_API_KEY y VITE_JSONBIN_INVENTARIO_ID en .env',
    )
  }

  const url = `${getJsonBinBaseUrl()}/b/${getInventarioBinId()}/latest`

  try {
    const res = await axios.get(url, { headers: getHeaders() })
    const record = res?.data?.record
    if (record && typeof record === 'object') return record
    return EMPTY_INVENTORY
  } catch (err) {
    const status = err?.response?.status
    const body = err?.response?.data
    console.error('JsonBin loadInventory error', { status, body })
    throw new Error(`Error al cargar inventario desde JsonBin (status: ${status ?? 'desconocido'}).`)
  }
}

export async function saveInventory(next) {
  if (!hasInventarioConfig()) {
    throw new Error('Falta configuración de JsonBin para inventario.')
  }

  const url = `${getJsonBinBaseUrl()}/b/${getInventarioBinId()}`
  const res = await axios.put(url, { ...next }, { headers: getHeaders() })
  return res?.data?.record ?? next
}
