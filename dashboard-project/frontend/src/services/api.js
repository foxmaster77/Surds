import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Links API
export const linksAPI = {
  getAll: () => api.get('/links'),
  create: (data) => api.post('/links', data),
  delete: (id) => api.delete(`/links/${id}`),
  getAnalytics: () => api.get('/links/analytics'),
  getShortLink: (shortCode) => api.get(`/links/${shortCode}`),
}

// Auth API
export const authAPI = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify'),
}

export default api
