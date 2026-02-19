import { Handshake, MapPin, TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react'

const Partners = () => {
  const partnersData = [
    {
      id: 1,
      name: 'TechVenture Partners',
      category: 'Technology',
      status: 'Active',
      joinDate: 'Jan 20, 2024',
      website: 'techventure.com',
      referrals: 45,
      revenue: '$12,450'
    },
    {
      id: 2,
      name: 'Digital Growth Co',
      category: 'Marketing',
      status: 'Active',
      joinDate: 'Feb 10, 2024',
      website: 'digitalgrowth.io',
      referrals: 32,
      revenue: '$8,960'
    },
    {
      id: 3,
      name: 'StartUp Accelerator',
      category: 'Investment',
      status: 'Pending',
      joinDate: 'Mar 5, 2024',
      website: 'startupaccel.com',
      referrals: 8,
      revenue: '$2,240'
    },
    {
      id: 4,
      name: 'Social Media Hub',
      category: 'Social Media',
      status: 'Active',
      joinDate: 'Mar 18, 2024',
      website: 'socialhub.net',
      referrals: 67,
      revenue: '$18,760'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Partners</h1>
        <p className="text-dark-400">Manage partner relationships and track referrals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Total Partners</h3>
            <Handshake className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">4</p>
          <p className="text-dark-500 text-xs mt-1">3 active, 1 pending</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Total Referrals</h3>
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-white">152</p>
          <p className="text-dark-500 text-xs mt-1">+12 this month</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Partner Revenue</h3>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-white">$42.4K</p>
          <p className="text-dark-500 text-xs mt-1">YTD</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Avg. Revenue/Partner</h3>
            <Users className="w-5 h-5 text-accent" />
          </div>
          <p className="text-2xl font-bold text-white">$10.6K</p>
          <p className="text-dark-500 text-xs mt-1">Per partner</p>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partnersData.map((partner) => (
          <div key={partner.id} className="bg-dark-900 border border-dark-800 rounded-lg p-6 hover:border-primary/50 transition">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{partner.name}</h3>
                <p className="text-dark-400 text-sm">{partner.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                partner.status === 'Active'
                  ? 'bg-green-500/20 text-green-400 flex items-center gap-1'
                  : 'bg-yellow-500/20 text-yellow-400 flex items-center gap-1'
              }`}>
                {partner.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {partner.status}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4 pb-4 border-b border-dark-800">
              <div className="flex items-center gap-2 text-dark-300">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">{partner.website}</span>
              </div>
              <p className="text-dark-400 text-xs">Joined {partner.joinDate}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-dark-400 text-xs mb-1">Referrals</p>
                <p className="text-xl font-bold text-white">{partner.referrals}</p>
              </div>
              <div>
                <p className="text-dark-400 text-xs mb-1">Revenue</p>
                <p className="text-xl font-bold text-primary">{partner.revenue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-dark-900 border border-dark-800 rounded-lg">
        <p className="text-dark-400 text-sm">
          🤝 Partner program is performing well. Consider expanding to new markets.
        </p>
      </div>
    </div>
  )
}

export default Partners
