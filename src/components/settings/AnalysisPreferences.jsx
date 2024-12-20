import { Sliders } from 'lucide-react';
import { useState } from 'react';

const AnalysisPreferences = () => {
  const [preferences, setPreferences] = useState({
    detectionThreshold: 70,
    autoAnalysis: true,
    pollutionTypes: ['microplastics', 'chemical'],
    confidenceLevel: 'high'
  });

  return (
    <div className="space-y-6 pb-6 border-b">
      <h3 className="text-lg font-semibold flex items-center">
        <Sliders className="w-5 h-5 mr-2" />
        Analysis Preferences
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detection Threshold
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={preferences.detectionThreshold}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              detectionThreshold: e.target.value
            }))}
            className="w-full"
          />
          <div className="text-sm text-gray-500 mt-1">
            {preferences.detectionThreshold}%
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confidence Level
          </label>
          <select
            value={preferences.confidenceLevel}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              confidenceLevel: e.target.value
            }))}
            className="w-full rounded-md border-gray-300 shadow-sm p-1 px-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.autoAnalysis}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                autoAnalysis: e.target.checked
              }))}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Enable automatic analysis
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};


export default AnalysisPreferences