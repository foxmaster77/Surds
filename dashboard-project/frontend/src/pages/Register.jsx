import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register, loading, error } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    const success = await register(email, password)
    if (success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">LinkForge</h1>
          </div>
          <p className="text-dark-400">Join thousands of users managing links</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6 animate-fadeIn">
          {(error || localError) && (
            <div className="bg-danger bg-opacity-10 border border-danger border-opacity-50 rounded-lg p-4 text-danger text-sm">
              {error || localError}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-dark-400 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:text-opacity-80 font-medium">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
