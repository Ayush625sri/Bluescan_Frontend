const ReportHistory = () => {
    const reports = [
      {
        id: 1,
        title: 'Monthly Analysis Report',
        date: '2024-03-15',
        type: 'Comprehensive',
        status: 'completed'
      },
      {
        id: 2,
        title: 'Microplastics Analysis',
        date: '2024-03-10',
        type: 'Focused',
        status: 'completed'
      },
      {
        id: 3,
        title: 'Weekly Pollution Report',
        date: '2024-03-08',
        type: 'Summary',
        status: 'processing'
      }
    ];
  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Report History</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  export default ReportHistory