import { useState } from 'react'
import { X, Link as LinkIcon } from 'lucide-react'

const AddLinkModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [title, setTitle] = useState('')
  const [originalUrl, setOriginalUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !originalUrl.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      new URL(originalUrl)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    onSubmit({ title, originalUrl })
    setTitle('')
    setOriginalUrl('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-900 rounded-lg max-w-md w-full animate-slideIn border border-dark-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-800">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-white">Create New Link</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-danger bg-opacity-10 border border-danger border-opacity-50 rounded-lg p-3 text-danger text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">Link Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., My Blog"
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">Original URL</label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLinkModal
