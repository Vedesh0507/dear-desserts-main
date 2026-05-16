import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Calendar,
  Percent,
  DollarSign,
  X,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { offerAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    validUntil: '',
    usageLimit: '',
    isActive: true,
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await offerAPI.getAll();
      setOffers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        code: offer.code,
        description: offer.description,
        discountType: offer.discountType,
        discountValue: offer.discountValue.toString(),
        minOrderAmount: offer.minOrderAmount?.toString() || '',
        maxDiscount: offer.maxDiscount?.toString() || '',
        validUntil: new Date(offer.validUntil).toISOString().split('T')[0],
        usageLimit: offer.usageLimit?.toString() || '',
        isActive: offer.isActive,
      });
    } else {
      setEditingOffer(null);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscount: '',
        validUntil: '',
        usageLimit: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.description || !formData.discountValue || !formData.validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    const data = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      validUntil: new Date(formData.validUntil),
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      isActive: formData.isActive,
    };

    try {
      if (editingOffer) {
        await offerAPI.update(editingOffer._id, data);
        toast.success('Offer updated successfully');
      } else {
        await offerAPI.create(data);
        toast.success('Offer created successfully');
      }
      fetchOffers();
      closeModal();
    } catch (error) {
      console.error('Failed to save offer:', error);
      toast.error(error.response?.data?.message || 'Failed to save offer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      await offerAPI.delete(id);
      toast.success('Offer deleted successfully');
      fetchOffers();
    } catch (error) {
      console.error('Failed to delete offer:', error);
      toast.error('Failed to delete offer');
    }
  };

  const toggleOffer = async (id) => {
    try {
      await offerAPI.toggle(id);
      fetchOffers();
    } catch (error) {
      console.error('Failed to toggle offer:', error);
      toast.error('Failed to update offer');
    }
  };

  const isOfferValid = (offer) => {
    const now = new Date();
    return offer.isActive && new Date(offer.validUntil) >= now;
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="admin-page-title font-display">Offers & Coupons</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">{offers.length} coupon{offers.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => openModal()}
          className="admin-btn admin-btn-primary"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Offer</span>
        </button>
      </div>

      {/* Offers Grid — 2x2 layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {offers.map((offer) => (
          <motion.div
            key={offer._id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`admin-card p-3.5 relative overflow-hidden ${
              !isOfferValid(offer) ? 'opacity-50' : ''
            }`}
          >
            {/* Decorative corner */}
            <div className={`absolute top-0 right-0 w-12 h-12 ${isOfferValid(offer) ? 'bg-green-50' : 'bg-gray-50'} rounded-bl-[2rem]`}></div>
            
            {/* Header */}
            <div className="flex items-start justify-between mb-2 relative">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isOfferValid(offer) ? 'bg-chocolate-100' : 'bg-gray-100'}`}>
                  <Tag className={`w-3.5 h-3.5 ${isOfferValid(offer) ? 'text-chocolate-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-xs tracking-wide">{offer.code}</h3>
                  <span className={`admin-badge ${
                    isOfferValid(offer) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                  }`}>
                    {isOfferValid(offer) ? 'Active' : 'Expired'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleOffer(offer._id)}
                className="text-gray-300 hover:text-gray-500 transition-colors relative z-10"
              >
                {offer.isActive ? (
                  <ToggleRight className="w-5 h-5 text-green-500" />
                ) : (
                  <ToggleLeft className="w-5 h-5" />
                )}
              </button>
            </div>

            <p className="text-[11px] text-gray-500 mb-2.5 line-clamp-1">{offer.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] mb-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Discount</span>
                <span className="font-semibold text-chocolate-600">
                  {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Used</span>
                <span className="font-medium text-gray-700">
                  {offer.usedCount}{offer.usageLimit ? `/${offer.usageLimit}` : ''}
                </span>
              </div>
              {offer.minOrderAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Min</span>
                  <span className="text-gray-700">₹{offer.minOrderAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Expires</span>
                <span className="text-gray-700">
                  {new Date(offer.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-1 pt-2 border-t border-gray-100">
              <button
                onClick={() => openModal(offer)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDelete(offer._id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="text-center py-12 admin-card">
          <Tag className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-xs text-gray-400">No offers created yet</p>
        </div>
      )}

      {/* ─── Create/Edit Modal ─── */}
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
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-800">
                  {editingOffer ? 'Edit Offer' : 'Create Offer'}
                </h3>
                <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-md">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., WELCOME10"
                      className="admin-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Description *</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., 10% off on first order"
                      className="admin-input"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                      <select
                        value={formData.discountType}
                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                        className="admin-input"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="flat">Flat Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Value *</label>
                      <input
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                        placeholder={formData.discountType === 'percentage' ? '10' : '50'}
                        className="admin-input"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Min Order</label>
                      <input
                        type="number"
                        value={formData.minOrderAmount}
                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                        placeholder="0"
                        className="admin-input"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Max Discount</label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                        placeholder="100"
                        className="admin-input"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Valid Until *</label>
                      <input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        className="admin-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Usage Limit</label>
                      <input
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                        placeholder="Unlimited"
                        className="admin-input"
                        min="0"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-chocolate-500 focus:ring-chocolate-500"
                    />
                    <span className="text-xs text-gray-600">Active</span>
                  </label>
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
                      <span>{editingOffer ? 'Update' : 'Create'}</span>
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

export default Offers;
