import { useState, useEffect } from 'react';
import { 
  Calendar, Banknote, Smartphone
} from 'lucide-react';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => { fetchHistory(); }, [page]);

  const fetchHistory = async () => {
    try {
      const response = await orderAPI.getAll({ status: 'completed', limit: 20, page });
      const newOrders = response.data.data;
      if (page === 1) setOrders(newOrders);
      else setOrders(prev => [...prev, ...newOrders]);
      setHasMore(response.data.page < response.data.pages);
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      toast.error('Failed to load history');
    } finally { setLoading(false); }
  };

  const psc = (s) => ['paid','online_verified','cash_received'].includes(s) ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700';

  if (loading && page === 1) {
    return (<div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chocolate-600"></div></div>);
  }

  return (
    <div className="max-w-3xl mx-auto pb-6">
      <div className="sticky top-0 bg-[#f8f6f3]/90 backdrop-blur-md z-10 py-3 -mt-3 border-b border-gray-200/50 mb-4">
        <h1 className="admin-page-title font-display">Order History</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">{orders.length} completed orders</p>
      </div>
      <div className="space-y-2">
        {orders.map((order) => (
          <div key={order._id} className="admin-card p-3 border-l-[3px] border-l-gray-300">
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-gray-800">Token #{order.tokenNumber}</span>
                <span className="text-[9px] text-gray-300 font-mono">{order.orderNumber}</span>
              </div>
              <span className="font-bold text-sm text-chocolate-700">₹{order.total}</span>
            </div>
            <div className="flex justify-between items-center mb-1.5 text-[11px]">
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 text-gray-500 capitalize font-medium">
                  {order.paymentMethod === 'cash' ? <Banknote className="w-3 h-3 text-emerald-500" /> : <Smartphone className="w-3 h-3 text-purple-500" />}
                  {order.paymentMethod}
                </span>
                <span className={`admin-badge ${psc(order.paymentStatus)}`}>{order.paymentStatus.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-[11px]">
              <span className="font-medium text-gray-700">{order.customer?.name}</span>
              <span className="text-gray-400 mx-1.5">·</span>
              <span className="text-gray-400">{order.items?.map(i => `${i.quantity}× ${i.name}`).join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <button onClick={() => setPage(p => p + 1)} className="admin-btn admin-btn-outline">Load Older Orders</button>
        </div>
      )}
      {orders.length === 0 && !loading && (
        <div className="text-center py-12 admin-card"><p className="text-xs text-gray-400">No completed orders found.</p></div>
      )}
    </div>
  );
};

export default History;
