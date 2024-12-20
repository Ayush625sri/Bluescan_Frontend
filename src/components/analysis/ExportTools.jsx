const ExportTools = () => {
    const handleExport = (format) => {
      // Export logic here
      console.log(`Exporting in ${format} format`);
    };
  
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Export Tools</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Export as PDF Report</span>
            <button 
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export PDF
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span>Export Raw Data (CSV)</span>
            <button 
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export CSV
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span>Export Images</span>
            <button 
              onClick={() => handleExport('images')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Export Images
            </button>
          </div>
        </div>
      </div>
    );
  };

  
  export default ExportTools