// import { useState } from "react";
// import AnalysisResults from "../components/analysis/AnalysisResults";
// import ChartComponent from "../components/analysis/ChartComponent";
// import DataFilters from "../components/analysis/DataFilters";
// const Analysis = () => {
//   // eslint-disable-next-line no-unused-vars
//   const [analysisData, setAnalysisData] = useState(null);

//   return (
//     <div className="container mx-auto pt-20 p-6">
//       <div className="grid grid-cols-12 gap-6">
//         <div className="col-span-3">
//           <DataFilters onFilterChange={(filters) => console.log(filters)} />
//         </div>
//         <div className="col-span-9">
//           <AnalysisResults data={analysisData} />
//           <div className="grid grid-cols-2 gap-6 mt-6">
//             <ChartComponent type="pollution-levels" />
//             <ChartComponent type="trend-analysis" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analysis;

// src/pages/Analysis.jsx
import { useState, useEffect } from "react";
import AnalysisResults from "../components/analysis/AnalysisResults";
import ChartComponent from "../components/analysis/ChartComponent";
import DataFilters from "../components/analysis/DataFilters";
import { getSessionData } from "../utils/sessionStorage";

const Analysis = () => {
  const [analysisData, setAnalysisData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const sessionData = getSessionData();
    setAnalysisData(sessionData.analyses);
    setFilteredData(sessionData.analyses);
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = analysisData;
    
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      switch (filters.dateRange) {
        case 'day': cutoff.setDate(now.getDate() - 1); break;
        case 'week': cutoff.setDate(now.getDate() - 7); break;
        case 'month': cutoff.setMonth(now.getMonth() - 1); break;
      }
      filtered = filtered.filter(item => new Date(item.timestamp) >= cutoff);
    }

    setFilteredData(filtered);
  };

  return (
    <div className="container mx-auto pt-20 p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <DataFilters onFilterChange={handleFilterChange} />
        </div>
        <div className="col-span-9">
          <AnalysisResults data={filteredData} />
          {/* <div className="grid grid-cols-2 gap-6 mt-6">
            <ChartComponent type="pollution-levels" data={filteredData} />
            <ChartComponent type="trend-analysis" data={filteredData} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Analysis;