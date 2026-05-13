import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, ChefHat, CheckCircle, Search, ArrowLeft, RefreshCw, Hash, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';

const TrackOrder = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(orderNumber || '');
  const { socket } = useSocket();

  useEffect(() => {
    if (orderNumber) {
      fetchOrder(orderNumber);
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    if (socket && order) {
      socket.on('orderUpdated', (updatedOrder) => {
        if (updatedOrder.orderNumber === order.orderNumber) {
          setOrder(updatedOrder);
        }
      });

      return () => {
        socket.off('orderUpdated');
      };
    }
  }, [socket, order]);

  const fetchOrder = async (number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderAPI.track(number);
      setOrder(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchOrder(searchQuery.trim());
    }
  };

  const statusSteps = [
    { status: 'new', label: 'Order Placed', icon: Package },
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'ready', label: 'Ready', icon: Clock },
    { status: 'completed', label: 'Collected', icon: CheckCircle },
  ];

  const getStatusIndex = (status) => {
    if (status === 'cancelled') return -1;
    return statusSteps.findIndex((s) => s.status === status);
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-chocolate-600 hover:text-chocolate-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <h1 className="text-3xl font-display font-bold text-chocolate-800 mb-8">
            Track Your Order
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chocolate-400" />
              <input
                type="text"
                placeholder="Enter your order number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                className="input pl-12 pr-24"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-chocolate-500 text-white rounded-lg font-medium hover:bg-chocolate-600"
              >
                Track
              </button>
            </div>
          </form>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chocolate-600"></div>
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-chocolate-700 mb-2">
                Order Not Found
              </h3>
              <p className="text-chocolate-500">{error}</p>
            </motion.div>
          )}

          {/* Order Details */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Order Info */}
              <div className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-chocolate-500 text-sm font-medium flex items-center gap-1 mb-1">
                      <Hash className="w-4 h-4 text-gold-500" />
                      Token Number
                    </p>
                    <p className="text-4xl font-display font-bold text-chocolate-800 mb-1">
                      {order.tokenNumber}
                    </p>
                    <p className="text-chocolate-400 text-xs font-mono">ID: {order.orderNumber}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`badge ${
                      order.status === 'completed' ? 'badge-success' :
                      order.status === 'cancelled' ? 'badge-danger' :
                      'badge-warning'
                    } capitalize px-3 py-1 text-sm`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => fetchOrder(order.orderNumber)}
                      disabled={loading}
                      className="text-chocolate-500 hover:text-chocolate-700 hover:bg-chocolate-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-chocolate-100">
                  <div>
                    <p className="text-chocolate-400 text-xs uppercase tracking-wider mb-1">Order Total</p>
                    <p className="font-bold text-chocolate-800 text-lg">₹{order.total}</p>
                  </div>
                  <div>
                    <p className="text-chocolate-400 text-xs uppercase tracking-wider mb-1">Payment</p>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm font-medium text-chocolate-700 capitalize">
                        {order.paymentMethod === 'cash' ? <Banknote className="w-4 h-4 text-gold-600" /> : <Smartphone className="w-4 h-4 text-gold-600" />}
                        {order.paymentMethod}
                      </div>
                      <span className={`text-xs inline-block px-2 py-0.5 rounded-full w-fit capitalize ${
                        ['paid', 'online_verified', 'cash_received'].includes(order.paymentStatus)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              {order.status !== 'cancelled' && (
                <div className="card p-6">
                  <h3 className="font-semibold text-chocolate-700 mb-6">Order Status</h3>
                  <div className="relative">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getStatusIndex(order.status);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;

                      return (
                        <div key={step.status} className="flex items-start mb-8 last:mb-0">
                          <div className="relative">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : 'bg-chocolate-100 text-chocolate-400'
                              } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                            >
                              <step.icon className="w-5 h-5" />
                            </div>
                            {index < statusSteps.length - 1 && (
                              <div
                                className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                                  index < currentIndex ? 'bg-green-500' : 'bg-chocolate-200'
                                }`}
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <p className={`font-medium ${
                              isCompleted ? 'text-chocolate-700' : 'text-chocolate-400'
                            }`}>
                              {step.label}
                            </p>
                            {order.statusHistory?.find((h) => h.status === step.status) && (
                              <p className="text-sm text-chocolate-400">
                                {new Date(
                                  order.statusHistory.find((h) => h.status === step.status).timestamp
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="card p-6">
                <h3 className="font-semibold text-chocolate-700 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-chocolate-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium text-chocolate-700">
                        ₹{item.subtotal}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-chocolate-100 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-chocolate-700">
                      <span>Total</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="card p-6">
                <h3 className="font-semibold text-chocolate-700 mb-4">Delivery Details</h3>
                <p className="text-chocolate-600">{order.customer?.name}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TrackOrder;
