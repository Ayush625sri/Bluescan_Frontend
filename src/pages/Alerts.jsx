import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

const Alerts = () => {
  const [alerts] = useState([
    {
      id: 1,
      type: "critical",
      message: "High concentration of microplastics detected in Zone A",
      timestamp: new Date(),
      status: "unread",
    },
    {
      id: 2,
      type: "warning",
      message: "Unusual pollution pattern detected in coastal area",
      timestamp: new Date(Date.now() - 86400000),
      status: "read",
    },
    // Add more alerts as needed
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto pt-16 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Alerts & Notifications</h2>

        <div className="space-y-6">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${
                alert.status === "unread"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start">
                {getAlertIcon(alert.type)}
                <div className="ml-3 flex-1">
                  <p
                    className={`font-medium ${
                      alert.status === "unread"
                        ? "text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    {alert.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
