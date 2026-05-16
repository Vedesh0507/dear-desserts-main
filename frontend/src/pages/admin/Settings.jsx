import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Phone, Mail, MapPin, Clock, Save, Loader2, Upload, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { settingsAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const { login: updateToken } = useAuth();

  // Change password state
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try { const r = await settingsAPI.get(); setSettings(r.data.data); }
    catch (e) { console.error('Failed to fetch settings:', e); toast.error('Failed to load settings'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append('cafeName', settings.cafeName);
    formData.append('tagline', settings.tagline);
    formData.append('phone', settings.phone);
    formData.append('email', settings.email);
    formData.append('address', settings.address);
    formData.append('currency', settings.currency);
    formData.append('taxRate', settings.taxRate);
    formData.append('deliveryCharge', settings.deliveryCharge);
    formData.append('minOrderAmount', settings.minOrderAmount);
    if (logoFile) formData.append('logo', logoFile);
    if (settings.socialMedia) {
      formData.append('socialMedia[instagram]', settings.socialMedia.instagram || '');
      formData.append('socialMedia[facebook]', settings.socialMedia.facebook || '');
      formData.append('socialMedia[twitter]', settings.socialMedia.twitter || '');
    }
    try { const r = await settingsAPI.update(formData); setSettings(r.data.data); toast.success('Settings saved'); }
    catch (e) { console.error('Failed to update settings:', e); toast.error('Failed to update settings'); }
    finally { setSaving(false); }
  };

  // --- Change Password Handler ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields'); return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters'); return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match'); return;
    }
    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password'); return;
    }

    setChangingPassword(true);
    try {
      const r = await authAPI.updatePassword({ currentPassword, newPassword });
      // Update the stored token with the fresh one
      if (r.data.data?.token) {
        localStorage.setItem('token', r.data.data.token);
      }
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswords({ current: false, new: false, confirm: false });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (<div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chocolate-600"></div></div>);
  }

  const InputField = ({ label, value, onChange, type = 'text', ...props }) => (
    <div>
      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input type={type} value={value || ''} onChange={onChange} className="admin-input" {...props} />
    </div>
  );

  const PasswordField = ({ label, fieldKey, value }) => (
    <div>
      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <div className="relative">
        <input
          type={showPasswords[fieldKey] ? 'text' : 'password'}
          value={value}
          onChange={(e) => setPasswordData({ ...passwordData, [fieldKey === 'current' ? 'currentPassword' : fieldKey === 'new' ? 'newPassword' : 'confirmPassword']: e.target.value })}
          className="admin-input pr-8"
          required
          minLength={fieldKey !== 'current' ? 6 : undefined}
        />
        <button
          type="button"
          onClick={() => setShowPasswords({ ...showPasswords, [fieldKey]: !showPasswords[fieldKey] })}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPasswords[fieldKey] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl pb-6">
      <h1 className="admin-page-title font-display mb-4">Cafe Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Basic Info */}
        <div className="admin-card p-4">
          <h3 className="admin-section-title flex items-center gap-1.5 mb-3"><Store className="w-3.5 h-3.5" /> Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField label="Cafe Name" value={settings?.cafeName} onChange={(e) => setSettings({ ...settings, cafeName: e.target.value })} />
            <InputField label="Tagline" value={settings?.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Logo</label>
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="hidden" id="logo-upload" />
                <label htmlFor="logo-upload" className="admin-btn admin-btn-outline cursor-pointer text-[11px]">
                  <Upload className="w-3 h-3" />{logoFile ? logoFile.name : 'Upload Logo'}
                </label>
              </div>
            </div>
            <InputField label="Currency" value={settings?.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} />
          </div>
        </div>

        {/* Contact */}
        <div className="admin-card p-4">
          <h3 className="admin-section-title flex items-center gap-1.5 mb-3"><Phone className="w-3.5 h-3.5" /> Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField label="Phone" value={settings?.phone} type="tel" onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            <InputField label="Email" value={settings?.email} type="email" onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</label>
              <textarea value={settings?.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={2} className="admin-input resize-none" />
            </div>
          </div>
        </div>

        {/* Order Settings */}
        <div className="admin-card p-4">
          <h3 className="admin-section-title flex items-center gap-1.5 mb-3"><Clock className="w-3.5 h-3.5" /> Order Settings</h3>
          <div className="grid grid-cols-3 gap-3">
            <InputField label="Tax Rate (%)" type="number" value={settings?.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })} min="0" step="0.01" />
            <InputField label="Delivery (₹)" type="number" value={settings?.deliveryCharge} onChange={(e) => setSettings({ ...settings, deliveryCharge: parseFloat(e.target.value) })} min="0" />
            <InputField label="Min Order (₹)" type="number" value={settings?.minOrderAmount} onChange={(e) => setSettings({ ...settings, minOrderAmount: parseFloat(e.target.value) })} min="0" />
          </div>
        </div>

        {/* Social Media */}
        <div className="admin-card p-4">
          <h3 className="admin-section-title mb-3">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InputField label="Instagram" type="url" value={settings?.socialMedia?.instagram} onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, instagram: e.target.value } })} placeholder="https://instagram.com/..." />
            <InputField label="Facebook" type="url" value={settings?.socialMedia?.facebook} onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, facebook: e.target.value } })} placeholder="https://facebook.com/..." />
            <InputField label="Twitter" type="url" value={settings?.socialMedia?.twitter} onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, twitter: e.target.value } })} placeholder="https://twitter.com/..." />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Saving...</span></> : <><Save className="w-3.5 h-3.5" /><span>Save Changes</span></>}
          </button>
        </div>
      </form>

      {/* ─── Change Your Password ─── */}
      <form onSubmit={handleChangePassword} className="mt-5">
        <div className="admin-card p-4 border-l-4 border-l-amber-400">
          <h3 className="admin-section-title flex items-center gap-1.5 mb-1"><KeyRound className="w-3.5 h-3.5 text-amber-600" /> Change Your Password</h3>
          <p className="text-[10px] text-gray-400 mb-3">Use this to change your own login password securely.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <PasswordField label="Current Password *" fieldKey="current" value={passwordData.currentPassword} />
            <PasswordField label="New Password *" fieldKey="new" value={passwordData.newPassword} />
            <PasswordField label="Confirm Password *" fieldKey="confirm" value={passwordData.confirmPassword} />
          </div>
          {passwordData.newPassword && passwordData.confirmPassword && (
            <div className={`mt-2 text-[10px] flex items-center gap-1 ${passwordData.newPassword === passwordData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
              <CheckCircle className="w-3 h-3" />
              {passwordData.newPassword === passwordData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
            </div>
          )}
          <div className="flex justify-end mt-3">
            <button type="submit" disabled={changingPassword} className="admin-btn admin-btn-primary">
              {changingPassword ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Changing...</span></> : <><KeyRound className="w-3.5 h-3.5" /><span>Change Password</span></>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
