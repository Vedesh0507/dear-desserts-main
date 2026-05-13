import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Banknote,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { analyticsAPI } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, topRes, revenueRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getTopItems({ limit: 5 }),
        analyticsAPI.getRevenue('week')
      ]);
      
      setStats(statsRes.data.data);
      setTopItems(topRes.data.data);
      setRevenueData(revenueRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-chocolate-600"></div>
      </div>
    );
  }

  const today = stats?.today || {};

  const revenueChartData = {
    labels: revenueData.map((d) => {
      const date = new Date(d._id);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revenueData.map((d) => d.revenue),
        borderColor: '#8B4513',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-display font-bold text-gray-800">Daily Sales Overview</h1>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg"><DollarSign className="w-5 h-5 text-green-600"/></div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Sales</span>
          </div>
          <p className="text-3xl font-display font-bold text-gray-800">₹{today.revenue || 0}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg"><ShoppingBag className="w-5 h-5 text-blue-600"/></div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-display font-bold text-gray-800">{today.totalOrders || 0}</p>
            <span className="text-sm font-medium text-gray-400">tokens</span>
          </div>
        </div>
      </div>

      {/* Payment Breakdown (Crucial for Mobile Admin) */}
      <section>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pl-1">Payment Breakdown</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="p-4 flex items-center justify-between border-b border-gray-50 bg-green-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Banknote className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Cash Collected</p>
                <p className="text-xs text-gray-500">In-person payments</p>
              </div>
            </div>
            <p className="text-lg font-bold text-green-700">₹{today.cashPaymentsTotal || 0}</p>
          </div>

          <div className="p-4 flex items-center justify-between border-b border-gray-50 bg-blue-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Online Verified</p>
                <p className="text-xs text-gray-500">UPI / Cards</p>
              </div>
            </div>
            <p className="text-lg font-bold text-blue-700">₹{today.onlinePaymentsTotal || 0}</p>
          </div>

          <div className="p-4 flex items-center justify-between bg-yellow-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Pending Dues</p>
                <p className="text-xs text-yellow-600 font-medium">{today.unpaidOrdersCount || 0} unpaid orders</p>
              </div>
            </div>
            <p className="text-lg font-bold text-yellow-700">₹{today.pendingPaymentsAmount || 0}</p>
          </div>

        </div>
      </section>

      {/* Top Sellers List View */}
      <section>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pl-1">Top Selling Items</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          {topItems.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm">No sales data yet</p>
          ) : (
            topItems.map((item, index) => (
              <div key={item._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-50 text-slate-500'
                  }`}>
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.totalQuantity} items sold</p>
                  </div>
                </div>
                <span className="font-bold text-chocolate-600 text-sm">₹{item.totalRevenue}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Revenue Trend (Hidden on very small screens to keep focus) */}
      <section className="hidden sm:block">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pl-1">7-Day Revenue Trend</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-64">
          <Line
            data={revenueChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, grid: { borderDash: [4, 4] } },
                x: { grid: { display: false } }
              }
            }}
          />
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
