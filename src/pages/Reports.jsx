import ReportGenerator from '../components/reports/ReportGenerator'
import ReportHistory from '../components/reports/ReportHistory'
import ExportTools from '../components/reports/ExportTools'
const Reports = () => (
    <div className="container mx-auto pt-16 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Analysis Reports</h2>
        <div className="space-y-6">
          <ReportGenerator />
          <ReportHistory />
          <ExportTools />
        </div>
      </div>
    </div>
  );

  export default Reports