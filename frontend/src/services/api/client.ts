import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor — add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civic_memory_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('civic_memory_token')
      // Don't redirect here; let components handle auth
    }
    return Promise.reject(error)
  }
)

export { apiClient }
export default apiClient
