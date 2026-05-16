import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, ChefHat, CheckCircle, Search, ArrowLeft, RefreshCw, Hash, Banknote, Smartphone } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';

const TrackOrder = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(orderNumber || '');
  const { socket } = useSocket();

  useEffect(() => { if (orderNumber) fetchOrder(orderNumber); else setLoading(false); }, [orderNumber]);

  useEffect(() => {
    if (socket && order) {
      socket.on('orderUpdated', (u) => { if (u.orderNumber === order.orderNumber) setOrder(u); });
      return () => socket.off('orderUpdated');
    }
  }, [socket, order]);

  const fetchOrder = async (number) => {
    setLoading(true); setError(null);
    try { const r = await orderAPI.track(number); setOrder(r.data.data); }
    catch (err) { setError(err.response?.data?.message || 'Order not found'); setOrder(null); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) fetchOrder(searchQuery.trim()); };

  const statusSteps = [
    { status: 'new', label: 'Order Placed', icon: Package },
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'ready', label: 'Ready', icon: Clock },
    { status: 'completed', label: 'Collected', icon: CheckCircle },
  ];

  const getStatusIndex = (status) => { if (status === 'cancelled') return -1; return statusSteps.findIndex((s) => s.status === status); };

  return (
    <div className="min-h-screen bg-cream-50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-chocolate-500 hover:text-chocolate-700 mb-4 text-xs font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /><span>Back</span>
          </Link>

          <h1 className="text-xl font-display font-bold text-chocolate-800 mb-5">Track Your Order</h1>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" />
              <input type="text" placeholder="Enter order number" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                className="w-full pl-9 pr-20 py-2.5 rounded-lg border border-chocolate-200/60 bg-white text-sm text-chocolate-800 placeholder-chocolate-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 transition-all" />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-chocolate-800 text-white rounded-md font-medium text-xs hover:bg-chocolate-700 transition-colors">
                Track
              </button>
            </div>
          </form>

          {loading && (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chocolate-600"></div></div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-6 shadow-sm text-center border border-cream-200/50">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><Package className="w-6 h-6 text-red-500" /></div>
              <h3 className="text-base font-semibold text-chocolate-700 mb-1">Order Not Found</h3>
              <p className="text-chocolate-500 text-xs">{error}</p>
            </motion.div>
          )}

          {order && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Order Info */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-200/50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-chocolate-500 text-[10px] font-medium flex items-center gap-1 mb-0.5 uppercase tracking-wider">
                      <Hash className="w-3 h-3 text-gold-500" /> Token
                    </p>
                    <p className="text-3xl font-display font-bold text-chocolate-800">{order.tokenNumber}</p>
                    <p className="text-chocolate-400 text-[10px] font-mono mt-0.5">ID: {order.orderNumber}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>{order.status}</span>
                    <button onClick={() => fetchOrder(order.orderNumber)} disabled={loading}
                      className="text-chocolate-500 hover:text-chocolate-700 hover:bg-chocolate-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1 text-[10px] font-medium">
                      <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-chocolate-100">
                  <div>
                    <p className="text-chocolate-400 text-[10px] uppercase tracking-wider mb-0.5">Total</p>
                    <p className="font-bold text-chocolate-800 text-sm">₹{order.total}</p>
                  </div>
                  <div>
                    <p className="text-chocolate-400 text-[10px] uppercase tracking-wider mb-0.5">Payment</p>
                    <div className="flex items-center gap-1 text-xs font-medium text-chocolate-700 capitalize">
                      {order.paymentMethod === 'cash' ? <Banknote className="w-3 h-3 text-gold-600" /> : <Smartphone className="w-3 h-3 text-gold-600" />}
                      {order.paymentMethod}
                    </div>
                    <span className={`text-[9px] inline-block px-1.5 py-0.5 rounded-full mt-1 capitalize ${
                      ['paid','online_verified','cash_received'].includes(order.paymentStatus) ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{order.paymentStatus.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              {order.status !== 'cancelled' && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-200/50">
                  <h3 className="font-semibold text-chocolate-700 text-sm mb-4">Order Status</h3>
                  <div className="relative">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getStatusIndex(order.status);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      return (
                        <div key={step.status} className="flex items-start mb-5 last:mb-0">
                          <div className="relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'bg-chocolate-100 text-chocolate-400'} ${isCurrent ? 'ring-2 ring-green-200' : ''}`}>
                              <step.icon className="w-4 h-4" />
                            </div>
                            {index < statusSteps.length - 1 && (
                              <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-5 ${index < currentIndex ? 'bg-green-500' : 'bg-chocolate-200'}`} />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className={`font-medium text-xs ${isCompleted ? 'text-chocolate-700' : 'text-chocolate-400'}`}>{step.label}</p>
                            {order.statusHistory?.find((h) => h.status === step.status) && (
                              <p className="text-[10px] text-chocolate-400">{new Date(order.statusHistory.find((h) => h.status === step.status).timestamp).toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-200/50">
                <h3 className="font-semibold text-chocolate-700 text-sm mb-3">Order Items</h3>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-chocolate-600">{item.name} x {item.quantity}</span>
                      <span className="font-medium text-chocolate-700">₹{item.subtotal}</span>
                    </div>
                  ))}
                  <div className="border-t border-chocolate-100 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-sm text-chocolate-700"><span>Total</span><span>₹{order.total}</span></div>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-200/50">
                <h3 className="font-semibold text-chocolate-700 text-sm mb-2">Customer</h3>
                <p className="text-chocolate-600 text-xs">{order.customer?.name}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TrackOrder;
