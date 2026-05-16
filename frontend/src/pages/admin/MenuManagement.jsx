import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Upload,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { menuAPI } from '../../services/api';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'brownies',
    isAvailable: true,
    isBestSeller: false,
    isSpecial: false,
    preparationTime: 15,
    image: null,
  });

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'cakes', name: 'Cakes' },
    { id: 'specials', name: 'Specials' },
    { id: 'brownies', name: 'Brownies' },
    { id: 'savories', name: 'Savories' },
    { id: 'bubble_waffles', name: 'Waffles' },
    { id: 'popsicles', name: 'Popsicles' },
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await menuAPI.getAll();
      setItems(response.data.data);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        category: item.category,
        isAvailable: item.isAvailable,
        isBestSeller: item.isBestSeller,
        isSpecial: item.isSpecial,
        preparationTime: item.preparationTime || 15,
        image: null,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'brownies',
        isAvailable: true,
        isBestSeller: false,
        isSpecial: false,
        preparationTime: 15,
        image: null,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', parseFloat(formData.price));
    data.append('category', formData.category);
    data.append('isAvailable', formData.isAvailable);
    data.append('isBestSeller', formData.isBestSeller);
    data.append('isSpecial', formData.isSpecial);
    data.append('preparationTime', formData.preparationTime);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingItem) {
        await menuAPI.update(editingItem._id, data);
        toast.success('Item updated successfully');
      } else {
        await menuAPI.create(data);
        toast.success('Item created successfully');
      }
      fetchItems();
      closeModal();
    } catch (error) {
      console.error('Failed to save item:', error);
      toast.error(error.response?.data?.message || 'Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await menuAPI.delete(id);
      toast.success('Item deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await menuAPI.toggleAvailability(id);
      fetchItems();
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      toast.error('Failed to update item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chocolate-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="admin-page-title font-display">Menu Management</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">{filteredItems.length} items</p>
          </div>
          <button
            onClick={() => openModal()}
            className="admin-btn admin-btn-primary"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
        
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input pl-8 w-full sm:w-48"
            />
          </div>
          <div className="admin-filters-scroll flex gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`admin-filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid — compact cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
        {filteredItems.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="admin-card overflow-hidden group"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.image?.startsWith('http') ? item.image : `${API_URL}/uploads/${item.image}`}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  if (!e.target.dataset.fallback) {
                    e.target.dataset.fallback = 'true';
                    e.target.src = 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80';
                  }
                }}
              />
              {/* Badges */}
              <div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
                {item.isBestSeller && (
                  <span className="admin-badge bg-chocolate-700 text-white text-[8px] px-1.5 py-0.5">★ Best</span>
                )}
                {item.isSpecial && (
                  <span className="admin-badge bg-gold-500 text-chocolate-900 text-[8px] px-1.5 py-0.5">Special</span>
                )}
              </div>
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="admin-badge bg-red-500 text-white text-[9px]">Unavailable</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2.5">
              <div className="flex items-start justify-between gap-1 mb-0.5">
                <h3 className="font-semibold text-gray-800 text-xs leading-tight truncate">{item.name}</h3>
                <span className="font-bold text-chocolate-600 text-xs flex-shrink-0">₹{item.price}</span>
              </div>
              <p className="text-[10px] text-gray-400 capitalize mb-2">{item.category?.replace('_', ' ')}</p>
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleAvailability(item._id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                    item.isAvailable
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  {item.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {item.isAvailable ? 'Live' : 'Off'}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(item)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 admin-card">
          <p className="text-xs text-gray-400">No items found</p>
        </div>
      )}

      {/* ─── Add/Edit Modal ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-50"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-x-3 top-8 bottom-8 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-800">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-md">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="admin-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="admin-input resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Price *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="admin-input"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="admin-input"
                      >
                        <option value="cakes">Cakes</option>
                        <option value="specials">Specials</option>
                        <option value="brownies">Brownies</option>
                        <option value="savories">Savories</option>
                        <option value="bubble_waffles">Bubble Waffles</option>
                        <option value="popsicles">Popsicles</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Image</label>
                    <div className="border border-dashed border-gray-200 rounded-lg p-3 text-center bg-gray-50/50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer">
                        <Upload className="w-6 h-6 text-gray-300 mb-1" />
                        <span className="text-[11px] text-gray-400">
                          {formData.image ? formData.image.name : 'Click to upload'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {[
                      { key: 'isAvailable', label: 'Available' },
                      { key: 'isBestSeller', label: 'Best Seller' },
                      { key: 'isSpecial', label: 'Special' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-chocolate-500 focus:ring-chocolate-500"
                        />
                        <span className="text-xs text-gray-600">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 admin-btn admin-btn-primary justify-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingItem ? 'Update' : 'Create'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManagement;
