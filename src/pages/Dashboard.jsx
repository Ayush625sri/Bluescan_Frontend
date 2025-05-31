// import { useState } from "react";
// import HotspotsList from "../components/dashboard/HotspotsList";
// import ImageUploader from "../components/dashboard/ImageUploader";
// import PollutionMap from "../components/dashboard/PollutionMap";
// import PollutionTrends from "../components/dashboard/PollutionTrends";
// const Dashboard = () => {
//   // eslint-disable-next-line no-unused-vars
//   const [selectedView, setSelectedView] = useState("map");

//   return (
//     <div className="container mx-auto pt-16 p-6">
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//       </header>
//       <div className="grid grid-cols-12 gap-6">
//         <div className="col-span-8">
//           {selectedView === "map" && <PollutionMap />}
//           {selectedView === "trends" && <PollutionTrends />}
//         </div>
//         <div className="grid col-span-4 gap-6">
//           <HotspotsList />
//           {/* <ImageUploader /> */}
//         </div>
//       </div>
//       {/* <div className="grid grid-cols-1 mt-6">
//           <OceanPollutionPlatform />
//         </div> */}
//     </div>
//   );
// };

// export default Dashboard;

// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import HotspotsList from "../components/dashboard/HotspotsList";
import PollutionMap from "../components/dashboard/PollutionMap";
import PollutionTrends from "../components/dashboard/PollutionTrends";
import { getSessionData, addHotspotToSession } from "../utils/sessionStorage";

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState("map");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [sessionData, setSessionData] = useState({ hotspots: [], analyses: [] });

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          
          // Add current location as hotspot if analyses exist
          const data = getSessionData();
          if (data.analyses.length > 0) {
            const avgSeverity = data.analyses.reduce((sum, analysis) => 
              sum + (100 - analysis.water_quality.overall_score), 0
            ) / data.analyses.length;
            
            addHotspotToSession(location, avgSeverity > 30 ? 'high' : avgSeverity > 15 ? 'medium' : 'low');
          }
        },
        (error) => console.log('Location access denied:', error)
      );
    }

    setSessionData(getSessionData());
  }, []);

  return (
    <div className="container mx-auto pt-16 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {currentLocation && (
          <p className="text-gray-600 mt-2">
            Current Location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
          </p>
        )}
      </header>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          {selectedView === "map" && (
            <PollutionMap 
              pollutionData={sessionData.hotspots} 
              currentLocation={currentLocation}
            />
          )}
          {selectedView === "trends" && <PollutionTrends data={sessionData.analyses} />}
        </div>
        <div className="grid col-span-4 gap-6">
          <HotspotsList hotspots={sessionData.hotspots} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;