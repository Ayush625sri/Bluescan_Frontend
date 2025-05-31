// src/components/session/FullscreenImageViewer.jsx
import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, Eye, EyeOff } from 'lucide-react';

const FullscreenImageViewer = ({ image, analysisResults, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [detectionBoxes, setDetectionBoxes] = useState([]);
  const imageRef = useRef(null);

  useEffect(() => {
    if (analysisResults) {
      generateDetectionBoxes();
    }
  }, [analysisResults]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const generateDetectionBoxes = () => {
    const boxes = [];
    const numBoxes = Math.floor(Math.random() * 8) + 3;

    for (let i = 0; i < numBoxes; i++) {
      const box = {
        id: i,
        x: Math.random() * 70 + 5,
        y: Math.random() * 70 + 5,
        width: Math.random() * 15 + 5,
        height: Math.random() * 15 + 5,
        type: ['microplastic', 'debris', 'algae', 'oil'][Math.floor(Math.random() * 4)],
        confidence: Math.floor(Math.random() * 30) + 70,
      };
      boxes.push(box);
    }
    setDetectionBoxes(boxes);
  };

  const getBoxColor = (type) => {
    const colors = {
      microplastic: 'border-red-500 bg-red-500/10',
      debris: 'border-orange-500 bg-orange-500/10',
      algae: 'border-green-500 bg-green-500/10',
      oil: 'border-purple-500 bg-purple-500/10',
    };
    return colors[type] || 'border-blue-500 bg-blue-500/10';
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.filename;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black z-50 "
      style={{ marginTop: '50px' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Header Controls - Fixed positioning with higher z-index */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-80 p-4 z-20">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h3 className="text-lg font-semibold">{image.filename}</h3>
            <p className="text-sm text-gray-300">
              Uploaded: {new Date(image.uploaded_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {analysisResults && (
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                title={showOverlay ? 'Hide Detection Overlay' : 'Show Detection Overlay'}
              >
                {showOverlay ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <span className="text-white text-sm px-2 bg-gray-700 rounded">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              disabled={zoom >= 3}
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <button
              onClick={handleRotate}
              className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            <button
              onClick={downloadImage}
              className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex items-center justify-center w-full h-full pt-20 pb-4">
        <div className="relative max-w-full max-h-full">
          <img
            ref={imageRef}
            src={image.url}
            alt={image.filename}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Detection Overlay */}
          {/* {showOverlay && analysisResults && (
            <div className="absolute inset-0 pointer-events-none">
              {detectionBoxes.map((box) => (
                <div
                  key={box.id}
                  className={`absolute border-2 ${getBoxColor(box.type)} rounded`}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {box.type} ({box.confidence}%)
                  </div>
                </div>
              ))}
            </div>
          )} */}
          {showOverlay && analysisResults && analysisResults.pollution_overlay && (
            <div className="absolute inset-0 pointer-events-none">
              {analysisResults.pollution_overlay.map((region) => (
                <div
                  key={region.id}
                  className="absolute border-2 border-red-500 bg-red-500/20 rounded"
                  style={{
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    width: `${region.width * 1}%`, // 60% smaller
                    height: `${region.height * 1}%`,
                    opacity: region.intensity / 100,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Polluted intensity ({region.intensity}%)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detection Legend */}
      {showOverlay && analysisResults && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg z-20">
          <h4 className="text-sm font-semibold mb-2">Detection Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 border border-red-500 bg-red-500/20 mr-2"></div>
              Microplastics
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border border-orange-500 bg-orange-500/20 mr-2"></div>
              Debris
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border border-green-500 bg-green-500/20 mr-2"></div>
              Algae
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border border-purple-500 bg-purple-500/20 mr-2"></div>
              Oil
            </div>
          </div>
          <p className="text-xs text-gray-300 mt-2">
            {detectionBoxes.length} objects detected
          </p>
        </div>
      )}

      {/* Close hint */}
      <div className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
        Press ESC or click X to close
      </div>
    </div>
  );
};

export default FullscreenImageViewer;