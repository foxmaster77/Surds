import { Users, Mail, Phone, Calendar, MapPin, Eye } from 'lucide-react'

const Customers = () => {
  const customersData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      joinDate: 'Jan 15, 2024',
      location: 'New York, NY',
      links: 12,
      clicks: 3420,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+1 (555) 234-5678',
      joinDate: 'Feb 3, 2024',
      location: 'San Francisco, CA',
      links: 8,
      clicks: 2145,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      phone: '+1 (555) 345-6789',
      joinDate: 'Mar 10, 2024',
      location: 'Austin, TX',
      links: 15,
      clicks: 5890,
      status: 'Active'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david@example.com',
      phone: '+1 (555) 456-7890',
      joinDate: 'Apr 1, 2024',
      location: 'Seattle, WA',
      links: 5,
      clicks: 1250,
      status: 'Inactive'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Customers</h1>
        <p className="text-dark-400">Manage and view all your customers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Total Customers</h3>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">4</p>
          <p className="text-dark-500 text-xs mt-1">+1 this month</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Active</h3>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-dark-500 text-xs mt-1">75% of total</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Avg. Links</h3>
            <Eye className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-white">10</p>
          <p className="text-dark-500 text-xs mt-1">Per customer</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Total Clicks</h3>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-white">12.7K</p>
          <p className="text-dark-500 text-xs mt-1">From all customers</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-800">
                <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Name</th>
                <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Email</th>
                <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Location</th>
                <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Links</th>
                <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Clicks</th>
                <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((customer) => (
                <tr key={customer.id} className="border-b border-dark-800 hover:bg-dark-800 transition">
                  <td className="px-6 py-4 text-white font-medium">{customer.name}</td>
                  <td className="px-6 py-4 text-dark-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-dark-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    {customer.location}
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">{customer.links}</td>
                  <td className="px-6 py-4 text-white font-semibold">{customer.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'Active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-dark-900 border border-dark-800 rounded-lg">
        <p className="text-dark-400 text-sm">
          📊 Showing 4 customers • Total engagement: 12,705 clicks from 40 links
        </p>
      </div>
    </div>
  )
}

export default Customers
