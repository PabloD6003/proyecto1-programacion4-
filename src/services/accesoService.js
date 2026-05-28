import axios from 'axios'

const API_URL = `https://api.jsonbin.io/v3/b/${import.meta.env.VITE_JSONBIN_ACCESO_ID}`
const ACCESS_KEY = import.meta.env.VITE_JSONBIN_API_KEY
const headers = {
  'X-Master-Key': ACCESS_KEY,
  'Content-Type': 'application/json',
}

export const getRoles = async () => {
  const response = await axios.get(API_URL, { headers })
  return response.data.record.roles
}

export const saveRoles = async (roles) => {
  await axios.put(API_URL, { roles }, { headers })
}