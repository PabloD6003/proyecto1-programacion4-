import axios from 'axios'

const jsonbinClient = axios.create({
  baseURL: 'https://api.jsonbin.io/v3/b',
  headers: {
    'X-Master-Key': import.meta.env.VITE_JSONBIN_API_KEY,
    'Content-Type': 'application/json',
  },
})

export default jsonbinClient
