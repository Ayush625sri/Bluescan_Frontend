import { Link } from 'react-router-dom';
import { MapPin, BarChart2, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Bluescan</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">
              <MapPin className="h-5 w-5 mr-1" />
              Dashboard
            </Link>
            <Link to="/analysis" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">
              <BarChart2 className="h-5 w-5 mr-1" />
              Analysis
            </Link>
            <Link to="/settings" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">
              <Settings className="h-5 w-5 mr-1" />
              Settings
            </Link>
            <button className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-red-600">
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
  export default Navbar