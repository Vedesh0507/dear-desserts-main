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
    { id: 'brownies', name: 'Brownies', icon: '🍫' },
    { id: 'savories', name: 'Savories', icon: '🥪' },
    { id: 'bubble_waffles', name: 'Bubble Waffles', icon: '🧇' },
    { id: 'popsicles', name: 'Popsicles', icon: '🍦' },
    { id: 'special_daily', name: 'Special Menu Daily', icon: '🌟' },
    { id: 'special_weekend', name: 'Weekend Special Menu', icon: '🎊' },
  ];

  const getDailySpecialTitle = () => {
    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });
    const date = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    return `Today's Special — ${day}, ${date}`;
  };

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
    <div className="min-h-screen bg-cream-50 pt-28 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-chocolate-900 to-chocolate-800 text-cream-50 py-16 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1200&q=30')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium tracking-wider uppercase mb-6 bg-gold-500/20 text-gold-400">
              <Sparkles className="w-4 h-4" />
              Our Collection
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              The Menu
            </h1>
            <p className="text-cream-300 max-w-xl mx-auto text-lg">
              Handcrafted desserts made with premium ingredients and artisanal passion
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-chocolate-400" />
            <input
              type="text"
              placeholder="Search our desserts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 rounded-2xl border border-chocolate-200/60 bg-white text-chocolate-800 placeholder-chocolate-400 focus:border-gold-500 focus:ring-4 focus:ring-gold-400/20 focus:outline-none transition-all shadow-soft"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-chocolate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-chocolate-400" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-chocolate-800 text-cream-50 shadow-elevated'
                    : 'bg-white text-chocolate-600 hover:bg-chocolate-100 shadow-soft border border-chocolate-100'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
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
                  <h2 className={`text-2xl md:text-3xl font-display font-bold ${category === 'special_weekend' ? 'text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-700' : 'text-chocolate-800'}`}>
                    {category === 'special_daily' 
                      ? getDailySpecialTitle() 
                      : category === 'special_weekend'
                      ? 'Weekend Specials'
                      : categories.find(c => c.id === category)?.name || category}
                  </h2>
                  <p className="text-chocolate-500 text-sm">{items.length} items</p>
                </div>
                <div className={`flex-1 h-px ml-4 ${category === 'special_weekend' ? 'bg-gradient-to-r from-gold-300 to-transparent' : 'bg-gradient-to-r from-chocolate-200 to-transparent'}`}></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((item, index) => (
                  <MenuCard key={item._id} item={item} index={index} addToCart={addToCart} />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Flat list
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item, index) => (
              <MenuCard key={item._id} item={item} index={index} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MenuCard = ({ item, index, addToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-luxury h-full flex flex-col">
        <div className="relative overflow-hidden">
          {/* Image placeholder */}
          <div className={`absolute inset-0 bg-gradient-to-br from-chocolate-100 to-chocolate-200 ${imageLoaded ? 'hidden' : 'block'}`}>
            <div className="animate-pulse h-full w-full"></div>
          </div>
          <img
            src={item.image?.startsWith('http') ? item.image : `${API_URL}/uploads/${item.image}`}
            alt={item.name}
            className={`w-full h-56 object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80`;
              setImageLoaded(true);
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {item.isBestSeller && (
              <span className="badge-gold">Best Seller</span>
            )}
            {item.isSpecial && (
              <span className="badge bg-rose-500 text-white">Special</span>
            )}
          </div>

          {/* Quick add button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(item);
            }}
            disabled={!item.isAvailable}
            className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-elevated flex items-center justify-center opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-gold-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
          
          {/* Out of stock overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-chocolate-950/60 flex items-center justify-center">
              <span className="bg-rose-500 text-white px-5 py-2 rounded-full font-semibold text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
            ))}
            <span className="text-xs text-chocolate-400 ml-1">(4.9)</span>
          </div>

          <h3 className="font-display text-xl font-semibold text-chocolate-800 mb-2">
            {item.name}
          </h3>
          
          <p className="text-chocolate-500 text-sm line-clamp-2 flex-1 mb-4">
            {item.description || 'A delicious treat crafted with premium ingredients'}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-chocolate-100">
            <span className="text-2xl font-display font-bold text-chocolate-800">
              ₹{item.price}
            </span>
            <button
              onClick={() => addToCart(item)}
              disabled={!item.isAvailable}
              className="flex items-center gap-2 bg-chocolate-800 text-cream-50 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-chocolate-900 transition-all duration-300 hover:shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Menu;
