// src/pages/LiveSessionDashboard.jsx
import { useState, useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import LiveSession from '../components/session/LiveSession';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { Camera, Clock, User, ChevronRight, Link as LinkIcon } from 'lucide-react';
import { sessionApi } from '../utils/api';
import toast from 'react-hot-toast';

const LiveSessionDashboard = () => {
  const { user } = useAuth();
  const { connected, activeDevices, requestSession, activeSession } = useSession();
  const [showSession, setShowSession] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load sessions history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionsResponse = await sessionApi.getActiveSessions();
        
        setSessions(sessionsResponse.data.sessions || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        toast.error('Failed to load sessions');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Show active session when it's established
  useEffect(() => {
    if (activeSession) {
      setShowSession(true);
    } else {
      setShowSession(false);
    }
  }, [activeSession]);
  
  // Request a session with a device
  const handleRequestSession = async (deviceId) => {
    try {
      await requestSession(deviceId);
    } catch (error) {
      console.error('Failed to request session:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-6 pt-20">
        <div className="flex justify-center items-center h-64">
          <Loading size="large" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold mb-6">Live Sessions</h1>
      
      {showSession && (
        <LiveSession onClose={() => setShowSession(false)} />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connected Devices */}
        <Card title="Connected Devices" className="col-span-1">
          {!connected && (
            <div className="py-4 px-3 bg-yellow-50 text-yellow-800 rounded mb-4">
              <p>Connecting to session server...</p>
            </div>
          )}
          
          {connected && activeDevices.length === 0 ? (
            <div className="py-8 text-center">
              <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No devices connected</p>
              <p className="text-sm text-gray-400 mt-1">Install the mobile app to connect your device</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeDevices.map((device) => (
                <div key={device.device_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{device.device_name}</p>
                      <p className="text-sm text-gray-500">Last active: {new Date(device.last_active).toLocaleString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRequestSession(device.device_id)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Start <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        {/* Recent Sessions */}
        <Card title="Recent Sessions" className="col-span-1">
          {sessions.length === 0 ? (
            <div className="py-8 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No recent sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-full mr-3">
                      <Camera className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Session with {session.device_name}</p>
                      <p className="text-sm text-gray-500">{new Date(session.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    session.status === 'active' ? 'bg-green-100 text-green-800' :
                    session.status === 'ended' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LiveSessionDashboard;