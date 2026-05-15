import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, animate, useInView, useMotionValue } from 'framer-motion';
import { ArrowRight, Star, MapPin, Phone, Clock, Sparkles, Award, Heart } from 'lucide-react';
import { menuAPI, settingsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Premium Animated Counter Component
const AnimatedCounter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      const target = parseFloat(String(value).replace(/[^0-9.]/g, ''));
      const controls = animate(count, target, {
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1],
      });
      return () => controls.stop();
    }
  }, [inView, value, count]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
};

const Home = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [specials, setSpecials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { addToCart } = useCart();
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 250]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 600], [1, 0.95]);

  useEffect(() => {
    fetchData();
  }, []);

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
    { name: 'Specials', icon: '🌟', desc: 'Chef\'s Choice', id: 'specials', image: '/Specials.jpeg' },
    { name: 'Brownies', icon: '🍫', desc: 'Rich & Fudgy', id: 'brownies', image: '/Brownies.jpeg' },
    { name: 'Bubble Waffles', icon: '🧇', desc: 'Hong Kong Style', id: 'bubble_waffles', image: '/Bubble_waffles.jpeg' },
    { name: 'Popsicles', icon: '🍦', desc: 'Artisanal Ice', id: 'popsicles', image: '/Popsicles.jpeg' },
    { name: 'Cakes', icon: '🎂', desc: 'Custom & Classic', id: 'cakes', image: '/Cakes.jpeg' },
    { name: 'Savories', icon: '🥪', desc: 'Perfect Bites', id: 'savories', image: '/Savories.jpeg' },
  ];

  const stats = [
    { value: '5', suffix: '+', label: 'Years of Excellence' },
    { value: '50', suffix: '+', label: 'Artisan Recipes' },
    { value: '10', suffix: 'K+', label: 'Happy Customers' },
    { value: '100', suffix: '%', label: 'Fresh Daily' },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="overflow-hidden bg-cream-50">
      {/* Cinematic Hero Section */}
      <motion.section 
        style={{ opacity: opacityHero, scale: scaleHero }}
        className="relative min-h-screen flex items-center bg-cream-50 overflow-hidden"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        ></div>
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-cream-50/95 via-cream-50/70 to-transparent"></div>
        {/* Premium Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            style={{ y: y1 }}
            className="hero-glow w-[800px] h-[800px] -top-60 -right-40 opacity-40 mix-blend-multiply"
          />
          <motion.div 
            style={{ y: y2 }}
            className="hero-glow w-[500px] h-[500px] bottom-10 -left-20 opacity-30 mix-blend-multiply bg-chocolate-300"
          />
          
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? '#D4A833' : '#7C4A32',
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                opacity: 0.4
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Text content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex"
              >
                <div className="glass px-5 py-2 rounded-full border border-gold-300/30 flex items-center gap-2 shadow-sm bg-white/40">
                  <Sparkles className="w-4 h-4 text-gold-500" />
                  <span className="text-sm font-semibold tracking-wider text-chocolate-800 uppercase">
                    Premium Artisan Desserts
                  </span>
                </div>
              </motion.div>
              
              {/* Staggered Heading Reveal */}
              <motion.h1 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-chocolate-900 leading-[1.05] tracking-tight perspective-1000"
              >
                <div className="overflow-hidden pb-2">
                  <motion.div variants={wordVariants} className="inline-block">Love</motion.div>
                  <span className="inline-block w-4 md:w-6"></span>
                  <motion.div variants={wordVariants} className="inline-block">at</motion.div>
                </div>
                <div className="overflow-hidden pb-4">
                  <motion.div variants={wordVariants} className="inline-block gradient-text-gold pr-2">First</motion.div>
                  <span className="inline-block w-4 md:w-6"></span>
                  <motion.div variants={wordVariants} className="inline-block gradient-text-gold">Bite</motion.div>
                </div>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-xl md:text-2xl text-chocolate-600 max-w-lg leading-relaxed font-light"
              >
                Experience handcrafted desserts made with passion, elegance, and unforgettable flavors. Every bite brings the taste of luxury to the heart of Vijayawada.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-wrap gap-5 pt-4"
              >
                <Link to="/menu" className="btn-gold group flex items-center gap-3 px-8 py-4 text-lg">
                  <span>Explore Menu</span>
                  <motion.div
                    className="bg-white/20 p-1.5 rounded-full"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="w-5 h-5 text-chocolate-900" />
                  </motion.div>
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="flex items-center gap-8 pt-8 mt-4 border-t border-chocolate-200/50"
              >
                <div className="flex -space-x-4">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Customer"
                      className="w-14 h-14 rounded-full border-4 border-cream-50 object-cover shadow-soft"
                    />
                  ))}
                  <div className="w-14 h-14 rounded-full bg-chocolate-900 border-4 border-cream-50 flex items-center justify-center text-gold-400 text-sm font-bold shadow-soft">
                    +10K
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                    ))}
                    <span className="ml-2 text-lg font-bold text-chocolate-900">4.9/5</span>
                  </div>
                  <p className="text-sm font-medium text-chocolate-500 mt-1 uppercase tracking-wide">Rated by Foodies</p>
                </div>
              </motion.div>
            </div>


          </div>
        </div>
      </motion.section>


      {/* Categories - Premium Bento Grid */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="section-label">Masterpieces</span>
            <h2 className="section-title">The Collection</h2>
            <p className="section-subtitle text-xl">
              Curated categories of pure indulgence, crafted to perfection
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <Link
                  to={`/menu?category=${cat.id}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-chocolate-100 shadow-lg group-hover:shadow-2xl transition-all duration-500 mb-6">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Subtle border for definition */}
                    <div className="absolute inset-0 border border-black/5 rounded-[1.5rem] md:rounded-[2.5rem] pointer-events-none"></div>
                  </div>

                  {/* Text Content - Moved Below Image */}
                  <div className="text-center px-2">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-chocolate-900 mb-2 tracking-tight group-hover:text-gold-600 transition-colors duration-300">
                      {cat.name}
                    </h3>
                    <p className="text-chocolate-500/80 text-sm md:text-base font-medium tracking-widest uppercase mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      {cat.desc}
                    </p>
                    <div className="flex justify-center items-center gap-2 text-gold-600 font-bold tracking-[0.2em] uppercase text-xs md:text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stats Bar */}
      <section className="py-16 bg-chocolate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1200&q=30')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gold-400 mb-3 drop-shadow-lg">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-cream-300 text-sm md:text-base font-medium tracking-widest uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Specials - Cinematic Dark Section */}
      {specials.length > 0 && (
        <section id="specials-section" className="py-32 bg-chocolate-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1200&q=30')] bg-cover bg-fixed bg-center"></div>
          </div>
          
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
            >
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-6 bg-gold-500 text-chocolate-950">
                  <Sparkles className="w-4 h-4" />
                  Limited Edition
                </span>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-cream-50">
                  Chef's Specials
                </h2>
              </div>
              <Link to="/menu" className="group flex items-center gap-3 text-gold-400 hover:text-gold-300 font-medium tracking-widest uppercase pb-2 border-b border-gold-400/30 hover:border-gold-400 transition-colors">
                View All <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-10">
              {specials.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  className="group"
                >
                  <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden bg-chocolate-900 border border-white/5 shadow-2xl">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      src={item.image?.startsWith('http') ? item.image : `${API_URL}/uploads/${item.image}`}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-chocolate-950/40 to-transparent"></div>
                    
                    <div className="absolute top-6 right-6">
                      <div className="glass-dark px-4 py-2 rounded-full text-sm font-bold tracking-wider text-gold-400 border-gold-400/30 flex items-center gap-2">
                        <Star className="w-4 h-4 fill-gold-400" /> Signature
                      </div>
                    </div>

                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <h3 className="font-display text-3xl font-bold text-white mb-3">{item.name}</h3>
                      <p className="text-cream-300/80 text-base line-clamp-2 mb-6 font-light">{item.description}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div className="text-3xl font-display font-bold text-gold-400">
                          ₹{item.price}
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-14 h-14 rounded-full bg-gold-500 text-chocolate-950 flex items-center justify-center hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 transform hover:scale-110"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
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

      {/* CTA Section - Cinematic Banner */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {/* Background Parallax Image */}
            <motion.div 
              className="absolute inset-0"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=1600&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                y: useTransform(scrollY, [2000, 4000], [0, 100]) // Simple parallax
              }}
            />
            {/* Premium Dark Glass Overlay */}
            <div className="absolute inset-0 bg-chocolate-950/80 backdrop-blur-[4px] bg-gradient-to-t from-chocolate-950/90 to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10 p-10 md:p-24 text-center flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mb-6 md:mb-8 rotate-3 shadow-xl border border-gold-300/30">
                  <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  Indulge in Every <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500 italic">Sweet Moment</span>
                </h2>
                
                <p className="text-cream-200/90 text-base md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-md">
                  From handcrafted brownies to signature waffles and premium desserts, every creation is made to deliver happiness in every bite. Experience the taste Vijayawada loves.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                  <Link
                    to="/menu"
                    className="group bg-gold-500 hover:bg-gold-400 text-chocolate-950 px-10 py-4 rounded-full font-bold tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/menu"
                    className="px-10 py-4 text-white border border-white/30 bg-white/5 backdrop-blur-md rounded-full font-medium tracking-wider hover:bg-white/15 hover:border-white/50 transition-all duration-300 w-full sm:w-auto"
                  >
                    View Menu
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Location Bar - Kept minimal for transition to real footer */}
      <section className="py-10 bg-chocolate-950 border-t border-white/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-cream-300">
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-gold-400" />
              <span className="font-light tracking-wide">Swathi Road, Bhavanipuram, Opp Sri Balaji Sweets</span>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-5 h-5 text-gold-400" />
              <span className="font-light tracking-wide">Open Daily: 11:00 AM - 10:00 PM</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
