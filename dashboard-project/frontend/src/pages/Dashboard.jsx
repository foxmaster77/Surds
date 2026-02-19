import { useContext, useEffect, useState } from 'react'
import { Plus, Zap, TrendingUp, Share2 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import LinkCard from '../components/LinkCard'
import Charts from '../components/Charts'
import AddLinkModal from '../components/AddLinkModal'
import AuthContext from '../context/AuthContext'
import { linksAPI } from '../services/api'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [links, setLinks] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch links
  const fetchLinks = async () => {
    try {
      setLoading(true)
      const response = await linksAPI.getAll()
      setLinks(response.data.data || [])
      setError('')
    } catch (err) {
      setError('Failed to load links')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const response = await linksAPI.getAnalytics()
      setAnalytics(response.data.data || {})
    } catch (err) {
      console.error('Failed to load analytics:', err)
    }
  }

  // Initial load
  useEffect(() => {
    fetchLinks()
    fetchAnalytics()
  }, [])

  // Create link
  const handleCreateLink = async (data) => {
    try {
      setLoading(true)
      const response = await linksAPI.create(data)
      setLinks([response.data.data, ...links])
      setIsModalOpen(false)
      await fetchAnalytics()
      setError('')
    } catch (err) {
      setError('Failed to create link')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Delete link
  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return

    try {
      await linksAPI.delete(linkId)
      setLinks(links.filter((link) => link._id !== linkId))
      await fetchAnalytics()
      setError('')
    } catch (err) {
      setError('Failed to delete link')
      console.error(err)
    }
  }

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user?.email?.split('@')[0]}
            </h1>
            <p className="text-dark-400">Manage and track your shortened links</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5" />
            New Link
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 flex items-center gap-4">
            <div className="p-3 bg-primary bg-opacity-20 rounded-lg">
              <Share2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-dark-400 text-sm">Total Links</p>
              <p className="text-2xl font-bold text-white">{links.length}</p>
            </div>
          </div>

          <div className="card p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary bg-opacity-20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-dark-400 text-sm">Total Clicks</p>
              <p className="text-2xl font-bold text-white">{analytics?.totalClicks || 0}</p>
            </div>
          </div>

          <div className="card p-6 flex items-center gap-4">
            <div className="p-3 bg-success bg-opacity-20 rounded-lg">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-dark-400 text-sm">Plan</p>
              <p className="text-2xl font-bold text-white">Free</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {analytics && <Charts analytics={analytics} />}

      {/* Links Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Links</h2>
          {links.length > 0 && (
            <p className="text-dark-400 text-sm">{links.length} total</p>
          )}
        </div>

        {error && (
          <div className="bg-danger bg-opacity-10 border border-danger border-opacity-50 rounded-lg p-4 text-danger mb-6">
            {error}
          </div>
        )}

        {links.length === 0 ? (
          <div className="card p-12 text-center">
            <Share2 className="w-16 h-16 text-dark-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No links yet</h3>
            <p className="text-dark-400 mb-6">Create your first shortened link to get started</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary mx-auto"
            >
              Create Link
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <LinkCard key={link._id} link={link} onDelete={handleDeleteLink} />
            ))}
          </div>
        )}
      </div>

      {/* Add Link Modal */}
      <AddLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLink}
        loading={loading}
      />
    </DashboardLayout>
  )
}

export default Dashboard
