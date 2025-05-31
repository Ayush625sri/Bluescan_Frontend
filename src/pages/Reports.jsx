// import ReportGenerator from '../components/reports/ReportGenerator'
// import ReportHistory from '../components/reports/ReportHistory'
// import ExportTools from '../components/reports/ExportTools'
// const Reports = () => (
//     <div className="container mx-auto pt-16 p-6">
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-2xl font-bold mb-6">Analysis Reports</h2>
//         <div className="space-y-6">
//           <ReportGenerator />
//           <ReportHistory />
//           <ExportTools />
//         </div>
//       </div>
//     </div>
//   );

//   export default Reports
// src/pages/Reports.jsx
import { useState, useEffect } from 'react';
import ReportGenerator from '../components/reports/ReportGenerator';
import ReportHistory from '../components/reports/ReportHistory';
import ExportTools from '../components/reports/ExportTools';
import { getSessionData } from '../utils/sessionStorage';

const Reports = () => {
  const [sessionData, setSessionData] = useState({ images: [], analyses: [] });

  useEffect(() => {
    setSessionData(getSessionData());
  }, []);

  return (
    <div className="container mx-auto pt-16 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Analysis Reports</h2>
        
        {/* Session Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Current Session Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Images Analyzed:</span>
              <span className="font-medium ml-2">{sessionData.images.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Analyses Completed:</span>
              <span className="font-medium ml-2">{sessionData.analyses.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Avg Water Quality:</span>
              <span className="font-medium ml-2">
                {sessionData.analyses.length > 0 
                  ? Math.round(sessionData.analyses.reduce((sum, a) => sum + a.water_quality.overall_score, 0) / sessionData.analyses.length)
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* <ReportGenerator sessionData={sessionData} /> */}
          <ReportHistory sessionData={sessionData} />
          <ExportTools sessionData={sessionData} />
        </div>
      </div>
    </div>
  );
};

export default Reports;