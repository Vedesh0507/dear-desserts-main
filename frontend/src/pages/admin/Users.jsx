import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Shield, X, Loader2, Eye, EyeOff, KeyRound, Trash2, ShieldAlert } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetModal, setResetModal] = useState(null); // user object when resetting
  const [deleteModal, setDeleteModal] = useState(null); // user object when confirming delete
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'staff', phone: '', isActive: true,
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try { const r = await authAPI.getUsers(); setUsers(r.data.data); }
    catch (e) { console.error('Failed to fetch users:', e); toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  // Determine who the owner is (first admin by creation date)
  const owner = users.filter(u => u.role === 'admin').sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
  const isOwner = (userId) => owner && owner._id === userId;

  // --- Add / Edit User Modal ---
  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role, phone: user.phone || '', isActive: user.isActive });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'staff', phone: '', isActive: true });
    }
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingUser(null); setShowPassword(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) { toast.error('Please fill in all required fields'); return; }
    // Password required only for new users
    if (!editingUser && !formData.password) { toast.error('Password is required for new users'); return; }
    if (!editingUser && formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSubmitting(true);
    try {
      if (editingUser) {
        // Send only profile fields — never password
        const { password, ...profileData } = formData;
        await authAPI.updateUser(editingUser._id, profileData);
        toast.success('User updated');
      } else {
        await authAPI.register(formData);
        toast.success('User created');
      }
      fetchUsers(); closeModal();
    } catch (e) { console.error('Failed to save user:', e); toast.error(e.response?.data?.message || 'Failed to save user'); }
    finally { setSubmitting(false); }
  };

  const toggleUserStatus = async (user) => {
    if (user._id === currentUser._id) { toast.error("You can't deactivate yourself"); return; }
    if (isOwner(user._id)) { toast.error("Owner account cannot be deactivated"); return; }
    try { await authAPI.updateUser(user._id, { isActive: !user.isActive }); toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`); fetchUsers(); }
    catch (e) { console.error('Failed to update user:', e); toast.error(e.response?.data?.message || 'Failed to update user'); }
  };

  // --- Reset Password ---
  const handleResetPassword = async () => {
    if (!resetPassword || resetPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSubmitting(true);
    try {
      await authAPI.resetPassword(resetModal._id, resetPassword);
      toast.success('Password reset successfully');
      setResetModal(null); setResetPassword('');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to reset password'); }
    finally { setSubmitting(false); }
  };

  // --- Delete User ---
  const handleDeleteUser = async () => {
    setSubmitting(true);
    try {
      await authAPI.deleteUser(deleteModal._id);
      toast.success('User deleted');
      setDeleteModal(null); fetchUsers();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to delete user'); }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return (<div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chocolate-600"></div></div>);
  }

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="admin-page-title font-display">User Management</h1>
        <button onClick={() => openModal()} className="admin-btn admin-btn-primary">
          <Plus className="w-3.5 h-3.5" /><span>Add User</span>
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th><th>Role</th><th>Status</th><th className="hidden sm:table-cell">Joined</th><th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-chocolate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-semibold text-chocolate-600">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-xs truncate">
                          {user.name}
                          {user._id === currentUser._id && <span className="text-chocolate-500 ml-1">(You)</span>}
                          {isOwner(user._id) && <span className="text-amber-500 ml-1 text-[9px] font-bold">👑 Owner</span>}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                      <Shield className="w-3 h-3" />{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleUserStatus(user)}
                      disabled={user._id === currentUser._id || isOwner(user._id)}
                      className={`admin-badge cursor-pointer ${user.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} ${(user._id === currentUser._id || isOwner(user._id)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="hidden sm:table-cell text-[11px] text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex justify-end gap-0.5">
                      <button onClick={() => openModal(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md" title="Edit Profile">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => { setResetModal(user); setResetPassword(''); setShowPassword(false); }} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md" title="Reset Password">
                        <KeyRound className="w-3 h-3" />
                      </button>
                      {!isOwner(user._id) && user._id !== currentUser._id && (
                        <button onClick={() => setDeleteModal(user)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md" title="Delete User">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Add / Edit User Modal ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-50" onClick={closeModal} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-x-3 top-1/2 -translate-y-1/2 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-xl shadow-xl z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-800">{editingUser ? 'Edit User Profile' : 'Add New User'}</h3>
                <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-md"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="admin-input" required />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="admin-input" required />
                </div>

                {/* Password field only for NEW users — never shown for editing */}
                {!editingUser && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Password *</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="admin-input pr-8" required minLength={6} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Minimum 6 characters</p>
                  </div>
                )}

                {editingUser && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-amber-700 flex items-center gap-1">
                      <KeyRound className="w-3 h-3" />
                      To change password, use the "Reset Password" button from the table.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="admin-input"
                      disabled={editingUser && isOwner(editingUser._id)}
                    >
                      <option value="staff">Staff</option><option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="admin-input" />
                  </div>
                </div>

                {/* Hide active toggle for owner */}
                {!(editingUser && isOwner(editingUser._id)) && (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-3.5 h-3.5 rounded border-gray-300 text-chocolate-500 focus:ring-chocolate-500" />
                    <span className="text-xs text-gray-600">Active</span>
                  </label>
                )}

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={closeModal} className="flex-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-xs font-medium">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 admin-btn admin-btn-primary justify-center">
                    {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Saving...</span></> : <span>{editingUser ? 'Update' : 'Create'}</span>}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Reset Password Modal ─── */}
      <AnimatePresence>
        {resetModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-50" onClick={() => setResetModal(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-x-3 top-1/2 -translate-y-1/2 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm bg-white rounded-xl shadow-xl z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b bg-amber-50/50">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-amber-600" /> Reset Password</h3>
                <button onClick={() => setResetModal(null)} className="p-1 hover:bg-gray-100 rounded-md"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Resetting password for</p>
                  <p className="text-sm font-semibold text-gray-800">{resetModal.name}</p>
                  <p className="text-[10px] text-gray-400">{resetModal.email}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">New Temporary Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      className="admin-input pr-8"
                      placeholder="Min. 6 characters"
                      minLength={6}
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Share this temporary password with the user manually.</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setResetModal(null)} className="flex-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-xs font-medium">Cancel</button>
                  <button onClick={handleResetPassword} disabled={submitting || resetPassword.length < 6} className="flex-1 admin-btn admin-btn-primary justify-center">
                    {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Resetting...</span></> : <span>Reset Password</span>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {deleteModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-50" onClick={() => setDeleteModal(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-x-3 top-1/2 -translate-y-1/2 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm bg-white rounded-xl shadow-xl z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b bg-red-50/50">
                <h3 className="text-sm font-bold text-red-700 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Delete User</h3>
                <button onClick={() => setDeleteModal(null)} className="p-1 hover:bg-gray-100 rounded-md"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-gray-600">
                  Are you sure you want to permanently delete <strong>{deleteModal.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setDeleteModal(null)} className="flex-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-xs font-medium">Cancel</button>
                  <button onClick={handleDeleteUser} disabled={submitting} className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-1">
                    {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Deleting...</span></> : <><Trash2 className="w-3 h-3" /><span>Delete</span></>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
