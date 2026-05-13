import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar,
  ChevronDown,
  Hash,
  Banknote,
  Smartphone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      const response = await orderAPI.getAll({ 
        status: 'completed', 
        limit: 20, 
        page 
      });
      
      const newOrders = response.data.data;
      if (page === 1) {
        setOrders(newOrders);
      } else {
        setOrders(prev => [...prev, ...newOrders]);
      }
      
      setHasMore(response.data.page < response.data.pages);
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(p => p + 1);
  };

  const getPaymentStatusColor = (status) => {
    if (['paid', 'online_verified', 'cash_received'].includes(status)) {
      return 'text-green-700 bg-green-100';
    }
    return 'text-yellow-700 bg-yellow-100';
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-chocolate-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="sticky top-0 bg-gray-50/90 backdrop-blur-md z-10 py-4 -mt-4 border-b mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-800">Order History</h1>
        <p className="text-sm text-gray-500">Chronological digital receipts</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-300"></div>
            
            <div className="pl-2">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-xl text-gray-800">
                    Token #{order.tokenNumber}
                  </span>
                  <span className="text-xs text-gray-400 font-mono mt-0.5">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-chocolate-700 leading-none">
                    ₹{order.total}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Time</p>
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700 capitalize">
                      {order.paymentMethod === 'cash' ? <Banknote className="w-3 h-3 text-blue-500" /> : <Smartphone className="w-3 h-3 text-purple-500" />}
                      {order.paymentMethod}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-2 text-sm text-gray-600 border border-gray-100">
                <p className="font-medium text-gray-800 mb-1">{order.customer?.name}</p>
                <p className="truncate text-xs text-gray-500">
                  {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button 
            onClick={handleLoadMore}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            Load Older Orders
          </button>
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No completed orders found.</p>
        </div>
      )}
    </div>
  );
};

export default History;
