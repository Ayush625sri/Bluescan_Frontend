// src/components/session/LiveSession.jsx
import { useState, useEffect, useRef } from 'react';
import { useSession } from '../../contexts/SessionContext';
import { Camera, Mic, MicOff, Video, VideoOff, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';

const LiveSession = ({ onClose }) => {
  const { activeSession, endSession, webrtcService } = useSession();
  const [mediaState, setMediaState] = useState({
    videoEnabled: true,
    audioEnabled: true
  });
  const [capturedImages, setCapturedImages] = useState([]);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  // Set up video elements when session is active
  useEffect(() => {
    if (!activeSession) {
      onClose();
      return;
    }
    
    // Set up local video
    if (localVideoRef.current && webrtcService.localStream) {
      localVideoRef.current.srcObject = webrtcService.localStream;
    }
    
    // Handle remote streams
    const handleRemoteStream = (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };
    
    // Handle data channel messages
    const handleDataMessage = (data) => {
      if (data.startsWith('data:image/')) {
        const timestamp = new Date().toISOString();
        setCapturedImages(prev => [...prev, {
          id: timestamp,
          src: data,
          timestamp
        }]);
        
        toast.success('New image received');
      }
    };
    
    // Set up WebRTC callbacks
    webrtcService.setCallbacks({
      ...webrtcService.callbacks,
      onTrack: handleRemoteStream,
      onDataChannelMessage: handleDataMessage
    });
    
    // Cleanup on unmount
    return () => {
      // Nothing to do here as the full cleanup happens in the SessionContext
    };
  }, [activeSession, onClose, webrtcService]);
  
  // Toggle video/audio
  const toggleVideo = () => {
    const enabled = !mediaState.videoEnabled;
    if (webrtcService.toggleVideo(enabled)) {
      setMediaState(prev => ({ ...prev, videoEnabled: enabled }));
    }
  };
  
  const toggleAudio = () => {
    const enabled = !mediaState.audioEnabled;
    if (webrtcService.toggleAudio(enabled)) {
      setMediaState(prev => ({ ...prev, audioEnabled: enabled }));
    }
  };
  
  // Capture image from remote stream
  const captureImage = () => {
    if (!remoteVideoRef.current) return;
    
    try {
      const imageData = webrtcService.captureImage(remoteVideoRef.current);
      const timestamp = new Date().toISOString();
      
      setCapturedImages(prev => [...prev, {
        id: timestamp,
        src: imageData,
        timestamp
      }]);
      
      toast.success('Image captured');
    } catch (error) {
      console.error('Failed to capture image:', error);
      toast.error('Failed to capture image');
    }
  };
  
  // Handle session end
  const handleEndSession = () => {
    endSession();
    onClose();
  };
  
  if (!activeSession) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Live Session {activeSession.status === 'connecting' ? '(Connecting...)' : ''}
          </h2>
          <button onClick={handleEndSession} className="text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row h-full">
          {/* Video area */}
          <div className="flex-1 bg-gray-900 p-2 relative flex flex-col justify-center">
            {activeSession.status === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
              </div>
            )}
            
            {/* Remote video (main) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full rounded object-contain"
            />
            
            {/* Local video (picture-in-picture) */}
            <div className="absolute bottom-4 right-4 w-1/4 border-2 border-white rounded overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full"
              />
            </div>
            
            {/* Controls */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <button 
                onClick={toggleVideo}
                className={`p-3 rounded-full ${mediaState.videoEnabled ? 'bg-blue-600' : 'bg-red-600'} text-white`}
              >
                {mediaState.videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={toggleAudio}
                className={`p-3 rounded-full ${mediaState.audioEnabled ? 'bg-blue-600' : 'bg-red-600'} text-white`}
              >
                {mediaState.audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={captureImage}
                className="p-3 rounded-full bg-green-600 text-white"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Captured images sidebar */}
          <div className="w-full md:w-72 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Captured Images</h3>
              
              {capturedImages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No images captured yet</p>
              ) : (
                <div className="space-y-4">
                  {capturedImages.map(image => (
                    <div key={image.id} className="border rounded overflow-hidden">
                      <img src={image.src} alt="Captured" className="w-full" />
                      <div className="p-2 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {new Date(image.timestamp).toLocaleTimeString()}
                        </div>
                        <a 
                          href={image.src} 
                          download={`image-${image.id}.jpg`}
                          className="text-blue-600"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;