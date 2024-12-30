import {
  AlertTriangle,
  BarChart2,
  Download,
  Filter,
  MapPin,
  Settings,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
/* eslint-disable no-unused-vars */
const OceanPollutionPlatform = () => {
  // State Management
  const [uploadedImages, setUploadedImages] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [pollutionHotspots, setPollutionHotspots] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Image Upload Handler
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    setUploadedImages((prevImages) => [
      ...prevImages,
      ...imageFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploadDate: new Date(),
      })),
    ]);
  };

  // Pollution Analysis Simulation
  const performPollutionAnalysis = (image) => {
    return {
      pollutionLevel: Math.random() * 100,
      plasticDetected: Math.random() > 0.5,
      chemicalContamination: Math.random() * 50,
      coordinates: [Math.random() * 180 - 90, Math.random() * 360 - 180],
    };
  };

  // Pollution Hotspots Data
  useEffect(() => {
    const hotspots = uploadedImages.map((image) =>
      performPollutionAnalysis(image)
    );
    setPollutionHotspots(hotspots);
  }, [uploadedImages]);

  // Pollution Trend Data
  const pollutionTrendData = [
    { month: "Jan", pollution: 40 },
    { month: "Feb", pollution: 30 },
    { month: "Mar", pollution: 20 },
    { month: "Apr", pollution: 50 },
    { month: "May", pollution: 60 },
  ];

  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <AlertTriangle className="mr-3 text-red-500" />
        Ocean Pollution Detection Platform
      </h1>

      {/* Image Upload Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <Upload className="mr-2" />
          <h2 className="text-xl font-semibold">Upload Satellite Images</h2>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        <div className="flex overflow-x-auto space-x-4">
          {uploadedImages.map((image, index) => (
            <img
              key={index}
              src={image.preview}
              alt={`Uploaded ${index}`}
              className="h-32 w-48 object-cover rounded"
            />
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex mb-4 space-x-4">
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setSelectedFilter("map")}
        >
          <MapPin className="mr-2" /> Pollution Map
        </button>
        <button
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => setSelectedFilter("trends")}
        >
          <BarChart2 className="mr-2" /> Pollution Trends
        </button>
        <button
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => setSelectedFilter("hotspots")}
        >
          <AlertTriangle className="mr-2" /> Hotspots
        </button>
      </div>

      {/* Map Simulation */}
      {selectedFilter === "map" && (
        <div className="bg-gray-100 h-[500px] flex items-center justify-center rounded-lg">
          <div className="text-center">
            <MapPin size={64} className="mx-auto mb-4 text-blue-500" />
            <p className="text-xl">Interactive Map Placeholder</p>
            <p className="text-gray-600">Actual map integration coming soon</p>
          </div>
        </div>
      )}

      {/* Trends Simulation */}
      {selectedFilter === "trends" && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="mr-2 text-green-500" />
            <h2 className="text-xl font-semibold">Pollution Trends</h2>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {pollutionTrendData.map((trend, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded text-center">
                <p className="font-bold">{trend.month}</p>
                <p className="text-blue-600">{trend.pollution}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hotspots Simulation */}
      {selectedFilter === "hotspots" && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="mr-2 text-red-500" />
            <h2 className="text-xl font-semibold">Pollution Hotspots</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {pollutionHotspots.map((spot, index) => (
              <div key={index} className="border p-4 rounded bg-gray-50">
                <h3 className="font-bold mb-2">Hotspot {index + 1}</h3>
                <p>Pollution Level: {spot.pollutionLevel.toFixed(2)}%</p>
                <p>
                  Chemical Contamination:{" "}
                  {spot.chemicalContamination.toFixed(2)}
                </p>
                <p>Coordinates: {spot.coordinates.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtering Section */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Filter className="mr-2" />
          <h2 className="text-xl font-semibold">Advanced Filters</h2>
        </div>
        <div className="flex space-x-4">
          <select
            className="p-2 border rounded w-full"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All Data</option>
            <option value="plastic">Plastic Pollution</option>
            <option value="chemical">Chemical Contamination</option>
            <option value="microplastics">Microplastics</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          <Download className="mr-2" /> Export Report
        </button>
        <button className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          <Settings className="mr-2" /> Platform Settings
        </button>
      </div>
    </div>
  );
};

export default OceanPollutionPlatform;
