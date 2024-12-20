import { useState } from 'react';
import { FileText, Calendar, Filter, Download } from 'lucide-react';

const ReportGenerator = () => {
  const [reportConfig, setReportConfig] = useState({
    dateRange: 'week',
    pollutionType: 'all',
    format: 'pdf',
    includeCharts: true,
    includeMetrics: true,
  });

  const handleConfigChange = (key, value) => {
    setReportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateReport = async () => {
    try {
      // API call would go here
      console.log('Generating report with config:', reportConfig);
    } catch (error) {
      console.error('Report generation failed:', error);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileText className="mr-2" />
        Generate New Report
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <select
            value={reportConfig.dateRange}
            onChange={(e) => handleConfigChange('dateRange', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pollution Type</label>
          <select
            value={reportConfig.pollutionType}
            onChange={(e) => handleConfigChange('pollutionType', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2"
          >
            <option value="all">All Types</option>
            <option value="microplastics">Microplastics</option>
            <option value="chemical">Chemical Pollution</option>
            <option value="debris">Marine Debris</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={reportConfig.includeCharts}
            onChange={(e) => handleConfigChange('includeCharts', e.target.checked)}
            className="rounded border-gray-300 text-blue-600"
          />
          <span className="ml-2 text-sm">Include Charts</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={reportConfig.includeMetrics}
            onChange={(e) => handleConfigChange('includeMetrics', e.target.checked)}
            className="rounded border-gray-300 text-blue-600"
          />
          <span className="ml-2 text-sm">Include Metrics</span>
        </label>
      </div>

      <button
        onClick={generateReport}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Generate Report
      </button>
    </div>
  );
};

export default ReportGenerator