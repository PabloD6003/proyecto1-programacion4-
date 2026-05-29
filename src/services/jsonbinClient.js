import axios from 'axios'
import { getJsonBinApiKey, getJsonBinBaseUrl } from '../utils/env'

const jsonbinClient = axios.create({
  baseURL: `${getJsonBinBaseUrl()}/b`,
  headers: {
    'Content-Type': 'application/json',
  },
})

jsonbinClient.interceptors.request.use((config) => {
  const apiKey = getJsonBinApiKey()
  if (apiKey) {
    config.headers['X-Master-Key'] = apiKey
  }
  return config
})

export default jsonbinClient
