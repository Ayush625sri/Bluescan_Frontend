import { Link } from "react-router-dom";
import {
  Home,
  Map,
  BarChart2,
  FileText,
  Settings,
  AlertTriangle,
  Database,
  Camera,
  Menu,
} from "lucide-react";
import SessionCounter from "./SessionCounter";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Map, label: "Dashboard", path: "/dashboard" },
    { icon: BarChart2, label: "Analysis", path: "/analysis" },
    { icon: FileText, label: "Reports", path: "/reports" },
    // { icon: Camera, label: "Image Upload", path: "/upload" },
    // { icon: Camera, label: "Live Sessions", path: "/sessions" },
    {
      icon: Camera,
      label: "Live Sessions",
      path: "/sessions",
      counter: <SessionCounter />
    },
    { icon: AlertTriangle, label: "Alerts", path: "/alerts" },
    { icon: Database, label: "Data Management", path: "/data" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div
      className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-800 h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className={`flex items-center justify-center h-16 bg-gray-900 ${collapsed ? 'px-2' : ''}`}>
        {collapsed ? (
          <h1 className="text-white text-xl font-bold">B</h1>
        ) : (
          <h1 className="text-white text-xl font-bold">Bluescan</h1>
        )}
      </div>

      <nav className="mt-6 flex-grow">
        {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center ${collapsed ? 'justify-center' : 'px-6'} py-3 text-gray-300 hover:bg-gray-700 hover:text-white relative`}
              title={collapsed ? item.label : ""}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {!collapsed && <span>{item.label}</span>}
              {item.counter && item.counter}
            </Link>
        ))}
      </nav>

      {/* Hamburger menu button at the bottom */}
      <div className="mt-auto mb-4">
        <button
          onClick={toggleSidebar}
          className={`flex items-center ${collapsed ? 'justify-center w-full' : 'mx-6 justify-between w-[calc(100%-3rem)]'} p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white`}
        >
          {!collapsed && <span>Collapse Sidebar</span>}
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;