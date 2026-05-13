import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, MapPin, Phone, Clock, Sparkles, ChevronLeft, ChevronRight, Award, Heart } from 'lucide-react';
import { menuAPI, settingsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [specials, setSpecials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, settingsRes] = await Promise.all([
        menuAPI.getAll({ available: true }),
        settingsAPI.get(),
      ]);
      
      const items = menuRes.data.data;
      setBestSellers(items.filter(item => item.isBestSeller).slice(0, 4));
      setSpecials(items.filter(item => item.isSpecial).slice(0, 3));
      setSettings(settingsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    {
      name: 'Priya Sharma',
      text: 'An exquisite experience! The Belgian chocolate waffle is simply divine. Every visit feels like a celebration.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      title: 'Food Enthusiast',
    },
    {
      name: 'Rahul Mehta',
      text: 'The attention to detail is remarkable. Their desserts are not just food, they are edible art pieces.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      title: 'Regular Customer',
    },
    {
      name: 'Ananya Patel',
      text: 'Finally, a place that understands true indulgence. The red velvet cheesecake changed my life!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
      title: 'Dessert Connoisseur',
    },
  ];

  const categories = [
    { name: 'Waffles', icon: '🧇', desc: 'Belgian Style', id: 'waffles', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80' },
    { name: 'Brownies', icon: '🍫', desc: 'Rich & Fudgy', id: 'brownies', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80' },
    { name: 'Croissants', icon: '🥐', desc: 'Buttery Layers', id: 'croissants', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' },
    { name: 'Popsicles', icon: '🍦', desc: 'Artisanal Ice', id: 'popsicles', image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80' },
    { name: 'Cheesecakes', icon: '🍰', desc: 'Creamy Bliss', id: 'cheesecakes', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&q=80' },
    { name: 'Savory', icon: '🥪', desc: 'Perfect Bites', id: 'savory', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80' },
  ];

  const stats = [
    { value: '5+', label: 'Years of Excellence' },
    { value: '50+', label: 'Artisan Recipes' },
    { value: '10K+', label: 'Happy Customers' },
    { value: '100%', label: 'Fresh Daily' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Premium Luxury */}
      <section className="relative min-h-screen flex items-center bg-cream-50 texture-noise overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-glow w-[600px] h-[600px] -top-40 -right-40"></div>
          <div className="hero-glow w-[400px] h-[400px] bottom-20 left-10"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-500 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-gold-400 rounded-full animate-float animation-delay-200"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-gold-500 rounded-full animate-float animation-delay-400"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Tagline Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="section-label">
                  <Sparkles className="w-4 h-4" />
                  Premium Artisan Desserts
                </span>
              </motion.div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-chocolate-900 leading-[1.1] tracking-tight">
                  Love at
                  <br />
                  <span className="gradient-text-gold">First Bite</span>
                </h1>
                
                <p className="text-xl text-chocolate-500 max-w-lg leading-relaxed font-light">
                  Discover the art of indulgence with our handcrafted desserts, 
                  where every creation tells a story of passion and perfection.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/menu" className="btn-gold flex items-center gap-3">
                  <span>Explore Menu</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/menu" className="btn-secondary">
                  View Specials
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-8 pt-6">
                <div className="flex -space-x-4">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
                  ].map((src, i) => (
                    <motion.img
                      key={i}
                      src={src}
                      alt="Customer"
                      className="w-12 h-12 rounded-full border-3 border-cream-50 object-cover shadow-soft"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    />
                  ))}
                  <motion.div
                    className="w-12 h-12 rounded-full bg-chocolate-800 border-3 border-cream-50 flex items-center justify-center text-cream-50 text-sm font-semibold shadow-soft"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    +2K
                  </motion.div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                    ))}
                    <span className="ml-2 font-semibold text-chocolate-800">4.9</span>
                  </div>
                  <p className="text-sm text-chocolate-500 mt-1">Loved by thousands</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Image Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative lg:pl-12"
            >
              {/* Main Image */}
              <div className="relative z-10">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-luxury">
                  <img
                    src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80"
                    alt="Premium Chocolate Dessert"
                    className="w-full h-[550px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/40 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -right-4 top-8 glass rounded-2xl p-4 shadow-elevated"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-chocolate-500 font-medium">Award Winning</p>
                      <p className="font-display font-semibold text-chocolate-800">Best Desserts 2024</p>
                    </div>
                  </div>
                </motion.div>

                {/* Delivery Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -left-6 bottom-12 glass rounded-2xl p-5 shadow-elevated"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-chocolate-500">Fast Delivery</p>
                      <p className="text-xl font-display font-bold text-chocolate-800">30-45 min</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Background Shape */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-radial from-gold-400/10 via-cream-200/30 to-transparent"></div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chocolate-200 to-transparent"></div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-chocolate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1200&q=30')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-gold-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-cream-300 text-sm tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Premium Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="section-label">Our Collection</span>
            <h2 className="section-title">Explore Categories</h2>
            <p className="section-subtitle">
              From classic Belgian waffles to artisanal popsicles, discover your perfect indulgence
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link
                  to={`/menu?category=${cat.id}`}
                  className="group block relative h-64 md:h-72 rounded-3xl overflow-hidden"
                >
                  {/* Background Image */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/80 via-chocolate-950/30 to-transparent transition-opacity duration-300"></div>
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-110 inline-block">
                      {cat.icon}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-cream-300 text-sm">{cat.desc}</p>
                    <div className="flex items-center gap-2 mt-3 text-gold-400 text-sm font-medium opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers - Elegant Grid */}
      <section className="py-24 bg-gradient-to-b from-cream-100 to-cream-50 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="section-label">
              <Heart className="w-4 h-4" />
              Customer Favorites
            </span>
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">
              Our most beloved creations, perfected over time and cherished by our guests
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group"
              >
                <div className="card-luxury h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image?.startsWith('http') ? item.image : `${API_URL}/uploads/${item.image}`}
                      alt={item.name}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="badge-gold">Best Seller</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(item);
                      }}
                      className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-card flex items-center justify-center opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-gold-500 hover:text-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                      ))}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-chocolate-800 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-chocolate-500 text-sm line-clamp-2 flex-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-chocolate-100">
                      <span className="text-2xl font-display font-bold text-chocolate-800">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="px-5 py-2.5 bg-chocolate-800 text-cream-50 rounded-full text-sm font-medium hover:bg-chocolate-900 transition-all duration-300 hover:shadow-card"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/menu" className="btn-outline inline-flex items-center gap-2">
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Today's Specials - Dark Elegant Section */}
      {specials.length > 0 && (
        <section className="py-24 bg-chocolate-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1200&q=30')] bg-cover bg-center"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium tracking-wider uppercase mb-6 bg-gold-500/20 text-gold-400">
                <Sparkles className="w-4 h-4" />
                Limited Time
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-cream-50 mb-6">
                Today's Specials
              </h2>
              <p className="text-cream-300 max-w-2xl mx-auto text-lg">
                Exclusive creations available for a limited time. Don't miss these extraordinary flavors.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {specials.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-gold-500/30 transition-all duration-500 hover:shadow-gold">
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image?.startsWith('http') ? item.image : `${API_URL}/uploads/${item.image}`}
                        alt={item.name}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/60 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <span className="badge-gold">Special</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold text-cream-50 mb-2">{item.name}</h3>
                      <p className="text-cream-400 text-sm line-clamp-2 mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-display font-bold text-gold-400">
                          ₹{item.price}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-5 py-2.5 bg-gold-500 text-chocolate-900 rounded-full text-sm font-semibold hover:bg-gold-400 transition-all duration-300"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials - Premium Carousel */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-chocolate-300/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="section-label">Testimonials</span>
            <h2 className="section-title">What Our Guests Say</h2>
            <p className="section-subtitle">
              Don't just take our word for it — hear from our beloved community
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-8">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-cream-200 shadow-elevated"
                  />
                </div>
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <blockquote className="text-2xl md:text-3xl font-display text-chocolate-700 italic mb-8 leading-relaxed">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>
                <div>
                  <p className="font-semibold text-chocolate-800 text-lg">{testimonials[activeTestimonial].name}</p>
                  <p className="text-chocolate-500">{testimonials[activeTestimonial].title}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-gold-500 w-8' 
                      : 'bg-chocolate-200 hover:bg-chocolate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-24 bg-cream-100 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2.5rem] overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1200&q=80"
                alt="Desserts"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-chocolate-950/95 via-chocolate-900/90 to-chocolate-950/80"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-12 md:p-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium tracking-wider uppercase mb-6 bg-gold-500/20 text-gold-400">
                  <Sparkles className="w-4 h-4" />
                  Order Now
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-cream-50 mb-6">
                  Ready to Indulge?
                </h2>
                <p className="text-cream-300 text-lg mb-10 max-w-2xl mx-auto">
                  Experience the finest desserts delivered fresh to your doorstep. 
                  Your sweet journey awaits.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/menu"
                    className="btn-gold flex items-center gap-3"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href={`tel:${settings?.phone || '+919000000000'}`}
                    className="btn bg-white/10 text-cream-50 border border-white/20 hover:bg-white/20"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location Bar */}
      <section className="py-12 bg-chocolate-950 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <p className="text-cream-400 text-sm">Visit Us</p>
                <p className="text-cream-100 font-medium">Swathi Road, Bhavanipuram, Opp Sri Balaji Sweets</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold-400" />
                <span className="text-cream-200">Open: 11:00 AM - 10:00 PM</span>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white/10 text-cream-50 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
