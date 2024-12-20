import { useState, useEffect } from 'react';
import { BarChart2, Droplet, Wind, ThermometerSun } from 'lucide-react';

const AnalysisResults = ({ data }) => {
  const [results, setResults] = useState({
    plasticDensity: 0,
    waterQuality: 0,
    pollutantTypes: [],
    confidenceScore: 0
  });

  useEffect(() => {
    if (data) {
      setResults(data);
    }
  }, [data]);

  const metrics = [
    {
      title: "Plastic Density",
      value: `${results.plasticDensity || 0}%`,
      icon: <BarChart2 className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "Water Quality",
      value: `${results.waterQuality || 0}%`,
      icon: <Droplet className="w-6 h-6 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "Pollutant Types",
      value: results.pollutantTypes?.length || 0,
      icon: <Wind className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50"
    },
    {
      title: "Confidence Score",
      value: `${results.confidenceScore || 0}%`,
      icon: <ThermometerSun className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-50"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className={`${metric.color} p-4 rounded-lg`}>
            <div className="flex items-center justify-between mb-2">
              {metric.icon}
              <span className="text-2xl font-bold">{metric.value}</span>
            </div>
            <p className="text-gray-600">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Detailed Analysis */}
      <div className="space-y-6">
        {results.pollutantTypes?.map((pollutant, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{pollutant.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                pollutant.severity === 'high' ? 'bg-red-100 text-red-800' :
                pollutant.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {pollutant.severity}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{pollutant.description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${pollutant.concentration}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResults