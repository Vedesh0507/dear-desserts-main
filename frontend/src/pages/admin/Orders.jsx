import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ChefHat,
  Package,
  CheckCircle,
  RefreshCw,
  Hash,
  Smartphone,
  Banknote,
  Play,
  Check,
  CheckSquare
} from 'lucide-react';
import { orderAPI } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newOrder', () => {
        fetchOrders();
        playNotificationSound();
      });

      socket.on('orderUpdated', () => {
        fetchOrders();
      });

      return () => {
        socket.off('newOrder');
        socket.off('orderUpdated');
      };
    }
  }, [socket]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play();
    } catch (e) {}
  };

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getQueue();
      const { active } = response.data.data;
      
      const statusPriority = { new: 1, preparing: 2, ready: 3 };
      const sortedActive = active.sort((a, b) => {
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }
        return a.tokenNumber - b.tokenNumber;
      });

      setActiveOrders(sortedActive);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await orderAPI.updateStatus(id, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
      fetchOrders();
    }
  };

  const handlePaymentUpdate = async (id, paymentStatus) => {
    try {
      await orderAPI.updatePaymentStatus(id, paymentStatus);
      toast.success(`Payment marked as ${paymentStatus.replace('_', ' ')}`);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'new': return { label: 'NEW', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
      case 'preparing': return { label: 'PREP', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
      case 'ready': return { label: 'READY', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' };
      case 'completed': return { label: 'DONE', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' };
      default: return { label: status, bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' };
    }
  };

  const renderOrderCard = (order) => {
    const sc = getStatusConfig(order.status);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        key={order._id}
        className={`admin-card p-3 border-l-[3px] ${
          order.status === 'new' ? 'border-l-blue-500' :
          order.status === 'preparing' ? 'border-l-amber-500' :
          order.status === 'ready' ? 'border-l-green-500' :
          'border-l-gray-300'
        }`}
      >
        {/* Header Row */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-display font-bold text-chocolate-800">
              #{order.tokenNumber}
            </span>
            <span className={`admin-badge ${sc.bg} ${sc.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
              {sc.label}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Customer & Items */}
        <div className="bg-gray-50 rounded-lg p-2 mb-2">
          <p className="font-medium text-gray-700 text-xs mb-1 truncate">{order.customer?.name}</p>
          <div className="space-y-0.5">
            {order.items?.map((item, index) => (
              <div key={index} className="text-[11px] text-gray-500 flex justify-between">
                <span className="truncate pr-2">
                  <span className="font-semibold text-gray-700">{item.quantity}×</span> {item.name}
                </span>
                <span className="font-medium text-gray-600 flex-shrink-0">₹{item.subtotal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Row */}
        <div className="flex items-center justify-between mb-2 text-[11px]">
          <div className="flex items-center gap-1 text-gray-500">
            {order.paymentMethod === 'cash' ? <Banknote className="w-3.5 h-3.5 text-emerald-500" /> : <Smartphone className="w-3.5 h-3.5 text-purple-500" />}
            <span className="capitalize font-medium">{order.paymentMethod}</span>
          </div>
          <span className={`admin-badge ${
            ['paid', 'online_verified', 'cash_received'].includes(order.paymentStatus)
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}>
            {order.paymentStatus?.replace('_', ' ')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-1.5">
          {order.status === 'new' && (
            <button
              onClick={() => handleStatusUpdate(order._id, 'preparing')}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors text-xs"
            >
              <ChefHat className="w-3.5 h-3.5" /> Start Preparing
            </button>
          )}
          {order.status === 'preparing' && (
            <button
              onClick={() => handleStatusUpdate(order._id, 'ready')}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors text-xs"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Mark Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button
              onClick={() => handleStatusUpdate(order._id, 'completed')}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors text-xs"
            >
              <CheckSquare className="w-3.5 h-3.5" /> Complete
            </button>
          )}

          {/* Payment Verification */}
          {order.paymentStatus === 'pending' && (
            <div className="flex gap-1.5 pt-1 border-t border-gray-100">
              {order.paymentMethod !== 'cash' && (
                <button
                  onClick={() => handlePaymentUpdate(order._id, 'online_verified')}
                  className="flex-1 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[10px] font-semibold hover:bg-green-100 transition-colors"
                >
                  Verify Online
                </button>
              )}
              <button
                onClick={() => handlePaymentUpdate(order._id, 'cash_received')}
                className="flex-1 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-semibold hover:bg-blue-100 transition-colors"
              >
                Cash Received
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chocolate-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#f8f6f3]/90 backdrop-blur-md z-10 py-3 -mt-3 border-b border-gray-200/50">
        <div>
          <h1 className="admin-page-title font-display">Live Kitchen Queue</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Manage active tokens & payments</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="admin-badge bg-chocolate-100 text-chocolate-700">
            {activeOrders.length} active
          </span>
          <button
            onClick={fetchOrders}
            className="p-2 bg-white text-chocolate-600 hover:bg-chocolate-50 rounded-lg border border-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {activeOrders.length === 0 ? (
        <div className="text-center py-16 admin-card">
          <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
          <p className="text-xs text-gray-400 font-medium">No active orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {activeOrders.map(order => renderOrderCard(order))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Orders;
