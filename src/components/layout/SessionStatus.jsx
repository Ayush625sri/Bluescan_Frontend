import { useState, useEffect, useRef } from 'react';
import { useSession } from '../../contexts/SessionContext';
import { Link } from 'react-router-dom';
import { Video, AlertCircle, ChevronDown, Smartphone, Monitor, Clock, Play, X } from 'lucide-react';
import SessionDropdown from './SessionDropdown';

const SessionStatus = () => {
  const { connected, activeDevices, pendingRequests, activeSession } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusDisplay = () => {
    if (activeSession) {
      return {
        text: 'Live Session Active',
        color: 'text-green-600',
        icon: Video,
        dot: 'bg-green-500'
      };
    }
    
    if (pendingRequests.length > 0) {
      return {
        text: `${pendingRequests.length} Pending Request${pendingRequests.length > 1 ? 's' : ''}`,
        color: 'text-yellow-600',
        icon: AlertCircle,
        dot: 'bg-yellow-500'
      };
    }
    
    if (connected && activeDevices.length > 0) {
      return {
        text: `${activeDevices.length} Device${activeDevices.length > 1 ? 's' : ''} Connected`,
        color: 'text-blue-600',
        icon: null,
        dot: 'bg-blue-500'
      };
    }
    
    return {
      text: connected ? 'Connected' : 'Connecting...',
      color: connected ? 'text-blue-600' : 'text-gray-600',
      icon: null,
      dot: connected ? 'bg-blue-500' : 'bg-gray-500'
    };
  };

  const status = getStatusDisplay();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
      >
        <div className={`w-2 h-2 ${status.dot} rounded-full ${activeSession ? 'animate-pulse' : ''}`}></div>
        <span className={`text-sm font-medium ${status.color}`}>
          {status.text}
        </span>
        {status.icon && <status.icon className="w-4 h-4" />}
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <SessionDropdown onClose={() => setShowDropdown(false)} />
      )}
    </div>
  );
};

export default SessionStatus;