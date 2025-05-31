// src/components/reports/ReportHistory.jsx
const ReportHistory = ({ sessionData }) => {
  if (!sessionData || sessionData.analyses.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Analysis History</h3>
        <div className="text-center py-8 text-gray-500">
          No analyses performed yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Analysis History ({sessionData.analyses.length})</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Analysis ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Water Quality
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pollutants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessionData.analyses.map((analysis, index) => (
              <tr key={analysis.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  #{index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(analysis.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    analysis.water_quality.overall_score >= 70 ? 'bg-green-100 text-green-800' :
                    analysis.water_quality.overall_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {analysis.water_quality.overall_score}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {analysis.pollution_detected?.microplastics.detected ? 'Microplastics ' : ''}
                  {analysis.pollution_detected?.chemical_pollutants.detected ? 'Chemicals ' : ''}
                  {!analysis.pollution_detected?.microplastics.detected && 
                   !analysis.pollution_detected?.chemical_pollutants.detected ? 'None detected' : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {analysis.analysis_confidence}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportHistory;