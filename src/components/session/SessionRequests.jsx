// src/components/session/SessionRequests.jsx
import { useState, useEffect } from 'react';
import { useSession } from '../../contexts/SessionContext';
import { X, Check } from 'lucide-react';

const SessionRequests = () => {
  const { pendingRequests, respondToSession } = useSession();
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    setRequests(pendingRequests);
  }, [pendingRequests]);
  
  if (requests.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {requests.map((request) => (
        <div key={request.session_id} className="bg-white shadow-lg rounded-lg p-4 mb-2 border-l-4 border-blue-500">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">Session Request</h3>
            <button 
              onClick={() => respondToSession(request.session_id, false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            {request.device_name || 'A mobile device'} wants to start a live session with you.
          </p>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => respondToSession(request.session_id, false)}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Decline
            </button>
            <button
              onClick={() => respondToSession(request.session_id, true)}
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

export default SessionRequests;