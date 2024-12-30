import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
/* eslint-disable react/prop-types */
const PollutionMap = ({ pollutionData = [] }) => {
  return (
    <div className="h-[600px] rounded-lg overflow-hidden">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {pollutionData.map((point, index) => (
          <Marker key={index} position={point.coordinates}>
            <Popup>
              <div>
                <h3 className="font-bold">Pollution Level: {point.level}%</h3>
                <p>Type: {point.type}</p>
                <p>Date: {new Date(point.timestamp).toLocaleDateString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PollutionMap;
