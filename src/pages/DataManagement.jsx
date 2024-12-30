import { Download, Filter, Trash2 } from "lucide-react";
import { useState } from "react";

const DataManagement = () => {
  const [datasets] = useState([
    {
      id: 1,
      name: "Coastal Pollution Data 2024",
      type: "Pollution Analysis",
      size: "2.5 GB",
      lastUpdated: new Date(),
      status: "active",
    },
    {
      id: 2,
      name: "Microplastics Distribution",
      type: "Research Data",
      size: "1.8 GB",
      lastUpdated: new Date(Date.now() - 86400000),
      status: "archived",
    },
    // Add more datasets as needed
  ]);

  return (
    <div className="container mx-auto pt-16 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Data Management</h2>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <select className="rounded-md border-gray-300 p-2">
            <option>All Types</option>
            <option>Pollution Analysis</option>
            <option>Research Data</option>
            <option>Raw Data</option>
          </select>

          <select className="rounded-md border-gray-300 p-2">
            <option>All Status</option>
            <option>Active</option>
            <option>Archived</option>
          </select>

          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </button>
        </div>

        {/* Datasets Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {datasets.map((dataset) => (
                <tr key={dataset.id}>
                  <td className="px-6 py-4">{dataset.name}</td>
                  <td className="px-6 py-4">{dataset.type}</td>
                  <td className="px-6 py-4">{dataset.size}</td>
                  <td className="px-6 py-4">
                    {new Date(dataset.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        dataset.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {dataset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
