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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'new': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">NEW</span>;
      case 'preparing': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">PREPARING</span>;
      case 'ready': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">READY</span>;
      case 'completed': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">COMPLETED</span>;
      default: return null;
    }
  };

  const renderOrderCard = (order, isCompleted = false) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      key={order._id}
      className={`bg-white rounded-2xl shadow-sm border p-4 lg:p-5 transition-shadow hover:shadow-md ${
        order.status === 'new' ? 'border-blue-200 shadow-blue-100/50' :
        order.status === 'preparing' ? 'border-yellow-200 shadow-yellow-100/50' :
        order.status === 'ready' ? 'border-green-200 shadow-green-100/50' :
        'border-gray-100 opacity-80'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center border border-gold-100">
            <Hash className="w-5 h-5 text-gold-600" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-chocolate-800 leading-none">
              {order.tokenNumber}
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-1">ID: {order.orderNumber}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(order.status)}
          <span className="text-xs text-gray-400 font-medium">
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Customer & Items */}
      <div className="mb-4 bg-gray-50 rounded-xl p-3">
        <p className="font-medium text-gray-800 mb-2 truncate text-sm">
          {order.customer?.name}
        </p>
        <ul className="space-y-1">
          {order.items?.map((item, index) => (
            <li key={index} className="text-sm text-gray-600 flex justify-between">
              <span className="truncate pr-2">
                <span className="font-semibold text-gray-800">{item.quantity}x</span> {item.name}
              </span>
              <span className="font-medium">₹{item.subtotal}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Info */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Payment</span>
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 capitalize">
            {order.paymentMethod === 'cash' ? <Banknote className="w-4 h-4 text-blue-500" /> : <Smartphone className="w-4 h-4 text-purple-500" />}
            {order.paymentMethod}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Status</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
            ['paid', 'online_verified', 'cash_received'].includes(order.paymentStatus)
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {order.paymentStatus?.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {!isCompleted && (
        <div className="space-y-3">
          {/* Status Progression */}
          <div className="flex gap-2">
            {order.status === 'new' && (
              <button
                onClick={() => handleStatusUpdate(order._id, 'preparing')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors text-sm"
              >
                <ChefHat className="w-4 h-4" /> Start Preparing
              </button>
            )}
            {order.status === 'preparing' && (
              <button
                onClick={() => handleStatusUpdate(order._id, 'ready')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4" /> Mark Ready
              </button>
            )}
            {order.status === 'ready' && (
              <button
                onClick={() => handleStatusUpdate(order._id, 'completed')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium transition-colors text-sm"
              >
                <CheckSquare className="w-4 h-4" /> Complete Order
              </button>
            )}
          </div>

          {/* Payment Verification */}
          {order.paymentStatus === 'pending' && (
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              {order.paymentMethod !== 'cash' && (
                <button
                  onClick={() => handlePaymentUpdate(order._id, 'online_verified')}
                  className="flex-1 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-medium hover:bg-green-100 transition-colors"
                >
                  Verify Online
                </button>
              )}
              <button
                onClick={() => handlePaymentUpdate(order._id, 'cash_received')}
                className="flex-1 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-medium hover:bg-blue-100 transition-colors"
              >
                Cash Received
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chocolate-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-50/90 backdrop-blur-md z-10 py-4 -mt-4 border-b">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Live Kitchen Queue</h1>
          <p className="text-sm text-gray-500">Manage active tokens & payments</p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2.5 bg-white text-chocolate-600 hover:bg-chocolate-50 rounded-xl shadow-sm border transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-8">
        {/* Active Orders Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Active Queue</h2>
            <span className="px-2.5 py-0.5 bg-chocolate-100 text-chocolate-700 rounded-full text-sm font-bold">
              {activeOrders.length}
            </span>
          </div>

          {activeOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No active orders</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {activeOrders.map(order => renderOrderCard(order, false))}
              </AnimatePresence>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Orders;
