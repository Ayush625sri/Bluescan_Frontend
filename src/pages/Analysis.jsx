import { useState } from "react";
import AnalysisResults from "../components/analysis/AnalysisResults";
import ChartComponent from "../components/analysis/ChartComponent";
import DataFilters from "../components/analysis/DataFilters";
const Analysis = () => {
  // eslint-disable-next-line no-unused-vars
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div className="container mx-auto pt-20 p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <DataFilters onFilterChange={(filters) => console.log(filters)} />
        </div>
        <div className="col-span-9">
          <AnalysisResults data={analysisData} />
          <div className="grid grid-cols-2 gap-6 mt-6">
            <ChartComponent type="pollution-levels" />
            <ChartComponent type="trend-analysis" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
