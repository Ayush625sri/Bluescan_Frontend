import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const SessionNotification = () => {
  const { sessionState, respondToSessionRequest } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  
  useEffect(() => {
    if (sessionState.pendingRequests) {
      setPendingRequests(sessionState.pendingRequests);
    }
  }, [sessionState]);
  
  const handleResponse = (sessionId, accepted) => {
    respondToSessionRequest(sessionId, accepted);
    setPendingRequests(prev => prev.filter(req => req.session_id !== sessionId));
    
    if (accepted) {
      toast.success('Session request accepted');
    } else {
      toast.error('Session request declined');
    }
  };
  
  if (pendingRequests.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {pendingRequests.map(request => (
        <div key={request.session_id} className="bg-white shadow-lg rounded-lg p-4 mb-2">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">Session Request</h3>
            <button 
              onClick={() => handleResponse(request.session_id, false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            {request.device_name || 'Someone'} wants to start a live session with you.
          </p>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => handleResponse(request.session_id, false)}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Decline
            </button>
            <button
              onClick={() => handleResponse(request.session_id, true)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionNotification;