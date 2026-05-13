import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { offerAPI } from '../services/api';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    total,
    discount,
    applyDiscount,
    removeDiscount,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setApplyingCoupon(true);
    try {
      const response = await offerAPI.validate(couponCode, subtotal);
      applyDiscount(response.data.data);
      setCouponCode('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-20"
          >
            <div className="w-28 h-28 bg-gradient-to-br from-chocolate-100 to-cream-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-soft">
              <ShoppingBag className="w-14 h-14 text-chocolate-400" />
            </div>
            <h2 className="text-3xl font-display font-bold text-chocolate-800 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-chocolate-500 mb-10 text-lg">
              Looks like you haven't added any delicious treats yet!
            </p>
            <Link to="/menu" className="btn-gold inline-flex items-center gap-2">
              <span>Explore Menu</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-chocolate-800 mb-2">
            Your Cart
          </h1>
          <p className="text-chocolate-500">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-luxury p-5"
              >
                <div className="flex gap-5">
                  <div className="relative">
                    <img
                      src={item.image?.startsWith('http') ? item.image : `${API_URL}/uploads/${item.image}`}
                      alt={item.name}
                      className="w-28 h-28 rounded-2xl object-cover shadow-soft"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80`;
                      }}
                    />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-chocolate-800 text-cream-50 rounded-full flex items-center justify-center text-xs font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-chocolate-800">
                          {item.name}
                        </h3>
                        <p className="text-chocolate-400 text-sm capitalize mt-1">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2.5 text-chocolate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-chocolate-100 transition-colors shadow-sm"
                        >
                          <Minus className="w-4 h-4 text-chocolate-600" />
                        </button>
                        <span className="font-semibold text-chocolate-800 w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-chocolate-100 transition-colors shadow-sm"
                        >
                          <Plus className="w-4 h-4 text-chocolate-600" />
                        </button>
                      </div>
                      
                      <span className="text-xl font-display font-bold text-chocolate-800">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Continue Shopping Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/menu"
                className="flex items-center gap-2 text-chocolate-500 hover:text-chocolate-700 transition-colors mt-4"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Continue Shopping</span>
              </Link>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card-dark p-6 sticky top-28">
              <h2 className="text-xl font-display font-bold text-cream-50 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                Order Summary
              </h2>

              {/* Coupon Code */}
              <div className="mb-6">
                {discount ? (
                  <div className="flex items-center justify-between bg-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      <div>
                        <span className="font-medium block">{discount.code}</span>
                        <span className="text-xs text-emerald-300">Applied successfully!</span>
                      </div>
                    </div>
                    <button
                      onClick={removeDiscount}
                      className="p-2 text-rose-400 hover:text-rose-300 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                      <input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-cream-50 placeholder-cream-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon}
                      className="px-5 py-3 bg-gold-500 text-chocolate-900 rounded-xl font-semibold hover:bg-gold-400 disabled:opacity-50 transition-all"
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-cream-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-cream-300">
                  <span>Delivery</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-2xl font-display font-bold text-cream-50">
                    <span>Total</span>
                    <span className="text-gold-400">₹{total}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-gold w-full mt-8 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-center gap-4 text-cream-400 text-xs">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Quality</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
