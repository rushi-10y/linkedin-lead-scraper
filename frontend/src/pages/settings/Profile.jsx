import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import LeadAnalytics from '../../components/LeadAnalytics.jsx';
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Password changed successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <section className="page-shell surface-glow px-6 py-7 sm:px-8">
        <div>
          <span className="section-label mb-4">
            <User className="h-3.5 w-3.5" />
            Profile Settings
          </span>
          <h1 className="page-title max-w-3xl">
            Manage your account settings and view analytics
          </h1>
          <p className="page-copy mt-4 max-w-2xl">
            Update your profile information, change security settings, and monitor your lead generation performance.
          </p>
        </div>
      </section>

      <div className="max-w-6xl">
        <div className="panel">
          <div className="border-b border-slate-700/50">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-cyan-400 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'security'
                    ? 'border-b-2 border-cyan-400 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-cyan-400 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-slate-700 border border-slate-600 rounded-full p-2 hover:bg-slate-600 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-50">{user?.name}</h2>
                    <p className="text-slate-400">{user?.email}</p>
                    <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    icon={User}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={Phone}
                  />
                  <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    icon={MapPin}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-50 placeholder-slate-400"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Button variant="primary" icon={Save} onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-50 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                    <Input
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <Input
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="mt-4"
                  >
                    {saving ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>

                <div className="border-t border-slate-700/50 pt-6">
                  <h3 className="text-lg font-medium text-slate-50 mb-4">Two-Factor Authentication</h3>
                  <p className="text-slate-400 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="secondary">Enable 2FA</Button>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="panel p-6">
                  <h3 className="text-lg font-medium text-slate-50 mb-4">Lead Analytics Dashboard</h3>
                  <p className="text-slate-400 mb-6">
                    View your lead generation trends, status distribution, and key performance metrics.
                  </p>
                  <LeadAnalytics />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
