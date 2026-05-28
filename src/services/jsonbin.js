import axios from 'axios'

function getEnv(name, fallback = '') {
  return (import.meta.env?.[name] ?? fallback).toString()
}

function hasJsonBinConfig() {
  return Boolean(getEnv('VITE_JSONBIN_BIN_ID') && getEnv('VITE_JSONBIN_MASTER_KEY'))
}

function getBaseUrl() {
  return getEnv('VITE_JSONBIN_BASE_URL', 'https://api.jsonbin.io/v3')
}

function getBinId() {
  return getEnv('VITE_JSONBIN_BIN_ID')
}

function getMasterKey() {
  return getEnv('VITE_JSONBIN_MASTER_KEY')
}

function localKey() {
  return `inventory:local:v1`
}

export async function loadInventory({ seed }) {
  if (!hasJsonBinConfig()) {
    const raw = localStorage.getItem(localKey())
    if (raw) return JSON.parse(raw)
    localStorage.setItem(localKey(), JSON.stringify(seed))
    return seed
  }

  const url = `${getBaseUrl()}/b/${getBinId()}/latest`
  const res = await axios.get(url, {
    headers: {
      'X-Master-Key': getMasterKey(),
    },
  })

  const record = res?.data?.record
  if (record && typeof record === 'object') return record

  await saveInventory(seed)
  return seed
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

