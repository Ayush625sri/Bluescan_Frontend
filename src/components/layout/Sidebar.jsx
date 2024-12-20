import { Link } from 'react-router-dom';
import { 
  Home, 
  Map, 
  BarChart2, 
  FileText, 
  Settings, 
  AlertTriangle,
  Database,
  Camera 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart2, label: 'Analysis', path: '/analysis' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Camera, label: 'Image Upload', path: '/upload' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: Database, label: 'Data Management', path: '/data' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-gray-800 h-screen fixed left-0 top-0">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h1 className="text-white text-xl font-bold">Bluescan</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};


export default Sidebar