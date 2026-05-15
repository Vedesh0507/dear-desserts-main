import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Star, Sparkles } from 'lucide-react';
import { menuAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const { addToCart } = useCart();

  const categories = [
    { id: 'all', name: 'All Items', icon: '✨' },
    { id: 'cakes', name: 'Cakes', icon: '🎂' },
    { id: 'specials', name: 'Specials', icon: '🌟' },
    { id: 'brownies', name: 'Brownies', icon: '🍫' },
    { id: 'savories', name: 'Savories', icon: '🥪' },
    { id: 'bubble_waffles', name: 'Bubble Waffles', icon: '🧇' },
    { id: 'popsicles', name: 'Popsicles', icon: '🍦' },
  ];

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getAll({ available: true });
      setMenuItems(response.data.data);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-cream-50 pt-0 pb-16">
      {/* Hero Section */}
      <div className="w-full mb-8 md:mb-12">
        <img src="/menu.png" alt="Our Collection - The Menu" className="w-full h-auto object-contain" />
      </div>

      <div className="container mx-auto px-4">
        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 relative z-10"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-10 px-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gold-400/10 rounded-2xl blur-xl group-focus-within:bg-gold-400/20 transition-all duration-500"></div>
              <div className="relative flex items-center bg-white/90 backdrop-blur-md rounded-2xl border border-chocolate-100 shadow-soft-lg overflow-hidden transition-all duration-300 focus-within:border-gold-400/50 focus-within:shadow-luxury">
                <div className="pl-6">
                  <Search className="w-5 h-5 text-chocolate-400 group-focus-within:text-gold-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search your favorite desserts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-5 bg-transparent text-chocolate-800 placeholder-chocolate-400/70 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 p-2 hover:bg-chocolate-50 rounded-full transition-colors text-chocolate-400 hover:text-chocolate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter - Premium Horizontal Scroll */}
          <div className="relative">
            {/* Gradient Fades for Scroll Indication */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cream-50 to-transparent z-10 pointer-events-none md:hidden"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cream-50 to-transparent z-10 pointer-events-none md:hidden"></div>
            
            <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 px-4 pb-4 -mx-4 md:mx-0 md:justify-center md:flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`relative flex-shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-full font-medium transition-all duration-500 snap-center ${
                    activeCategory === cat.id
                      ? 'text-cream-50 shadow-luxury'
                      : 'bg-white/80 backdrop-blur-sm text-chocolate-600 hover:bg-white hover:text-chocolate-800 shadow-soft border border-chocolate-50/50'
                  }`}
                >
                  {/* Active Background Animation */}
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gradient-to-r from-chocolate-800 to-chocolate-900 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <span className={`text-xl transition-transform duration-300 ${activeCategory === cat.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {cat.icon}
                  </span>
                  <span className="whitespace-nowrap tracking-wide">{cat.name}</span>
                  
                  {/* Subtle selection indicator */}
                  {activeCategory === cat.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-1.5 h-1.5 rounded-full bg-gold-400 shadow-gold ml-1"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-chocolate-200 border-t-gold-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-chocolate-500">Loading delicious treats...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-chocolate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🍰</span>
            </div>
            <h3 className="text-2xl font-display font-semibold text-chocolate-700 mb-3">
              No items added yet
            </h3>
            <p className="text-chocolate-500">
              Check back soon! Our team is preparing the menu.
            </p>
          </motion.div>
        )}

        {/* Menu Grid */}
        {!loading && activeCategory === 'all' ? (
          // Grouped by category
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl">
                  {categories.find(c => c.id === category)?.icon || '🍽️'}
                </span>
                <div>
                  <h2 className={`text-2xl md:text-3xl font-display font-bold ${category === 'specials' ? 'text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-700' : 'text-chocolate-800'}`}>
                    {categories.find(c => c.id === category)?.name || category}
                  </h2>
                  <p className="text-chocolate-500 text-sm">{items.length} items</p>
                </div>
                <div className={`flex-1 h-px ml-4 ${category === 'specials' ? 'bg-gradient-to-r from-gold-300 to-transparent' : 'bg-gradient-to-r from-chocolate-200 to-transparent'}`}></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                {items.map((item, index) => (
                  <MenuCard key={item._id} item={item} index={index} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            {filteredItems.map((item, index) => (
              <MenuCard key={item._id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MenuCard = ({ item, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { cartItems, addToCart, updateQuantity } = useCart();
  
  const cartItem = cartItems.find(i => i._id === item._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const description = item.description || 'Artisan handcrafted dessert made with premium ingredients.';
  const isLongDesc = description.length > 100;
  const displayDesc = showFullDesc ? description : `${description.slice(0, 100)}${isLongDesc ? '...' : ''}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-white/50 backdrop-blur-sm rounded-[2rem] p-5 md:p-8 transition-all duration-300 hover:bg-white hover:shadow-soft-lg mb-4 border border-chocolate-50/50"
    >
      <div className="flex justify-between gap-6">
        {/* Left Side: Details */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            {item.isSpecial && <Sparkles className="w-4 h-4 text-gold-500" />}
            <span className="badge-gold text-[10px] py-0.5 px-2">
              {item.category.replace('_', ' ')}
            </span>
          </div>
          
          <h3 className="font-display text-xl md:text-2xl font-bold text-chocolate-800 mb-1">
            {item.name}
          </h3>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg font-bold text-chocolate-900">₹{item.price}</span>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100">
              <Star className="w-3 h-3 fill-emerald-600" />
              <span>4.8</span>
              <span className="text-[10px] text-emerald-600/70 font-medium">(120+)</span>
            </div>
          </div>
          
          <div className="relative">
            <p className="text-chocolate-500 text-sm leading-relaxed mb-1">
              {displayDesc}
              {isLongDesc && (
                <button 
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="ml-1 text-chocolate-800 font-bold hover:text-gold-600 transition-colors"
                >
                  {showFullDesc ? 'less' : 'more'}
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Image & Add Button */}
        <div className="relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40">
          <div className={`absolute inset-0 bg-chocolate-50 rounded-2xl ${imageLoaded ? 'hidden' : 'block animate-pulse'}`}></div>
          <img
            src={item.image?.startsWith('http') ? item.image : `${API_URL}/uploads/${item.image}`}
            alt={item.name}
            className={`w-full h-full object-cover rounded-2xl shadow-soft transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80`;
              setImageLoaded(true);
            }}
          />
          
          {/* Add Button Overlay */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%]">
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(item)}
                disabled={!item.isAvailable}
                className="w-full bg-white text-emerald-600 font-bold py-2.5 rounded-xl shadow-elevated border border-chocolate-100 hover:bg-emerald-50 transition-all active:scale-95 disabled:opacity-50"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center justify-between bg-white text-emerald-600 font-bold py-2 rounded-xl shadow-elevated border border-chocolate-100 px-3">
                <button 
                  onClick={() => updateQuantity(item._id, quantity - 1)}
                  className="hover:bg-emerald-50 p-1 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="text-sm">{quantity}</span>
                <button 
                  onClick={() => updateQuantity(item._id, quantity + 1)}
                  className="hover:bg-emerald-50 p-1 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
              <span className="text-[10px] font-bold text-chocolate-500 tracking-widest uppercase">Unavailable</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Menu;
