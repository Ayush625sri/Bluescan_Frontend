import { Link, useNavigate } from "react-router-dom";
import { MapPin, BarChart2, Settings, LogOut, User, LogIn } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import SessionStatus from './SessionStatus';
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(navigate);

    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-[1000]">
      <div className="mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex-shrink-0 flex items-center h-16">
              <img src="/bluescan.png" alt="Logo" className="h-14 w-52" />
            </Link>
          </div>

          {user ? (
            <div className="flex items-center space-x-4 ml-auto">
              <Link
                to="/dashboard"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
              >
                <MapPin className="h-5 w-5 mr-1" />
                Dashboard
              </Link>
              <Link
                to="/analysis"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
              >
                <BarChart2 className="h-5 w-5 mr-1" />
                Analysis
              </Link>
              {/* <Link
                to="/settings"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
              >
                <Settings className="h-5 w-5 mr-1" />
                Settings
              </Link> */}
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
              >
                <User className="h-5 w-5 mr-1" />
                {user.full_name?.split(' ')[0] || 'Profile'}
              </Link>
              {/* <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-red-600 transition duration-150"
              >
                <LogOut className="h-5 w-5 mr-1" />
              </button> */}
              {user && (
                <div className="ml-4 border-l pl-4">
                  <SessionStatus />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4 ml-auto">
              <Link
                to="/login"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
              >
                Login
                <LogIn className="h-5 w-5 mx-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;