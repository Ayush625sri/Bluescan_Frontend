import { useEffect, useRef } from 'react';
import { Play, Check, X, XCircle } from 'lucide-react';

const ContextMenu = ({ x, y, type, item, onClose, onRequestSession, onRespondToSession, onEndSession }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const getMenuItems = () => {
    switch (type) {
      case 'device':
        return [
          {
            label: 'Request Session',
            icon: Play,
            action: () => onRequestSession(item.device_id),
            disabled: !item.is_online
          }
        ];
      
      case 'request':
        return [
          {
            label: 'Accept Request',
            icon: Check,
            action: () => onRespondToSession(item.session_id, true),
            className: 'text-green-600 hover:bg-green-50'
          },
          {
            label: 'Decline Request',
            icon: XCircle,
            action: () => onRespondToSession(item.session_id, false),
            className: 'text-red-600 hover:bg-red-50'
          }
        ];
      
      case 'session':
        return [
          {
            label: 'End Session',
            icon: X,
            action: () => onEndSession(item.id),
            className: 'text-red-600 hover:bg-red-50'
          }
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[60] min-w-[150px]"
      style={{
        left: x,
        top: y,
        transform: 'translate(0, 0)'
      }}
    >
      {menuItems.map((menuItem, index) => (
        <button
          key={index}
          onClick={() => {
            if (!menuItem.disabled) {
              menuItem.action();
            }
            onClose();
          }}
          disabled={menuItem.disabled}
          className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 ${
            menuItem.disabled
              ? 'text-gray-400 cursor-not-allowed'
              : menuItem.className || 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <menuItem.icon className="w-4 h-4" />
          <span>{menuItem.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;