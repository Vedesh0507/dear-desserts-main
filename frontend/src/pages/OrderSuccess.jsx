import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, ArrowRight, Clock, MapPin, Phone, Hash, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderAPI.track(orderNumber);
        setOrder(response.data.data);
      } catch (error) {
        console.error('Failed to fetch order', error);
      } finally {
        setLoading(false);
      }
    };
    if (orderNumber) fetchOrder();
  }, [orderNumber]);

  const getPaymentIcon = (method) => {
    if (method === 'cash') return Banknote;
    if (method === 'upi' || method === 'online') return Smartphone;
    return CreditCard;
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success('Order number copied!');
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-12 flex items-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-display font-bold text-chocolate-800 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-chocolate-500 mb-8 font-medium">
              Please wait near the café. Your token number will be called once your order is ready.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 mb-6"
          >
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chocolate-600"></div>
              </div>
            ) : order ? (
              <>
                <div className="mb-6 pb-6 border-b border-chocolate-100">
                  <p className="text-chocolate-500 mb-2 font-medium flex items-center justify-center gap-2">
                    <Hash className="w-5 h-5 text-gold-500" />
                    Your Token Number
                  </p>
                  <div className="text-6xl font-display font-bold text-chocolate-800">
                    {order.tokenNumber}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-cream-50 p-4 rounded-xl">
                    <p className="text-sm text-chocolate-400 mb-1">Order Total</p>
                    <p className="font-bold text-chocolate-800 text-lg">₹{order.total}</p>
                  </div>
                  <div className="bg-cream-50 p-4 rounded-xl">
                    <p className="text-sm text-chocolate-400 mb-1">Payment</p>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 font-medium text-chocolate-700 capitalize text-sm">
                        {(() => {
                          const PaymentIcon = getPaymentIcon(order.paymentMethod);
                          return <PaymentIcon className="w-4 h-4 text-gold-600" />;
                        })()}
                        {order.paymentMethod}
                      </div>
                      <span className={`text-xs inline-block px-2 py-0.5 rounded-full w-fit capitalize ${
                        order.paymentStatus === 'paid' || order.paymentStatus === 'online_verified' || order.paymentStatus === 'cash_received'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-chocolate-100 flex items-center justify-between">
                  <span className="text-sm text-chocolate-400">Order ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-chocolate-600">{orderNumber}</span>
                    <button
                      onClick={copyOrderNumber}
                      className="p-1.5 hover:bg-chocolate-100 rounded-lg transition-colors"
                      title="Copy Order ID"
                    >
                      <Copy className="w-4 h-4 text-chocolate-500" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-chocolate-500 mb-2">Order Number</p>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl font-bold text-chocolate-700">{orderNumber}</span>
                  <button
                    onClick={copyOrderNumber}
                    className="p-2 hover:bg-chocolate-100 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5 text-chocolate-500" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6 mb-8"
          >
            <h3 className="font-semibold text-chocolate-700 mb-4">What's Next?</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-chocolate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-chocolate-600" />
                </div>
                <div>
                  <p className="font-medium text-chocolate-700">Preparation Time</p>
                  <p className="text-sm text-chocolate-500">Your order will be prepared in 15-30 minutes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-chocolate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-chocolate-600" />
                </div>
                <div>
                  <p className="font-medium text-chocolate-700">Counter Pickup</p>
                  <p className="text-sm text-chocolate-500">Collect your order at the counter when called</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-chocolate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-chocolate-600" />
                </div>
                <div>
                  <p className="font-medium text-chocolate-700">Contact</p>
                  <p className="text-sm text-chocolate-500">We'll call you when your order is ready</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to={`/track/${orderNumber}`}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <span>Track Order</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/menu" className="btn-secondary">
              Order More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
