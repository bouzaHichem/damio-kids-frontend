// Axios API instance for Next.js frontend to use the same backend as the existing CRA app
import axios from 'axios'

// Use NEXT_PUBLIC_API_URL to match CRA's REACT_APP_API_URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://damio-kids-backend.onrender.com'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach tokens from localStorage (client-only)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const userToken = localStorage.getItem('authToken') || localStorage.getItem('auth-token')
    const adminToken = localStorage.getItem('adminToken')
    const token = adminToken || userToken
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
      ;(config.headers as any)['auth-token'] = token
    }
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (typeof window !== 'undefined' && err?.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')
    }
    return Promise.reject(err)
  }
)

