import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { analyticsAPI } from '../../services/api';
import { TrendingUp, Clock, ShoppingBag, Users } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [customerStats, setCustomerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      const [revenueRes, peakRes, topRes, catRes, customerRes] = await Promise.all([
        analyticsAPI.getRevenue(period),
        analyticsAPI.getPeakHours(),
        analyticsAPI.getTopItems({ limit: 10, period }),
        analyticsAPI.getCategories(),
        analyticsAPI.getCustomers(),
      ]);

      setRevenueData(revenueRes.data.data);
      setPeakHours(peakRes.data.data);
      setTopItems(topRes.data.data);
      setCategoryData(catRes.data.data);
      setCustomerStats(customerRes.data.data.stats);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueChartData = {
    labels: revenueData.map((d) => {
      const date = new Date(d._id);
      return period === 'year'
        ? date.toLocaleDateString('en-US', { month: 'short' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map((d) => d.revenue),
        borderColor: '#8B4513',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Orders',
        data: revenueData.map((d) => d.orders * 100), // Scale for visibility
        borderColor: '#CD853F',
        backgroundColor: 'rgba(205, 133, 63, 0.1)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const peakHoursChartData = {
    labels: peakHours.map((h) => `${h._id}:00`),
    datasets: [
      {
        label: 'Orders',
        data: peakHours.map((h) => h.count),
        backgroundColor: '#CD853F',
        borderRadius: 4,
      },
    ],
  };

  const categoryChartData = {
    labels: categoryData.map((c) => c._id?.charAt(0).toUpperCase() + c._id?.slice(1)),
    datasets: [
      {
        data: categoryData.map((c) => c.totalQuantity),
        backgroundColor: ['#8B4513', '#D2691E', '#CD853F', '#DEB887'],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chocolate-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Analytics Overview</h2>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                period === p
                  ? 'bg-chocolate-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-xl font-bold text-gray-800">
                ₹{revenueData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-xl font-bold text-gray-800">
                {revenueData.reduce((sum, d) => sum + d.orders, 0)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Repeat Customers</p>
              <p className="text-xl font-bold text-gray-800">
                {customerStats?.repeatPercentage || 0}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Peak Hour</p>
              <p className="text-xl font-bold text-gray-800">
                {peakHours.length > 0
                  ? `${peakHours.sort((a, b) => b.count - a.count)[0]?._id}:00`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue & Orders Trend</h3>
        <div className="h-80">
          <Line
            data={revenueChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Revenue (₹)',
                  },
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Orders',
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
            }}
          />
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Orders by Hour</h3>
          <div className="h-64">
            <Bar
              data={peakHoursChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales by Category</h3>
          <div className="h-64">
            <Doughnut
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Top Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Selling Items</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {topItems.map((item, index) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <span className="w-8 h-8 bg-chocolate-100 rounded-full flex items-center justify-center text-chocolate-600 font-bold">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.totalQuantity} sold</p>
                </div>
              </div>
              <span className="font-semibold text-chocolate-600">₹{item.totalRevenue}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
