import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { analyticsAPI } from '../../services/api';
import { TrendingUp, Clock, ShoppingBag, Users, CalendarDays, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('day');
  // Default to current date in YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, [period, selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getComprehensive({ period, date: selectedDate });
      setData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getChartLabel = (id) => {
    if (period === 'day') return `${id}:00`;
    if (period === 'month' || period === 'week') {
      const d = new Date(id);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (period === 'year') {
      const [year, month] = id.split('-');
      const d = new Date(year, parseInt(month) - 1, 1);
      return d.toLocaleDateString('en-US', { month: 'short' });
    }
    return id;
  };

  const revenueChartData = {
    labels: data?.salesGraph?.map((d) => getChartLabel(d._id)) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data?.salesGraph?.map((d) => d.revenue) || [],
        borderColor: '#7C4A32',
        backgroundColor: 'rgba(124, 74, 50, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: data?.salesGraph?.map((d) => d.orders) || [],
        borderColor: '#D4A833',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        yAxisID: 'y1',
      },
    ],
  };

  const categoryChartData = {
    labels: data?.categories?.map((c) => c._id?.charAt(0).toUpperCase() + c._id?.slice(1)) || [],
    datasets: [{
      data: data?.categories?.map((c) => c.totalQuantity) || [],
      backgroundColor: ['#7C4A32', '#B8916A', '#D4A833', '#E8D0AD', '#5D3727', '#F0D890'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#3A2218', titleFont: { size: 11 }, bodyFont: { size: 11 }, padding: 8, cornerRadius: 8 },
    },
    scales: {
      y: { beginAtZero: true, ticks: { font: { size: 10 }, color: '#9ca3af' }, grid: { color: 'rgba(0,0,0,0.03)' } },
      x: { ticks: { font: { size: 10 }, color: '#9ca3af' }, grid: { display: false } },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    plugins: { ...chartOptions.plugins, legend: { display: true, position: 'top', labels: { font: { size: 10 }, boxWidth: 12 } } },
    scales: {
      y: { type: 'linear', display: true, position: 'left', ticks: { font: { size: 10 }, color: '#9ca3af' }, grid: { color: 'rgba(0,0,0,0.03)' } },
      y1: { type: 'linear', display: true, position: 'right', ticks: { font: { size: 10 }, color: '#9ca3af', stepSize: 1 }, grid: { drawOnChartArea: false } },
      x: { ticks: { font: { size: 10 }, color: '#9ca3af' }, grid: { display: false } },
    }
  };

  return (
    <div className="space-y-4 pb-6 max-w-6xl mx-auto">
      {/* Header + Period & Date Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="admin-page-title font-display">Analytics Dashboard</h1>
          <p className="text-[11px] text-gray-500">Premium real-time insights & reporting</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden p-0.5 w-full sm:w-auto">
            <div className="pl-2 pr-1 text-gray-400"><CalendarDays className="w-4 h-4" /></div>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2 py-1.5 text-xs text-gray-700 font-medium bg-transparent border-none outline-none focus:ring-0 w-full sm:w-auto cursor-pointer"
            />
          </div>
          <div className="flex bg-gray-100/80 p-0.5 rounded-lg w-full sm:w-auto overflow-x-auto">
            {['day', 'week', 'month', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-[11px] font-semibold capitalize rounded-md transition-all whitespace-nowrap ${period === p ? 'bg-white text-chocolate-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chocolate-600"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics row 1 */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
            <div className="admin-stat-card lg:col-span-1">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-green-50 rounded-lg"><TrendingUp className="w-4 h-4 text-green-600" /></div>
                <span className="stat-label">Total Revenue</span>
              </div>
              <p className="stat-value text-gray-800">₹{data?.summary.revenue.toLocaleString()}</p>
            </div>
            <div className="admin-stat-card">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-blue-50 rounded-lg"><ShoppingBag className="w-4 h-4 text-blue-600" /></div>
                <span className="stat-label">Total Orders</span>
              </div>
              <p className="stat-value text-gray-800">{data?.summary.totalOrders}</p>
            </div>
            <div className="admin-stat-card">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-emerald-50 rounded-lg"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                <span className="stat-label">Completed</span>
              </div>
              <p className="stat-value text-emerald-700">{data?.summary.completedOrders}</p>
            </div>
            <div className="admin-stat-card">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-amber-50 rounded-lg"><AlertCircle className="w-4 h-4 text-amber-600" /></div>
                <span className="stat-label">Pending</span>
              </div>
              <p className="stat-value text-amber-700">{data?.summary.pendingOrders}</p>
            </div>
            <div className="admin-stat-card">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-red-50 rounded-lg"><XCircle className="w-4 h-4 text-red-600" /></div>
                <span className="stat-label">Cancelled</span>
              </div>
              <p className="stat-value text-red-700">{data?.summary.cancelledOrders}</p>
            </div>
          </div>

          {/* Key Metrics row 2 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="admin-stat-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-xl"><Users className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Repeat Customers</p>
                  <p className="text-xl font-bold text-gray-800">{data?.repeatPercentage}%</p>
                </div>
              </div>
            </div>
            <div className="admin-stat-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-xl"><Clock className="w-5 h-5 text-orange-600" /></div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Peak Order Time</p>
                  <p className="text-xl font-bold text-gray-800">{data?.peakHour}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="admin-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="admin-section-title">Sales & Orders Trend</h3>
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                {period === 'day' ? 'Hourly' : period === 'year' ? 'Monthly' : 'Daily'} Data
              </span>
            </div>
            <div className="h-64 relative">
              {data?.salesGraph?.length > 0 ? (
                <Line data={revenueChartData} options={lineChartOptions} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                  No sales data available for this period
                </div>
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Categories */}
            <div className="admin-card p-4 lg:col-span-1">
              <h3 className="admin-section-title mb-4">Category-wise Sales</h3>
              <div className="h-48 relative">
                {data?.categories?.length > 0 ? (
                  <Doughnut
                    data={categoryChartData}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10, padding: 15 } }, tooltip: chartOptions.plugins.tooltip } }}
                  />
                ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">No data</div>
                )}
              </div>
            </div>

            {/* Top Items */}
            <div className="admin-card p-4 lg:col-span-2">
              <h3 className="admin-section-title mb-3">Top Selling Items</h3>
              {data?.topItems?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {data.topItems.map((item, index) => (
                    <div key={item._id} className="flex items-center justify-between px-3 py-2.5 bg-gray-50/80 rounded-lg border border-gray-100/50 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300/50' :
                          index === 1 ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 border border-gray-300/50' :
                          index === 2 ? 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 border border-orange-300/50' :
                          'bg-white text-gray-400 border border-gray-200'
                        }`}>{index + 1}</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-[11px] leading-tight">{item.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{item.totalQuantity} items sold</p>
                        </div>
                      </div>
                      <span className="font-bold text-chocolate-600 text-xs bg-chocolate-50 px-2 py-1 rounded-md">₹{item.totalRevenue}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-sm text-gray-400">
                  No items sold in this period
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
