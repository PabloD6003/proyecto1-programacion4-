import axios from 'axios'

const TOKEN_KEY = 'auth_token'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api-proxy',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { TOKEN_KEY }
