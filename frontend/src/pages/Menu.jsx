import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, X, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { menuAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/** Resolve image URL — API now returns full URLs; this handles legacy bare filenames too */
const getImageUrl = (item) => {
  if (!item.image) return getCategoryFallback(item.category);
  if (item.image.startsWith('http')) return item.image;
  return `${API_URL}/uploads/${item.image}`;
};

/** Category-specific fallback images (used only when the real image fails to load) */
const getCategoryFallback = (category) => {
  const fallbacks = {
    cakes: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
    brownies: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
    specials: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80',
    popsicles: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80',
    bubble_waffles: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80',
    savories: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
  };
  return fallbacks[category] || 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80';
};

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const { addToCart } = useCart();

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'cakes', name: 'Cakes' },
    { id: 'specials', name: 'Specials' },
    { id: 'brownies', name: 'Brownies' },
    { id: 'savories', name: 'Savories' },
    { id: 'bubble_waffles', name: 'Bubble Waffles' },
    { id: 'popsicles', name: 'Popsicles' },
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

  const toggleCategory = (categoryId) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
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

  const getCategoryDisplayName = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.name || 
      categoryId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-white pt-0 pb-24">
      {/* Compact Hero Banner */}
      <div className="w-full mb-4">
        <img src="/menu.jpg" alt="Our Collection" className="w-full h-auto object-contain" />
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Search Bar — Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <div className="relative">
            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 focus-within:border-chocolate-400 focus-within:bg-white focus-within:shadow-sm">
              <div className="pl-4">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search desserts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-3 bg-transparent text-sm text-chocolate-800 placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category Pills — Clean Horizontal Scroll */}
        <div className="relative mb-5">
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? 'bg-chocolate-800 text-white border-chocolate-800 shadow-sm'
                    : 'bg-white text-chocolate-600 border-gray-200 hover:border-chocolate-300 hover:text-chocolate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Thin separator */}
        <div className="h-px bg-gray-100 mb-5"></div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-[3px] border-gray-200 border-t-chocolate-600 rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-400 text-sm">Loading menu...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-chocolate-700 mb-1">
              No items found
            </h3>
            <p className="text-gray-400 text-sm">
              Try a different search or category.
            </p>
          </motion.div>
        )}

        {/* Menu Items — Grouped by Category */}
        {!loading && activeCategory === 'all' ? (
          Object.entries(groupedItems).map(([category, items]) => {
            const isCollapsed = collapsedCategories[category];
            return (
              <div key={category} className="mb-6">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between py-3 group"
                >
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-chocolate-800 tracking-wide uppercase">
                      {getCategoryDisplayName(category)}
                    </h2>
                    <span className="text-xs text-gray-400 font-medium">
                      ({items.length})
                    </span>
                  </div>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-chocolate-600 transition-colors" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-chocolate-600 transition-colors" />
                  )}
                </button>
                <div className="h-px bg-gray-100 mb-3"></div>

                {/* Items List */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      {items.map((item, index) => (
                        <MenuCard key={item._id} item={item} index={index} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div>
            {filteredItems.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 py-2">
                  <h2 className="text-sm font-bold text-chocolate-800 tracking-wide uppercase">
                    {getCategoryDisplayName(activeCategory)}
                  </h2>
                  <span className="text-xs text-gray-400 font-medium">
                    ({filteredItems.length})
                  </span>
                </div>
                <div className="h-px bg-gray-100 mb-3"></div>
              </div>
            )}
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

  const description = item.description || 'Handcrafted with premium ingredients and love.';
  const isLongDesc = description.length > 80;
  const displayDesc = showFullDesc ? description : `${description.slice(0, 80)}${isLongDesc ? '...' : ''}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="flex gap-4 py-4 border-b border-gray-50 last:border-b-0"
    >
      {/* Left — Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center pr-1">
        {/* Item Name */}
        <h3 className="font-semibold text-[15px] leading-snug text-chocolate-800 mb-1">
          {item.name}
        </h3>

        {/* Price */}
        <p className="text-sm font-bold text-chocolate-900 mb-1.5">
          ₹{item.price}
        </p>

        {/* Rating Badge */}
        <div className="flex items-center gap-1 mb-2">
          <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-700 text-white rounded text-[10px] font-bold leading-none">
            <Star className="w-2.5 h-2.5 fill-white" />
            <span>4.8</span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">(120+)</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed">
          {displayDesc}
          {isLongDesc && (
            <button 
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="ml-1 text-chocolate-700 font-semibold hover:text-chocolate-900 transition-colors"
            >
              {showFullDesc ? 'less' : 'more'}
            </button>
          )}
        </p>
      </div>

      {/* Right — Image + ADD Button */}
      <div className="relative flex-shrink-0 w-[118px]">
        {/* Image */}
        <div className="relative w-[118px] h-[100px] rounded-xl overflow-hidden bg-gray-50">
          <div className={`absolute inset-0 bg-gray-100 ${imageLoaded ? 'hidden' : 'block animate-pulse'}`}></div>
          <img
            src={getImageUrl(item)}
            alt={item.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Prevent infinite loop — only replace once
              if (!e.target.dataset.fallback) {
                e.target.dataset.fallback = 'true';
                e.target.src = getCategoryFallback(item.category);
              }
              setImageLoaded(true);
            }}
          />
          {/* Unavailable overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Unavailable</span>
            </div>
          )}
        </div>

        {/* ADD Button — Attached below image */}
        <div className="flex justify-center -mt-3.5 relative z-10">
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(item)}
              disabled={!item.isAvailable}
              className="bg-white text-green-600 font-extrabold text-sm px-7 py-1.5 rounded-lg shadow-md border border-gray-100 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-green-600 text-white font-bold text-sm px-3 py-1.5 rounded-lg shadow-md">
              <button 
                onClick={() => updateQuantity(item._id, quantity - 1)}
                className="hover:bg-green-700 rounded transition-colors p-0.5"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm min-w-[14px] text-center">{quantity}</span>
              <button 
                onClick={() => updateQuantity(item._id, quantity + 1)}
                className="hover:bg-green-700 rounded transition-colors p-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Menu;
