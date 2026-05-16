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
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chocolate-600"></div>
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
        borderColor: '#7C4A32',
        backgroundColor: 'rgba(124, 74, 50, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#7C4A32',
      }
    ],
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="admin-page-title font-display">Daily Sales Overview</h1>
      </div>

      {/* Primary KPI Row — 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Today's Sales */}
        <div className="admin-stat-card">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600"/>
            </div>
            <span className="stat-label">Today's Sales</span>
          </div>
          <p className="stat-value text-gray-800">₹{today.revenue || 0}</p>
        </div>
        
        {/* Total Orders */}
        <div className="admin-stat-card">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <ShoppingBag className="w-4 h-4 text-blue-600"/>
            </div>
            <span className="stat-label">Orders</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="stat-value text-gray-800">{today.totalOrders || 0}</p>
            <span className="text-[11px] font-medium text-gray-400">tokens</span>
          </div>
        </div>

        {/* Cash Collected */}
        <div className="admin-stat-card">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <Banknote className="w-4 h-4 text-emerald-600"/>
            </div>
            <span className="stat-label">Cash</span>
          </div>
          <p className="stat-value text-emerald-700">₹{today.cashPaymentsTotal || 0}</p>
        </div>

        {/* Online Verified */}
        <div className="admin-stat-card">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <Smartphone className="w-4 h-4 text-purple-600"/>
            </div>
            <span className="stat-label">Online</span>
          </div>
          <p className="stat-value text-purple-700">₹{today.onlinePaymentsTotal || 0}</p>
        </div>
      </div>

      {/* Pending Dues Banner */}
      {(today.pendingPaymentsAmount > 0 || today.unpaidOrdersCount > 0) && (
        <div className="admin-card flex items-center justify-between px-4 py-3 bg-amber-50/60 border-amber-200/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-800">Pending Dues</p>
              <p className="text-[11px] text-amber-600">{today.unpaidOrdersCount || 0} unpaid orders</p>
            </div>
          </div>
          <p className="text-lg font-bold text-amber-700">₹{today.pendingPaymentsAmount || 0}</p>
        </div>
      )}

      {/* Two-column layout: Top Sellers + Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Top Sellers */}
        <section>
          <h2 className="admin-section-title">Top Selling Items</h2>
          <div className="admin-card p-1.5">
            {topItems.length === 0 ? (
              <p className="text-center text-gray-400 py-6 text-xs">No sales data yet</p>
            ) : (
              topItems.map((item, index) => (
                <div key={item._id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-50 text-slate-400'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 text-xs leading-tight">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{item.totalQuantity} sold</p>
                    </div>
                  </div>
                  <span className="font-bold text-chocolate-600 text-xs">₹{item.totalRevenue}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Revenue Trend */}
        <section className="hidden sm:block">
          <h2 className="admin-section-title">7-Day Revenue</h2>
          <div className="admin-card p-3 h-[220px]">
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#3A2218',
                    titleFont: { size: 11 },
                    bodyFont: { size: 11 },
                    padding: 8,
                    cornerRadius: 8,
                  }
                },
                scales: {
                  y: { 
                    beginAtZero: true, 
                    grid: { borderDash: [3, 3], color: 'rgba(0,0,0,0.04)' },
                    ticks: { font: { size: 10 }, color: '#9ca3af' }
                  },
                  x: { 
                    grid: { display: false },
                    ticks: { font: { size: 10 }, color: '#9ca3af' }
                  }
                }
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
