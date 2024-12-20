const HotspotsList = ({ hotspots = [] }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Pollution Hotspots</h2>
        <div className="space-y-4">
          {hotspots.map((hotspot, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Location {index + 1}</h3>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  hotspot.severity === 'high' ? 'bg-red-100 text-red-800' :
                  hotspot.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {hotspot.severity}
                </span>
              </div>
              <p className="text-sm text-gray-600">Coordinates: {hotspot.coordinates}</p>
              <p className="text-sm text-gray-600">Pollution Level: {hotspot.level}%</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  export default HotspotsList