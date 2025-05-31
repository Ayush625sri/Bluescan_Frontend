
import { useState, useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import LiveSession from '../components/session/LiveSession';
import ImageUploadPanel from '../components/session/ImageUploadPanel';
import ImageAnalysisPanel from '../components/session/ImageAnalysisPanel';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { Camera, Clock, User, ChevronRight, Link as LinkIcon, Upload, Eye } from 'lucide-react';
import { sessionApi } from '../utils/api';
import toast from 'react-hot-toast';
import { getSessionData, saveImageToSession } from '../utils/sessionStorage';
const LiveSessionDashboard = () => {
  const { user } = useAuth();
  const {
    connected,
    activeDevices,
    requestSession,
    activeSession,
    activeSessions,
    endedSessions,
    loadSessionData
  } = useSession();

  const [showSession, setShowSession] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // // Load sessions on mount
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await loadSessionData();
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Failed to fetch sessions:', error);
  //       toast.error('Failed to load sessions');
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [loadSessionData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadSessionData();

        // Load images from session storage
        const sessionData = getSessionData();
        setUploadedImages(sessionData.images || []);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        toast.error('Failed to load sessions');
        setLoading(false);
      }
    };

    fetchData();
  }, [loadSessionData]);

  // Show active session when established
  useEffect(() => {
    if (activeSession) {
      setShowSession(true);
    } else {
      setShowSession(false);
    }
  }, [activeSession]);

  const handleRequestSession = async (deviceId) => {
    try {
      await requestSession(deviceId);
    } catch (error) {
      console.error('Failed to request session:', error);
    }
  };

  const handleImageUploaded = (imageData) => {
    setUploadedImages(prev => [...prev, imageData]);
    toast.success('Image uploaded successfully');
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const seconds = Math.abs(parseFloat(duration));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const allSessions = [...activeSessions, ...endedSessions.slice(0, 10)];

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Live Sessions</h1>
        <button
          onClick={() => setShowImageUpload(!showImageUpload)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Images
        </button>
      </div>

      {showSession && (
        <LiveSession onClose={() => setShowSession(false)} />
      )}

      {showImageUpload && (
        <div className="mb-6">
          <ImageUploadPanel
            onImageUploaded={handleImageUploaded}
            onClose={() => setShowImageUpload(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <div className="max-h-96 overflow-y-auto space-y-3">
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

        {/* Uploaded Images */}
        <Card title="Uploaded Images" className="col-span-1">
          {uploadedImages.length === 0 ? (
            <div className="py-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No images uploaded</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden ${selectedImage?.id === image.id ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  onClick={() => handleImageSelect(image)}
                >
                  <img
                    src={image.url}
                    alt="Uploaded"
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-xs text-gray-500 truncate">{image.filename}</p>
                    <p className="text-xs text-gray-400">{new Date(image.uploaded_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Water Quality Analysis */}
        <Card title="Water Quality Analysis" className="col-span-1">
          {selectedImage ? (
            <ImageAnalysisPanel
              image={selectedImage}
              onAnalysisComplete={(results) => {
                toast.success('Analysis completed');
                console.log('Analysis results:', results);
              }}
            />
          ) : (
            <div className="py-8 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">Select an image to analyze</p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Sessions */}
      <div className="mt-6">
        <Card title="Recent Sessions">
          {allSessions.length === 0 ? (
            <div className="py-8 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No recent sessions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSessions.map((session) => (
                <div key={session.session_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${session.is_active ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                      <Camera className={`h-5 w-5 ${session.is_active ? 'text-green-600' : 'text-gray-600'
                        }`} />
                    </div>
                    <div>
                      <div className="flex items-center">
                        {session.is_active && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                        )}
                        <p className="font-medium">
                          {session.partner?.name || 'Unknown Partner'}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {session.is_active ? (
                          `Started: ${new Date(session.start_time).toLocaleString()}`
                        ) : (
                          `Duration: ${formatDuration(session.duration)} • ${new Date(session.start_time).toLocaleDateString()}`
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${session.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {session.is_active ? 'active' : 'ended'}
                    </span>
                    {!session.is_active && (
                      <button
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
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