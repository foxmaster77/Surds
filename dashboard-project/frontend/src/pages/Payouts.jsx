import { CreditCard, DollarSign, TrendingUp, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const Payouts = () => {
  const payoutsData = [
    {
      id: 'PO001',
      date: 'Mar 1, 2024',
      amount: '$5,240',
      status: 'Completed',
      method: 'Bank Transfer',
      period: 'Feb 1-29, 2024'
    },
    {
      id: 'PO002',
      date: 'Feb 1, 2024',
      amount: '$4,890',
      status: 'Completed',
      method: 'Bank Transfer',
      period: 'Jan 1-31, 2024'
    },
    {
      id: 'PO003',
      date: 'Mar 15, 2024',
      amount: '$6,150',
      status: 'Processing',
      method: 'Bank Transfer',
      period: 'Mar 1-15, 2024'
    },
    {
      id: 'PO004',
      date: 'Mar 31, 2024',
      amount: '$7,320',
      status: 'Pending',
      method: 'Bank Transfer',
      period: 'Mar 16-31, 2024'
    }
  ]

  const upcomingPayouts = [
    { date: 'April 1, 2024', amount: '$8,450', status: 'Scheduled' },
    { date: 'May 1, 2024', amount: '$8,900', status: 'Scheduled' }
  ]

  return (
    <div className="min-h-screen bg-dark-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Payouts</h1>
        <p className="text-dark-400">View and manage your earnings and payouts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Total Paid</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white">$16,130</p>
          <p className="text-dark-500 text-xs mt-1">All time</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Pending</h3>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-white">$7,320</p>
          <p className="text-dark-500 text-xs mt-1">Next payout</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">This Month</h3>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">$13,470</p>
          <p className="text-dark-500 text-xs mt-1">In progress</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-dark-400 text-sm font-medium">Average Monthly</h3>
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-white">$6,288</p>
          <p className="text-dark-500 text-xs mt-1">3-month avg</p>
        </div>
      </div>

      {/* Payouts History */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Payout History</h2>
        <div className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-800">
                  <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Payout ID</th>
                  <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Period</th>
                  <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Amount</th>
                  <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Method</th>
                  <th className="text-left px-6 py-4 text-dark-400 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutsData.map((payout) => (
                  <tr key={payout.id} className="border-b border-dark-800 hover:bg-dark-800 transition">
                    <td className="px-6 py-4 text-white font-medium font-mono text-sm">{payout.id}</td>
                    <td className="px-6 py-4 text-dark-300">{payout.period}</td>
                    <td className="px-6 py-4 text-white font-bold">{payout.amount}</td>
                    <td className="px-6 py-4 text-dark-300 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      {payout.method}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                        payout.status === 'Completed'
                          ? 'bg-green-500/20 text-green-400'
                          : payout.status === 'Processing'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {payout.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                        {payout.status === 'Processing' && <Clock className="w-3 h-3" />}
                        {payout.status === 'Pending' && <AlertCircle className="w-3 h-3" />}
                        {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming Payouts */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Upcoming Payouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingPayouts.map((payout, idx) => (
            <div key={idx} className="bg-dark-900 border border-dark-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-dark-400 text-sm">Scheduled Date</p>
                    <p className="text-white font-semibold">{payout.date}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-primary">{payout.amount}</span>
              </div>
              <div className="pt-4 border-t border-dark-800">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                  {payout.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Info */}
      <div className="p-4 bg-dark-900 border border-dark-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-dark-300 text-sm font-semibold mb-1">Payout Information</p>
            <p className="text-dark-400 text-sm">
              Payouts are processed every month on the 1st. Minimum payout threshold: $100. 
              Update your payout method in Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payouts
