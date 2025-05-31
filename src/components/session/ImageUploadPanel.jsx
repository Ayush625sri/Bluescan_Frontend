// src/components/session/ImageUploadPanel.jsx
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check } from 'lucide-react';
import { sessionApi } from '../../utils/api';
import toast from 'react-hot-toast';
import { saveImageToSession } from '../../utils/sessionStorage';

const ImageUploadPanel = ({ onImageUploaded, onClose }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prev => [
      ...prev,
      ...imageFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending'
      }))
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    multiple: true
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // const uploadFiles = async () => {
  //   if (files.length === 0) return;

  //   setUploading(true);
  //   try {
  //     for (const fileObj of files) {
  //       const formData = new FormData();
  //       formData.append('file', fileObj.file);
  //       formData.append('description', `Manual upload - ${fileObj.file.name}`);

  //       // Mock session ID for now - in real app, this would be from active session or manual upload endpoint
  //       const sessionId = 'manual-upload-' + Date.now();

  //       // Simulate API call
  //       await new Promise(resolve => setTimeout(resolve, 1000));

  //       // Mock response
  //       const mockResponse = {
  //         id: `img-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  //         filename: fileObj.file.name,
  //         url: fileObj.preview,
  //         uploaded_at: new Date().toISOString(),
  //         session_id: sessionId
  //       };

  //       onImageUploaded(mockResponse);
  //     }

  //     setFiles([]);
  //     toast.success(`${files.length} image(s) uploaded successfully`);
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //     toast.error('Failed to upload images');
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const fileObj of files) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const imageData = {
          id: `img-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          filename: fileObj.file.name,
          url: fileObj.preview,
          uploaded_at: new Date().toISOString(),
          size: fileObj.file.size,
          session_id: 'manual-upload-' + Date.now()
        };

        // Save to session storage
        saveImageToSession(imageData);

        // Notify parent component
        onImageUploaded(imageData);
      }

      setFiles([]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upload Images for Analysis</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the images here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">Drag & drop images here, or click to select</p>
            <p className="text-sm text-gray-500">Supports: JPEG, PNG, BMP, TIFF</p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Selected Files ({files.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {files.map((fileObj, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden">
                <img
                  src={fileObj.preview}
                  alt={`Preview ${index}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{fileObj.file.name}</p>
                  <p className="text-xs text-gray-500">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setFiles([])}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Clear All
            </button>
            <button
              onClick={uploadFiles}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {uploading ? 'Uploading...' : 'Upload All'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadPanel;