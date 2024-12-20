import { Bell } from 'lucide-react';
import { useState } from 'react';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pollutionAlerts: true,
    weeklyReports: false,
    systemUpdates: true
  });

  return (
    <div className="space-y-6 pb-6 border-b">
      <h3 className="text-lg font-semibold flex items-center">
        <Bell className="w-5 h-5 mr-2" />
        Notification Preferences
      </h3>

      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {key.split(/(?=[A-Z])/).join(' ')}
            </span>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setNotifications(prev => ({
                ...prev,
                [key]: e.target.checked
              }))}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </label>
        ))}
      </div>
    </div>
  );
};


export default NotificationSettings