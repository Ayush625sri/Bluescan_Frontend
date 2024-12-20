import { useState } from "react";

const DataFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    dateRange: "week",
    pollutionType: "all",
    severity: "all",
    location: "",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Date Range</label>
        <select
          className="w-full rounded-md border-gray-300 p-2"
          value={filters.dateRange}
          onChange={(e) => handleFilterChange("dateRange", e.target.value)}
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Pollution Type</label>
        <select
          className="w-full rounded-md border-gray-300 p-2"
          value={filters.pollutionType}
          onChange={(e) => handleFilterChange("pollutionType", e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="microplastics">Microplastics</option>
          <option value="chemical">Chemical Pollution</option>
          <option value="oil">Oil Spills</option>
          <option value="debris">Marine Debris</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Severity</label>
        <select
          className="w-full rounded-md border-gray-300 p-2"
          value={filters.severity}
          onChange={(e) => handleFilterChange("severity", e.target.value)}
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <input
          type="text"
          className="w-full rounded-md border-gray-300 p-2"
          placeholder="Search location..."
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        />
      </div>
    </div>
  );
};
export default DataFilters;
