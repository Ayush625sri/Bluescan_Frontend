import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  const handleUpload = async () => {
    setUploading(true);
    try {
      // Upload logic here
      await Promise.all(
        files.map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          // return axios.post('/api/upload', formData);
        })
      );
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Upload Images</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={file.preview}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      )}
    </div>
  );
};
export default ImageUploader;
