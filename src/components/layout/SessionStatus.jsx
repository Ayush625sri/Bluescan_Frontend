import { useState, useEffect } from 'react';
import { useSession } from '../../contexts/SessionContext';
import { Link } from 'react-router-dom';
import { Video, AlertCircle } from 'lucide-react';

const SessionStatus = () => {
  const { connected, activeDevices, pendingRequests, activeSession } = useSession();
  
  if (activeSession) {
    return (
      <div className="flex items-center">
        <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        <Link 
          to="/sessions"
          className="text-green-600 font-medium flex items-center"
        >
          <Video className="w-4 h-4 mr-1" />
          Live Session Active
        </Link>
      </div>
    );
  }
  
  if (pendingRequests.length > 0) {
    return (
      <div className="flex items-center">
        <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
        <Link 
          to="/sessions"
          className="text-yellow-600 font-medium flex items-center"
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          {pendingRequests.length} Pending Request{pendingRequests.length > 1 ? 's' : ''}
        </Link>
      </div>
    );
  }
  
  if (connected && activeDevices.length > 0) {
    return (
      <div className="flex items-center">
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
        <Link 
          to="/sessions"
          className="text-blue-600 font-medium"
        >
          {activeDevices.length} Device{activeDevices.length > 1 ? 's' : ''} Connected
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex items-center">
      <div className={`w-2 h-2 ${connected ? 'bg-blue-500' : 'bg-gray-500'} rounded-full mr-2`}></div>
      <span className={`text-sm ${connected ? 'text-blue-600' : 'text-gray-600'}`}>
        {connected ? 'Connected' : 'Connecting...'}
      </span>
    </div>
  );
};

export default SessionStatus;