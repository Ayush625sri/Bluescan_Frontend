import { useState, useRef } from 'react';
import { useSession } from '../../contexts/SessionContext';
import { Smartphone, Monitor, Clock, Play, X, Check, XCircle, Eye } from 'lucide-react';
import ContextMenu from './ContextMenu';

const SessionDropdown = ({ onClose }) => {
  const { 
    connected, 
    activeDevices, 
    pendingRequests, 
    activeSession, 
    activeSessions,
    endedSessions,
    requestSession, 
    respondToSession, 
    endSession 
  } = useSession();
  const [contextMenu, setContextMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('devices');

  const handleContextMenu = (e, type, item) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      item
    });
  };

  const handleRequestSession = async (deviceId) => {
    try {
      await requestSession(deviceId);
      setContextMenu(null);
    } catch (error) {
      console.error('Failed to request session:', error);
    }
  };

  const handleRespondToSession = async (requestId, accepted) => {
    try {
      await respondToSession(requestId, accepted);
      setContextMenu(null);
    } catch (error) {
      console.error('Failed to respond to session:', error);
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await endSession(sessionId);
      setContextMenu(null);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const seconds = Math.abs(parseFloat(duration));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const allSessions = [...activeSessions, ...endedSessions];
  
  const tabs = [
    { id: 'devices', label: 'Devices', count: activeDevices.length },
    { id: 'requests', label: 'Requests', count: pendingRequests.length },
    { id: 'sessions', label: 'Sessions', count: allSessions.length }
  ];

  return (
    <>
      <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
        {/* Header */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Session Manager</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-64 overflow-y-auto">
          {activeTab === 'devices' && (
            <div className="p-2">
              {!connected ? (
                <div className="text-center py-4 text-gray-500">
                  <span className="text-sm">Connecting to session server...</span>
                </div>
              ) : activeDevices.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-sm">No devices connected</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {activeDevices.map(device => (
                    <div
                      key={device.device_id}
                      className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                      onContextMenu={(e) => handleContextMenu(e, 'device', device)}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {device.device_type === 'mobile' ? (
                          <Smartphone className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Monitor className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {device.device_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last active: {new Date(device.last_active).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${device.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="p-2">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-sm">No pending requests</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {pendingRequests.map(request => (
                    <div
                      key={request.request_id}
                      className="p-2 rounded border border-yellow-200 bg-yellow-50"
                      onContextMenu={(e) => handleContextMenu(e, 'request', request)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {request.from_user?.name || 'Unknown Device'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={() => handleRespondToSession(request.request_id, true)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                            title="Accept"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRespondToSession(request.request_id, false)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Decline"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="p-2">
              {allSessions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-sm">No sessions</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Active Sessions */}
                  {activeSessions.map(session => (
                    <div
                      key={session.session_id}
                      className="p-2 rounded border border-green-200 bg-green-50"
                      onContextMenu={(e) => handleContextMenu(e, 'session', session)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                            <p className="text-sm font-medium text-gray-900">
                              {session.partner?.name || 'Unknown Partner'}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Active • Started: {new Date(session.start_time).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEndSession(session.session_id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="End Session"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Ended Sessions */}
                  {endedSessions.slice(0, 5).map(session => (
                    <div
                      key={session.session_id}
                      className="p-2 rounded border border-gray-200 bg-gray-50"
                      onContextMenu={(e) => handleContextMenu(e, 'ended_session', session)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                            <p className="text-sm font-medium text-gray-700">
                              {session.partner?.name || 'Unknown Partner'}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Ended • Duration: {formatDuration(session.duration)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(session.start_time).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          item={contextMenu.item}
          onClose={() => setContextMenu(null)}
          onRequestSession={handleRequestSession}
          onRespondToSession={handleRespondToSession}
          onEndSession={handleEndSession}
        />
      )}
    </>
  );
};

export default SessionDropdown;