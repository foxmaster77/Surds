import { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineController, LineElement, CategoryScale, LinearScale } from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, LineController, LineElement, CategoryScale, LinearScale)

const Charts = ({ analytics }) => {
  const lineChartData = useMemo(() => {
    if (!analytics?.dailyClicks) {
      return {
        labels: ['No data'],
        datasets: [],
      }
    }

    const last7Days = analytics.dailyClicks.slice(-7)
    return {
      labels: last7Days.map((d) => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [
        {
          label: 'Clicks',
          data: last7Days.map((d) => d.count),
          borderColor: '#6c63ff',
          backgroundColor: 'rgba(108, 99, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6c63ff',
          pointBorderColor: '#fff',
          pointRadius: 5,
        },
      ],
    }
  }, [analytics])

  const doughnutChartData = useMemo(() => {
    if (!analytics?.topLinks || analytics.topLinks.length === 0) {
      return {
        labels: ['No data'],
        datasets: [{ data: [1], backgroundColor: ['#4b5563'] }],
      }
    }

    return {
      labels: analytics.topLinks.slice(0, 5).map((l) => l.title || 'Link'),
      datasets: [
        {
          data: analytics.topLinks.slice(0, 5).map((l) => l.clicks),
          backgroundColor: ['#6c63ff', '#ff6b9d', '#10b981', '#f59e0b', '#3b82f6'],
          borderColor: '#1f2937',
          borderWidth: 2,
        },
      ],
    }
  }, [analytics])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#d1d5db',
          font: { size: 12 },
        },
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Clicks Last 7 Days</h3>
        <div style={{ height: 300 }}>
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Links</h3>
        <div style={{ height: 300 }}>
          <Doughnut data={doughnutChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Charts
