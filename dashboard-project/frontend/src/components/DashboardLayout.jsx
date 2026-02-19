import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-dark-950">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Top Bar */}
        <header className="bg-dark-900 border-b border-dark-800 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white hidden md:block">Dashboard</h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-dark-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
