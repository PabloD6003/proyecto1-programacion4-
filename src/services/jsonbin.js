import axios from 'axios'

const EMPTY_INVENTORY = {
  version: 1,
  productos: [],
  movimientos: [],
}

function getEnv(name, fallback = '') {
  const raw = (import.meta.env?.[name] ?? fallback).toString()
  const trimmed = raw.trim()
  // .env a veces se guarda como: VITE_XXX='valor', y eso rompe la auth.
  // Si detectamos comillas envolviendo el valor, las quitamos.
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

function hasJsonBinConfig() {
  return Boolean(getEnv('VITE_JSONBIN_BIN_ID_Inventario') && getEnv('VITE_JSONBIN_MASTER_KEY'))
}

function getBaseUrl() {
  return getEnv('VITE_JSONBIN_BASE_URL', 'https://api.jsonbin.io/v3')
}

function getBinId() {
  return getEnv('VITE_JSONBIN_BIN_ID_Inventario')
}

function getMasterKey() {
  return getEnv('VITE_JSONBIN_MASTER_KEY')
}

function localKey() {
  return `inventory:local:v1`
}

export async function loadInventory() {
  if (!hasJsonBinConfig()) {
    const raw = localStorage.getItem(localKey())
    if (raw) return JSON.parse(raw)
    localStorage.setItem(localKey(), JSON.stringify(EMPTY_INVENTORY))
    return EMPTY_INVENTORY
  }

  const url = `${getBaseUrl()}/b/${getBinId()}/latest`
  let res
  try {
    res = await axios.get(url, {
      headers: {
        'X-Master-Key': getMasterKey(),
      },
    })
  } catch (err) {
    const status = err?.response?.status
    const body = err?.response?.data
    // No imprimimos el master key; solo información útil para depurar.
    // eslint-disable-next-line no-console
    console.error('JsonBin loadInventory error', { status, body })
    throw new Error(`Error al cargar JsonBin (status: ${status ?? 'desconocido'}).`)
  }

  const record = res?.data?.record
  if (record && typeof record === 'object') return record

  await saveInventory(EMPTY_INVENTORY)
  return EMPTY_INVENTORY
}

export async function saveInventory(next) {
  if (!hasJsonBinConfig()) {
    localStorage.setItem(localKey(), JSON.stringify(next))
    return next
  }

  const url = `${getBaseUrl()}/b/${getBinId()}`
  const res = await axios.put(
    url,
    { ...next },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': getMasterKey(),
      },
    },
  )

  return res?.data?.record ?? next
}

