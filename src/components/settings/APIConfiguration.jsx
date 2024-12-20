import { Code } from 'lucide-react';
import { useState } from 'react';

const APIConfiguration = () => {
  const [apiConfig, setApiConfig] = useState({
    apiKey: '********-****-****-****-************',
    endpoint: 'https://api.example.com/v1',
    rateLimit: '1000',
    timeout: '30'
  });

  const generateNewKey = () => {
    // API key generation logic would go here
    console.log('Generating new API key');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center">
        <Code className="w-5 h-5 mr-2" />
        API Configuration
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiConfig.apiKey}
              readOnly
              className="flex-1 rounded-md border-gray-300 bg-gray-50"
            />
            <button
              type="button"
              onClick={generateNewKey}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Generate New Key
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Endpoint
          </label>
          <input
            type="text"
            value={apiConfig.endpoint}
            onChange={(e) => setApiConfig(prev => ({
              ...prev,
              endpoint: e.target.value
            }))}
            className="w-full rounded-md border-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate Limit (requests/hour)
            </label>
            <input
              type="number"
              value={apiConfig.rateLimit}
              onChange={(e) => setApiConfig(prev => ({
                ...prev,
                rateLimit: e.target.value
              }))}
              className="w-full rounded-md border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeout (seconds)
            </label>
            <input
              type="number"
              value={apiConfig.timeout}
              onChange={(e) => setApiConfig(prev => ({
                ...prev,
                timeout: e.target.value
              }))}
              className="w-full rounded-md border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIConfiguration