import { useContext, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import AuthContext from '../context/AuthContext'
import { User, Bell, Lock, Zap } from 'lucide-react'

const Settings = () => {
  const { user } = useContext(AuthContext)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    activityUpdates: false,
    analyticsReports: true,
  })

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeIn max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-400 mb-8">Manage your account and preferences</p>

        {/* Account Section */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">Account</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-dark-400 mb-2">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field opacity-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-dark-400 mb-2">Account Type</label>
              <div className="inline-flex items-center gap-2">
                <span className="badge badge-free">Free Plan</span>
                <a href="#" className="text-primary text-sm hover:underline">
                  Upgrade to Pro
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries({
              emailNotifications: 'Email Notifications',
              activityUpdates: 'Activity Updates',
              analyticsReports: 'Weekly Analytics Reports',
            }).map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={() => handleToggle(key)}
                  className="w-4 h-4 rounded border-dark-700 text-primary"
                />
                <span className="text-dark-300">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-success" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>

          <button className="btn-secondary">Change Password</button>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-3">
          <button className="btn-primary">Save Changes</button>
          <button className="btn-secondary">Cancel</button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings
