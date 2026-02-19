import DashboardLayout from '../components/DashboardLayout'
import { TrendingUp, Users, Zap } from 'lucide-react'

const Analytics = () => {
  const analyticsData = [
    { label: 'Total Links', value: '128', icon: Zap, color: 'text-primary' },
    { label: 'Total Clicks', value: '2,543', icon: TrendingUp, color: 'text-secondary' },
    { label: 'Avg. Clicks/Link', value: '19.8', icon: Users, color: 'text-success' },
  ]

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-dark-400 mb-8">Detailed insights about your links and traffic</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsData.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-2">{label}</p>
                  <p className="text-3xl font-bold text-white">{value}</p>
                </div>
                <Icon className={`w-8 h-8 ${color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder for more analytics */}
        <div className="card p-8 mt-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">More analytics coming soon</h3>
          <p className="text-dark-400">Detailed click history, geographic data, and more</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Analytics
