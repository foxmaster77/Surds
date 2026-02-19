import { Trash2, Copy, ExternalLink, TrendingUp } from 'lucide-react'

const LinkCard = ({ link, onDelete }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(link.shortUrl || link._id)
    alert('Link copied!')
  }

  const shortCode = link.shortCode || link._id?.substring(0, 6)
  const shortUrl = `${window.location.origin}/${shortCode}`

  return (
    <div className="card-hover p-6 space-y-4 animate-slideIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{link.title || 'Untitled Link'}</h3>
          <p className="text-sm text-dark-400 truncate">{link.originalUrl}</p>
        </div>
      </div>

      {/* Short Link */}
      <div className="bg-dark-800 rounded-lg p-3 flex items-center justify-between group">
        <code className="text-sm text-primary font-mono">{shortUrl}</code>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Copy link"
        >
          <Copy className="w-4 h-4 text-dark-400" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dark-800 rounded-lg p-3">
          <div className="text-2xl font-bold text-primary">{link.clicks || 0}</div>
          <div className="text-xs text-dark-400">Clicks</div>
        </div>
        <div className="bg-dark-800 rounded-lg p-3">
          <div className="text-xs text-dark-400">Created</div>
          <div className="text-sm font-medium text-white">
            {new Date(link.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-dark-800">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:text-opacity-80 text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Visit
        </a>
        <button
          onClick={() => onDelete(link._id)}
          className="p-2 hover:bg-danger hover:bg-opacity-10 rounded-lg transition-colors text-dark-400 hover:text-danger"
          title="Delete link"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default LinkCard
