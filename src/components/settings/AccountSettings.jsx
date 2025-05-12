import { useState, useEffect } from 'react';
import { User, Mail, Building, Lock, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { apiPut } from '../../utils/api';

const AccountSettings = () => {
  const { user } = useAuth();
  const [accountData, setAccountData] = useState({
    fullName: '',
    email: '',
    organization: 'Ocean Research Institute',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Load user data when the component mounts
  useEffect(() => {
    if (user) {
      setAccountData(prev => ({
        ...prev,
        fullName: user.full_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setAccountData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update profile information
      const response = await apiPut({
        url: '/users/me',
        payload: {
          full_name: accountData.fullName,
          // Note: Most APIs don't allow email updates in the profile endpoint
          // because they require verification, so we're only updating name here
          organization: accountData.organization
        },
        auth: true
      });

      toast.success('Profile information updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (accountData.newPassword !== accountData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // Validate password length
    if (accountData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // Update password
      const response = await apiPut({
        url: '/users/me/password',
        payload: {
          current_password: accountData.currentPassword,
          new_password: accountData.newPassword
        },
        auth: true
      });

      toast.success('Password updated successfully!');
      
      // Clear password fields
      setAccountData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Password update error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to update password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-6 border-b">
      <h3 className="text-lg font-semibold">Account Settings</h3>
      
      {/* Profile Information Form */}
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={accountData.fullName}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={accountData.email}
              onChange={handleChange}
              disabled // Email usually requires verification to change
              className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2"
            />
            <p className="text-xs text-gray-500 mt-1">Email address cannot be changed directly</p>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Building className="w-4 h-4 mr-2" />
              Organization
            </label>
            <input
              type="text"
              name="organization"
              value={accountData.organization}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* Password Change Form */}
      <form onSubmit={handlePasswordUpdate} className="pt-4">
        <h4 className="flex items-center text-sm font-medium text-gray-700 mb-3">
          <Lock className="w-4 h-4 mr-2" />
          Change Password
        </h4>
        <div className="space-y-3">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={accountData.currentPassword}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm p-2"
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={accountData.newPassword}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm p-2"
            required
            minLength={8}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={accountData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm p-2"
            required
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 mr-2" />
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;