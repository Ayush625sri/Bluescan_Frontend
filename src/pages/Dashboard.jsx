import { useState } from "react";
import  PollutionMap from '../components/dashboard/PollutionMap'
import  PollutionTrends from '../components/dashboard/PollutionTrends'
import  HotspotsList from '../components/dashboard/HotspotsList'
import  ImageUploader from '../components/dashboard/ImageUploader'
import OceanPollutionPlatform from "./OceanPollutionPlatform";
const Dashboard = () => {
    const [selectedView, setSelectedView] = useState('map');
  
    return (
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </header>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            {selectedView === 'map' && <PollutionMap />}
            {selectedView === 'trends' && <PollutionTrends />}
          </div>
          <div className="grid col-span-4 gap-6">
            <HotspotsList />
            <ImageUploader />
          </div>
        </div>
        {/* <div className="grid grid-cols-1 mt-6">
          <OceanPollutionPlatform />
        </div> */}
      </div>
    );
  };

  export default Dashboard