import { useState } from 'react';
import { User, Mail, Building, Lock } from 'lucide-react';

const AccountSettings = () => {
  const [accountData, setAccountData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    organization: 'Ocean Research Institute',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setAccountData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-6 pb-6 border-b">
      <h3 className="text-lg font-semibold">Account Settings</h3>
      
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
            className="w-full rounded-md border-gray-300 shadow-sm"
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
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
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
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="pt-4">
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
              className="w-full rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={accountData.newPassword}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={accountData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


export default AccountSettings