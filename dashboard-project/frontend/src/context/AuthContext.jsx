import { createContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Set up axios interceptor to include token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [token])

  const register = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
      })
      const { token: newToken, user: userData } = response.data
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      })
      const { token: newToken, user: userData } = response.data
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    delete axios.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }, [])

  const isAuthenticated = !!token && !!user

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
