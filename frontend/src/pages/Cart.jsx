import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { offerAPI } from '../services/api';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, discountAmount, total, discount, applyDiscount, removeDiscount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error('Please enter a coupon code'); return; }
    setApplyingCoupon(true);
    try {
      const response = await offerAPI.validate(couponCode, subtotal);
      applyDiscount(response.data.data);
      setCouponCode('');
    } catch (error) { toast.error(error.response?.data?.message || 'Invalid coupon code'); }
    finally { setApplyingCoupon(false); }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm mx-auto text-center py-16">
            <div className="w-16 h-16 bg-chocolate-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-8 h-8 text-chocolate-400" />
            </div>
            <h2 className="text-xl font-display font-bold text-chocolate-800 mb-2">Your Cart is Empty</h2>
            <p className="text-chocolate-500 mb-6 text-sm font-light">Add some delicious treats from our menu!</p>
            <Link to="/menu" className="inline-flex items-center gap-2 bg-chocolate-900 text-cream-50 px-5 py-2.5 rounded-full font-medium text-sm hover:bg-chocolate-800 transition-all">
              <span>Explore Menu</span><ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-xl md:text-2xl font-display font-bold text-chocolate-800 mb-0.5">Your Cart</h1>
          <p className="text-chocolate-500 text-xs">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item, index) => (
              <motion.div key={item._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-cream-200/50">
                <div className="flex gap-3">
                  <img src={item.image?.startsWith('http') ? item.image : `${API_URL}/uploads/${item.image}`} alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80'; }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-sm text-chocolate-800 leading-tight">{item.name}</h3>
                        <p className="text-chocolate-400 text-[10px] capitalize mt-0.5">{item.category?.replace('_', ' ')}</p>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="p-1.5 text-chocolate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-0.5 bg-cream-100 rounded-full p-0.5">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-chocolate-50 transition-colors shadow-sm">
                          <Minus className="w-3 h-3 text-chocolate-600" />
                        </button>
                        <span className="font-semibold text-chocolate-800 w-7 text-center text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-chocolate-50 transition-colors shadow-sm">
                          <Plus className="w-3 h-3 text-chocolate-600" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-chocolate-800">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <Link to="/menu" className="flex items-center gap-1.5 text-chocolate-500 hover:text-chocolate-700 transition-colors mt-2 text-xs font-medium">
              <ArrowRight className="w-3 h-3 rotate-180" /><span>Continue Shopping</span>
            </Link>
          </div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-chocolate-950 rounded-xl p-5 sticky top-24 text-cream-50">
              <h2 className="text-sm font-bold text-cream-50 mb-4 uppercase tracking-wider">Order Summary</h2>
              {/* Coupon */}
              <div className="mb-4">
                {discount ? (
                  <div className="flex items-center justify-between bg-emerald-500/15 text-emerald-400 px-3 py-2 rounded-lg border border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      <div><span className="font-medium block">{discount.code}</span><span className="text-[10px] text-emerald-300">Applied</span></div>
                    </div>
                    <button onClick={removeDiscount} className="p-1 text-rose-400 hover:text-rose-300 rounded transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-cream-500" />
                      <input type="text" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/10 border border-white/10 text-cream-50 placeholder-cream-500 focus:border-gold-500 focus:outline-none transition-all text-xs" />
                    </div>
                    <button onClick={handleApplyCoupon} disabled={applyingCoupon}
                      className="px-3 py-2 bg-gold-500 text-chocolate-900 rounded-lg font-bold text-xs hover:bg-gold-400 disabled:opacity-50 transition-all">
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs">
                <div className="flex justify-between text-cream-300"><span>Subtotal</span><span>₹{subtotal}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-₹{discountAmount}</span></div>}
                <div className="flex justify-between text-cream-300"><span>Delivery</span><span className="text-emerald-400 font-medium">Free</span></div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-lg font-display font-bold"><span className="text-cream-50">Total</span><span className="text-gold-400">₹{total}</span></div>
                </div>
              </div>
              <Link to="/checkout" className="w-full mt-5 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-chocolate-950 py-2.5 rounded-lg font-bold text-sm transition-all">
                <span>Checkout</span><ArrowRight className="w-4 h-4" />
              </Link>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-3 text-cream-500 text-[10px]">
                <span>Secure</span><span>Quality</span><span>Fresh</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
