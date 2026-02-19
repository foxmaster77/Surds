import { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Home, Settings, BarChart3, Users, Handshake, CreditCard, Zap, Menu } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/partners', icon: Handshake, label: 'Partners' },
    { path: '/payouts', icon: CreditCard, label: 'Payouts' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-dark-900 border-r border-dark-800 transform transition-transform duration-300 z-50 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-white">LinkForge</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(path)
                  ? 'bg-primary text-white'
                  : 'text-dark-400 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-dark-800 bg-dark-950">
          <div className="mb-4">
            <p className="text-xs text-dark-500 uppercase tracking-wider">Account</p>
            <p className="text-sm font-medium text-white truncate mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
