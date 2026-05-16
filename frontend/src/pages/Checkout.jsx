import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, CreditCard, Banknote, Smartphone, ArrowLeft, Loader2, Mail, FileText, Shield, CheckCircle, Hash } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { requestNotificationPermission } from '../firebase';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, total, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', paymentMethod: 'upi', notes: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQRData] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter valid 10-digit number';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { toast.error('Please fill required fields'); return; }
    if (cartItems.length === 0) { toast.error('Cart is empty'); navigate('/menu'); return; }
    setLoading(true);
    try {
      // Request notification permission and get FCM token (non-blocking)
      let fcmToken = null;
      try {
        fcmToken = await requestNotificationPermission();
      } catch (fcmErr) {
        // Notification permission denied or not supported — proceed without it
      }

      const orderData = {
        customer: { name: formData.name, phone: formData.phone, email: formData.email || undefined },
        items: cartItems.map((item) => ({ menuItem: item._id, quantity: item.quantity })),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || undefined,
        fcmToken,
      };
      const response = await orderAPI.create(orderData);
      const order = response.data.data;
      const paymentQR = response.data.paymentQR;
      if (paymentQR) {
        setQRData(paymentQR); setCurrentOrder(order); setShowQR(true);
      } else {
        clearCart(); toast.success('Order placed!'); navigate(`/order-success/${order.orderNumber}`);
      }
    } catch (error) {
      console.error('Order failed:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI Payment', icon: Smartphone, desc: 'Scan QR & Pay' },
    { id: 'cash', name: 'Cash', icon: Banknote, desc: 'Pay at Counter' },
  ];

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate('/cart')}
          className="flex items-center gap-1.5 text-chocolate-500 hover:text-chocolate-700 mb-5 transition-colors text-xs font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Cart</span>
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-xl md:text-2xl font-display font-bold text-chocolate-800 mb-0.5">Checkout</h1>
          <p className="text-chocolate-500 text-xs">Complete your order details</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-4">
              {/* Contact */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-200/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-gold-500/15 rounded-lg flex items-center justify-center"><User className="w-3.5 h-3.5 text-gold-600" /></div>
                  <h2 className="text-sm font-bold text-chocolate-800">Contact Information</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-chocolate-600 mb-1">Full Name <span className="text-rose-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe"
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-cream-50/50 text-chocolate-800 placeholder-chocolate-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 transition-all ${errors.name ? 'border-rose-400' : 'border-chocolate-200/60'}`} />
                    {errors.name && <p className="text-rose-500 text-[10px] mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-chocolate-600 mb-1">Phone <span className="text-rose-500">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210"
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-cream-50/50 text-chocolate-800 placeholder-chocolate-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 transition-all ${errors.phone ? 'border-rose-400' : 'border-chocolate-200/60'}`} />
                    {errors.phone && <p className="text-rose-500 text-[10px] mt-1">{errors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-chocolate-600 mb-1">Email <span className="text-chocolate-400 text-[10px]">(Optional)</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com"
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-cream-50/50 text-chocolate-800 placeholder-chocolate-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 transition-all ${errors.email ? 'border-rose-400' : 'border-chocolate-200/60'}`} />
                    {errors.email && <p className="text-rose-500 text-[10px] mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-200/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-gold-500/15 rounded-lg flex items-center justify-center"><CreditCard className="w-3.5 h-3.5 text-gold-600" /></div>
                  <h2 className="text-sm font-bold text-chocolate-800">Payment Method</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button key={method.id} type="button" onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method.id }))}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${formData.paymentMethod === method.id ? 'border-gold-500 bg-gold-50/50 shadow-sm' : 'border-chocolate-100 hover:border-chocolate-200 bg-white'}`}>
                      <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center ${formData.paymentMethod === method.id ? 'bg-gold-500 text-white' : 'bg-chocolate-100 text-chocolate-500'}`}>
                        <method.icon className="w-4 h-4" />
                      </div>
                      <h3 className={`font-semibold text-xs mb-0.5 ${formData.paymentMethod === method.id ? 'text-chocolate-800' : 'text-chocolate-600'}`}>{method.name}</h3>
                      <p className="text-[10px] text-chocolate-400">{method.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-gold-500/15 rounded-lg flex items-center justify-center"><FileText className="w-3.5 h-3.5 text-gold-600" /></div>
                  <div><h2 className="text-sm font-bold text-chocolate-800">Special Instructions</h2><p className="text-[10px] text-chocolate-400">Optional</p></div>
                </div>
                <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any special requests?" rows={2}
                  className="w-full px-3 py-2.5 rounded-lg border border-chocolate-200/60 text-sm bg-cream-50/50 text-chocolate-800 placeholder-chocolate-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 transition-all resize-none" />
              </div>
            </motion.div>

            {/* Summary */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="bg-chocolate-950 rounded-xl p-5 sticky top-24 text-cream-50">
                <h2 className="text-sm font-bold text-cream-50 mb-4 uppercase tracking-wider">Order Summary</h2>
                <div className="space-y-2 max-h-40 overflow-y-auto mb-4 pr-1 scrollbar-hide">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[9px] text-cream-300">{item.quantity}</span>
                        <span className="text-cream-300 truncate max-w-[140px]">{item.name}</span>
                      </div>
                      <span className="font-medium text-cream-100">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-white/10 pt-3 text-xs">
                  <div className="flex justify-between text-cream-300"><span>Subtotal</span><span>₹{subtotal}</span></div>
                  <div className="flex justify-between text-cream-300"><span>Counter Pickup</span><span className="text-emerald-400 font-medium">Free</span></div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-lg font-display font-bold"><span className="text-cream-50">Total</span><span className="text-gold-400">₹{total}</span></div>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full mt-5 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-chocolate-950 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-60">
                  {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Placing...</span></>) : (<><span>Place Order</span><span className="text-chocolate-700 text-xs">₹{total}</span></>)}
                </button>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-cream-500 text-[10px]">
                  <Shield className="w-3 h-3" /><span>Secure checkout</span>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>

      {/* QR Modal — Preserved exactly */}
      <AnimatePresence>
        {showQR && qrData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-chocolate-950/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative z-10">
              {/* Header */}
              <div className="bg-chocolate-950 p-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-chocolate-900 to-black opacity-90"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-500/10 rounded-full border border-gold-500/20 mb-3">
                    <Shield className="w-3 h-3 text-gold-500" />
                    <span className="text-gold-500 text-[9px] font-bold uppercase tracking-[0.15em]">Official Payment</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-1">Scan & Pay</h3>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-cream-400 text-[10px] font-medium uppercase tracking-widest">Awaiting Transaction</p>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-white">
                {/* Bill */}
                <div className="bg-cream-50 rounded-xl p-4 mb-5 border border-chocolate-100/50">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] text-chocolate-400 font-bold uppercase tracking-widest">Token</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-chocolate-900 rounded-md flex items-center justify-center"><Hash className="w-3 h-3 text-gold-400" /></div>
                        <span className="text-2xl font-display font-black text-chocolate-900">{currentOrder?.tokenNumber}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-chocolate-400 font-bold uppercase tracking-widest mb-0.5">Total</p>
                      <p className="text-2xl font-display font-black text-gold-600">₹{qrData.amount}</p>
                    </div>
                  </div>
                </div>
                {/* QR */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-3 rounded-xl shadow-lg border border-chocolate-50 relative">
                    <img src={qrData.qrDataURL} alt="UPI QR" className="w-52 h-52 object-contain rounded-lg" />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-1.5 bg-white shadow-md rounded-full border border-gray-100">
                      <img src="https://img.icons8.com/color/48/phone-pe.png" className="w-4 h-4 opacity-80" alt="PhonePe" />
                      <img src="https://img.icons8.com/color/48/google-pay-india.png" className="w-4 h-4 opacity-80" alt="GPay" />
                      <img src="https://img.icons8.com/color/48/paytm.png" className="w-4 h-4 opacity-80" alt="Paytm" />
                    </div>
                  </div>
                </div>
                {/* Merchant */}
                <div className="text-center mb-5">
                  <p className="text-[9px] text-chocolate-400 font-bold uppercase tracking-[0.15em] mb-2">Merchant</p>
                  <h4 className="text-base font-display font-bold text-chocolate-900 flex items-center justify-center gap-1">
                    Dear Desserts <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <p className="font-mono text-[11px] font-bold text-chocolate-500 bg-chocolate-50 px-3 py-1 rounded-full border border-chocolate-100 inline-block mt-1">
                    {qrData.payeeUPI || 'Q240470832@ybl'}
                  </p>
                </div>
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2 mb-5">
                  <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Smartphone className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-wide">Instant Confirmation</p>
                    <p className="text-[10px] text-emerald-700 leading-relaxed mt-0.5">Open any UPI app and scan to pay ₹{qrData.amount}.</p>
                  </div>
                </div>
                {/* Actions */}
                <div className="space-y-2.5">
                  <button type="button" onClick={() => { clearCart(); toast.success('Order placed!'); navigate(`/order-success/${currentOrder?.orderNumber}`); }}
                    className="w-full py-3.5 bg-chocolate-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all shadow-lg">
                    I Have Paid Successfully
                    <span className="block text-[9px] text-gold-400 font-medium uppercase tracking-wider mt-0.5">Click only after payment</span>
                  </button>
                  <button type="button" onClick={() => setShowQR(false)}
                    className="w-full py-2.5 text-chocolate-400 hover:text-chocolate-600 font-bold text-[10px] transition-colors uppercase tracking-wider">
                    Cancel & Modify Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
