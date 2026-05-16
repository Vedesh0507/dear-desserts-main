import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, ArrowRight, Clock, MapPin, Phone, Hash, Banknote, Smartphone } from 'lucide-react';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try { const response = await orderAPI.track(orderNumber); setOrder(response.data.data); }
      catch (error) { console.error('Failed to fetch order', error); }
      finally { setLoading(false); }
    };
    if (orderNumber) fetchOrder();
  }, [orderNumber]);

  const copyOrderNumber = () => { navigator.clipboard.writeText(orderNumber); toast.success('Copied!'); };

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-12 flex items-start justify-center">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-xl font-display font-bold text-chocolate-800 mb-1">Order Placed Successfully</h1>
            <p className="text-chocolate-500 text-xs mb-5">Please wait near the cafe. Your token will be called when ready.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-cream-200/50 mb-4">
            {loading ? (
              <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-chocolate-600"></div></div>
            ) : order ? (
              <>
                <div className="mb-4 pb-4 border-b border-chocolate-100">
                  <p className="text-chocolate-500 text-[10px] font-medium flex items-center justify-center gap-1 mb-1 uppercase tracking-wider">
                    <Hash className="w-3 h-3 text-gold-500" /> Your Token
                  </p>
                  <div className="text-4xl font-display font-bold text-chocolate-800">{order.tokenNumber}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="bg-cream-50 p-3 rounded-lg">
                    <p className="text-[10px] text-chocolate-400 mb-0.5 uppercase tracking-wider">Total</p>
                    <p className="font-bold text-chocolate-800 text-sm">₹{order.total}</p>
                  </div>
                  <div className="bg-cream-50 p-3 rounded-lg">
                    <p className="text-[10px] text-chocolate-400 mb-0.5 uppercase tracking-wider">Payment</p>
                    <div className="flex items-center gap-1 font-medium text-chocolate-700 capitalize text-xs">
                      {order.paymentMethod === 'cash' ? <Banknote className="w-3 h-3 text-gold-600" /> : <Smartphone className="w-3 h-3 text-gold-600" />}
                      {order.paymentMethod}
                    </div>
                    <span className={`text-[9px] inline-block px-1.5 py-0.5 rounded-full mt-1 capitalize ${
                      ['paid','online_verified','cash_received'].includes(order.paymentStatus) ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{order.paymentStatus.replace('_',' ')}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-chocolate-100 flex items-center justify-between">
                  <span className="text-[10px] text-chocolate-400">Order ID</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-chocolate-600">{orderNumber}</span>
                    <button onClick={copyOrderNumber} className="p-1 hover:bg-chocolate-100 rounded transition-colors"><Copy className="w-3 h-3 text-chocolate-500" /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-3">
                <p className="text-chocolate-500 text-xs mb-1">Order Number</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base font-bold text-chocolate-700">{orderNumber}</span>
                  <button onClick={copyOrderNumber} className="p-1 hover:bg-chocolate-100 rounded"><Copy className="w-3.5 h-3.5 text-chocolate-500" /></button>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-cream-200/50 mb-6">
            <h3 className="font-semibold text-chocolate-700 text-sm mb-3">What's Next?</h3>
            <div className="space-y-3 text-left">
              {[
                { icon: Clock, title: 'Preparation', desc: 'Ready in 15-30 minutes' },
                { icon: MapPin, title: 'Pickup', desc: 'Collect at the counter when called' },
                { icon: Phone, title: 'Contact', desc: "We'll call when your order is ready" },
              ].map((step) => (
                <div key={step.title} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 bg-chocolate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-3.5 h-3.5 text-chocolate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-chocolate-700 text-xs">{step.title}</p>
                    <p className="text-[11px] text-chocolate-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link to={`/track/${orderNumber}`} className="inline-flex items-center justify-center gap-1.5 bg-chocolate-900 text-cream-50 px-5 py-2.5 rounded-full font-medium text-sm hover:bg-chocolate-800 transition-all">
              <span>Track Order</span><ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/menu" className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-chocolate-700 border border-chocolate-200 hover:border-chocolate-400 transition-all">
              Order More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
