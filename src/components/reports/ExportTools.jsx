import { Download, FileText } from "lucide-react";

const ExportTools = () => {
    const exportFormats = [
      { id: 'pdf', name: 'PDF Report', icon: FileText },
      { id: 'csv', name: 'CSV Data Export', icon: Download },
      { id: 'excel', name: 'Excel Workbook', icon: FileText }
    ];
  
    const handleExport = (format) => {
      // Export logic would go here
      console.log(`Exporting in ${format} format`);
    };
  
    return (
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exportFormats.map((format) => (
            <button
              key={format.id}
              onClick={() => handleExport(format.id)}
              className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <format.icon className="w-5 h-5 mr-2" />
              <span>{format.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  export default ExportTools