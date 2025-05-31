// src/components/analysis/AnalysisResults.jsx
import { useState, useEffect } from 'react';
import { BarChart2, Droplet, Wind, ThermometerSun } from 'lucide-react';

const AnalysisResults = ({ data = [] }) => {
  const [aggregatedResults, setAggregatedResults] = useState({
    averageWaterQuality: 0,
    totalAnalyses: 0,
    pollutantTypes: [],
    confidenceScore: 0
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const avgQuality = data.reduce((sum, item) => sum + item.water_quality.overall_score, 0) / data.length;
      const avgConfidence = data.reduce((sum, item) => sum + item.analysis_confidence, 0) / data.length;
      
      const pollutants = [];
      data.forEach(item => {
        if (item?.pollution_detected?.microplastics.detected) {
          pollutants.push({ name: 'Microplastics', severity: 'high', concentration: item?.pollution_detected?.microplastics.concentration });
        }
        if (item?.pollution_detected?.chemical_pollutants.detected) {
          pollutants.push({ name: 'Chemical Pollutants', severity: item?.pollution_detected?.chemical_pollutants.severity, concentration: 50 });
        }
      });

      setAggregatedResults({
        averageWaterQuality: Math.round(avgQuality),
        totalAnalyses: data.length,
        pollutantTypes: pollutants,
        confidenceScore: Math.round(avgConfidence)
      });
    }
  }, [data]);

  const metrics = [
    {
      title: "Average Water Quality",
      value: `${aggregatedResults.averageWaterQuality}%`,
      icon: <Droplet className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "Total Analyses",
      value: aggregatedResults.totalAnalyses,
      icon: <BarChart2 className="w-6 h-6 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "Pollutants Found",
      value: aggregatedResults.pollutantTypes.length,
      icon: <Wind className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50"
    },
    // {
    //   title: "Avg Confidence",
    //   value: `${aggregatedResults.confidenceScore}%`,
    //   icon: <ThermometerSun className="w-6 h-6 text-orange-500" />,
    //   color: "bg-orange-50"
    // }
  ];

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No analyses performed yet. Upload and analyze images to see results.</p>
        </div>
      </div>
    );
  }

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

      {/* Individual Analysis Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Individual Analysis Results</h3>
        {data.map((analysis, index) => (
          <div key={analysis.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Analysis #{index + 1}</h4>
              <span className="text-sm text-gray-500">
                {new Date(analysis.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Water Quality:</span>
                <span className="font-medium ml-2">{analysis.water_quality.overall_score}%</span>
              </div>
              <div>
                <span className="text-gray-600">pH Level:</span>
                <span className="font-medium ml-2">{analysis.water_quality.ph_level}</span>
              </div>
              <div>
                <span className="text-gray-600">Turbidity:</span>
                <span className="font-medium ml-2">{analysis.water_quality.turbidity} NTU</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResults;