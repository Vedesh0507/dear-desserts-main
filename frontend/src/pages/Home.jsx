import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, animate, useInView, useMotionValue } from 'framer-motion';
import { ArrowRight, Star, MapPin, Clock, Award } from 'lucide-react';
import { menuAPI, settingsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AnimatedCounter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  useEffect(() => {
    if (inView) {
      const target = parseFloat(String(value).replace(/[^0-9.]/g, ''));
      const controls = animate(count, target, { duration: 2.5, ease: [0.22, 1, 0.36, 1] });
      return () => controls.stop();
    }
  }, [inView, value, count]);
  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span><span>{suffix}</span>
    </span>
  );
};

const Home = () => {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { scrollY } = useScroll();
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 500], [1, 0.97]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [menuRes] = await Promise.all([menuAPI.getAll({ available: true }), settingsAPI.get()]);
      setSpecials(menuRes.data.data.filter(item => item.isSpecial).slice(0, 3));
    } catch (error) { console.error('Failed to fetch data:', error); }
    finally { setLoading(false); }
  };

  const categories = [
    { name: 'Specials', desc: "Chef's Choice", id: 'specials', image: '/Specials.jpeg' },
    { name: 'Brownies', desc: 'Rich & Fudgy', id: 'brownies', image: '/Brownies.jpeg' },
    { name: 'Bubble Waffles', desc: 'Hong Kong Style', id: 'bubble_waffles', image: '/Bubble_waffles.jpeg' },
    { name: 'Popsicles', desc: 'Artisanal Ice', id: 'popsicles', image: '/Popsicles.jpeg' },
    { name: 'Cakes', desc: 'Custom & Classic', id: 'cakes', image: '/Cakes.jpeg' },
    { name: 'Savories', desc: 'Perfect Bites', id: 'savories', image: '/Savories.jpeg' },
  ];

  const stats = [
    { value: '5', suffix: '+', label: 'Years' },
    { value: '50', suffix: '+', label: 'Recipes' },
    { value: '10', suffix: 'K+', label: 'Customers' },
    { value: '100', suffix: '%', label: 'Fresh' },
  ];

  return (
    <div className="overflow-hidden bg-cream-50">
      {/* Hero */}
      <motion.section style={{ opacity: opacityHero, scale: scaleHero }} className="relative min-h-[80vh] flex items-center bg-cream-50 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-bg.jpg')" }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-cream-50/95 via-cream-50/70 to-transparent"></div>
        <div className="container mx-auto px-4 pt-24 pb-10 relative z-10">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex mb-4">
              <div className="px-3 py-1 rounded-full border border-gold-300/40 flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                <Award className="w-3 h-3 text-gold-600" />
                <span className="text-[10px] font-semibold tracking-[0.15em] text-chocolate-700 uppercase">Premium Artisan Desserts</span>
              </div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-chocolate-900 leading-[1.1] tracking-tight mb-4">
              Love at <span className="gradient-text-gold italic">First Bite</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
              className="text-sm md:text-base text-chocolate-600 max-w-md leading-relaxed font-light mb-6">
              Handcrafted desserts made with passion and unforgettable flavors. Experience luxury in every bite, right here in Vijayawada.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="flex flex-wrap gap-3">
              <Link to="/menu" className="group inline-flex items-center gap-2 bg-chocolate-900 text-cream-50 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-chocolate-800 transition-all shadow-card">
                <span>Explore Menu</span><ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/about" className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-medium text-chocolate-700 border border-chocolate-200 hover:border-chocolate-400 transition-all bg-white/60">
                Our Story
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-4 mt-8 pt-5 border-t border-chocolate-200/40">
              <div className="flex -space-x-2.5">
                {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80'].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-cream-50 object-cover" />
                ))}
                <div className="w-8 h-8 rounded-full bg-chocolate-900 border-2 border-cream-50 flex items-center justify-center text-gold-400 text-[8px] font-bold">+10K</div>
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold-500 text-gold-500" />)}
                  <span className="ml-1 text-xs font-bold text-chocolate-900">4.9</span>
                </div>
                <p className="text-[9px] text-chocolate-500 mt-0.5 uppercase tracking-wider font-medium">Rated by food lovers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="py-6 bg-chocolate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
                <div className="text-xl md:text-2xl font-display font-bold text-gold-400"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></div>
                <div className="text-cream-400 text-[9px] md:text-[10px] font-medium tracking-[0.15em] uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-600 mb-1.5">Our Collection</p>
            <h2 className="text-xl md:text-2xl font-display font-bold text-chocolate-900">Explore Categories</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Link to={`/menu?category=${cat.id}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-chocolate-100 shadow-sm group-hover:shadow-md transition-all duration-400">
                    <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-chocolate-900/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-display text-sm md:text-base font-bold text-white leading-tight">{cat.name}</h3>
                      <p className="text-cream-200/70 text-[10px] font-medium mt-0.5">{cat.desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specials */}
      {specials.length > 0 && (
        <section className="py-12 md:py-16 bg-chocolate-950 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500 mb-1">Limited Edition</p>
                <h2 className="text-xl md:text-2xl font-display font-bold text-cream-50">Chef's Specials</h2>
              </div>
              <Link to="/menu" className="group flex items-center gap-1 text-gold-400 hover:text-gold-300 text-[10px] font-semibold tracking-wider uppercase">
                View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-4">
              {specials.map((item, i) => (
                <motion.div key={item._id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group">
                  <div className="relative h-[280px] md:h-[320px] rounded-xl overflow-hidden bg-chocolate-900 border border-white/5">
                    <img src={item.image?.startsWith('http') ? item.image : `${API_URL}/uploads/${item.image}`} alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-chocolate-950/30 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <div className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider text-gold-400 bg-black/40 backdrop-blur-sm border border-gold-400/20 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-gold-400" /> Signature
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-display text-base font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-cream-300/70 text-[11px] line-clamp-2 mb-3 font-light">{item.description}</p>
                      <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                        <span className="text-lg font-display font-bold text-gold-400">₹{item.price}</span>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-full bg-gold-500 text-chocolate-950 flex items-center justify-center hover:bg-gold-400 transition-colors shadow-lg active:scale-95">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
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

      {/* CTA */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=1600&q=80')" }} />
            <div className="absolute inset-0 bg-chocolate-950/80"></div>
            <div className="relative z-10 p-7 md:p-12 text-center">
              <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                Indulge in Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500 italic">Sweet Moment</span>
              </h2>
              <p className="text-cream-300/80 text-xs md:text-sm mb-6 max-w-lg mx-auto font-light">
                From handcrafted brownies to signature waffles, every creation delivers happiness.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2.5">
                <Link to="/menu" className="group inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-chocolate-950 px-6 py-2.5 rounded-full font-bold text-sm shadow-gold transition-all">
                  <span>Order Now</span><ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link to="/menu" className="inline-flex items-center justify-center px-6 py-2.5 text-white border border-white/25 rounded-full text-sm font-medium hover:bg-white/10 transition-all">
                  View Menu
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location Strip */}
      <section className="py-4 bg-chocolate-950 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-cream-400 text-[11px]">
            <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gold-500" /><span>Swathi Road, Bhavanipuram</span></div>
            <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-gold-500" /><span>Open Daily: 6:00 PM onwards</span></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
