export function getEnv(name, fallback = '') {
  const raw = (import.meta.env?.[name] ?? fallback).toString()
  let value = raw.trim()

  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1).trim()
  }

  // En .env a veces se escribe \$2a\$10\$... y eso rompe la autenticación.
  value = value.replace(/\\\$/g, '$')

  return value
}

export function getJsonBinApiKey() {
  return getEnv('VITE_JSONBIN_API_KEY') || getEnv('VITE_JSONBIN_MASTER_KEY')
}

export function getJsonBinBaseUrl() {
  return getEnv('VITE_JSONBIN_BASE_URL', 'https://api.jsonbin.io/v3')
}

export function hasJsonBinCredentials() {
  return Boolean(getJsonBinApiKey())
}
