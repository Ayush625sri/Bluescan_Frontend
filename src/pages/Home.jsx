import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowRight, Info } from "lucide-react";

const Home = () => {
  const [pollutionSpots, setPollutionSpots] = useState([]);
  const [stats, setStats] = useState({
    areasScanned: 0,
    pollutionDetected: 0,
    accuracyRate: 0,
  });

  // Simulate pollution spots
  useEffect(() => {
    const spots = Array.from({ length: 10 }, () => ({
      id: Math.random(),
      position: [
        Math.random() * (50 - 20) + 20,
        Math.random() * (130 - 100) + 100,
      ],
      severity: Math.random() * 100,
      type: ["Microplastics", "Chemical", "Oil Spill"][
        Math.floor(Math.random() * 3)
      ],
    }));
    setPollutionSpots(spots);
  }, []);

  // Animate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        areasScanned: Math.min(prev.areasScanned + 1, 150),
        pollutionDetected: Math.min(prev.pollutionDetected + 1, 85),
        accuracyRate: Math.min(prev.accuracyRate + 1, 95),
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-16">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-8 text-gray-900">
              Ocean Pollution Detection Platform
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              Advanced satellite and drone imagery analysis for detecting ocean
              pollution patterns
            </p>
            <div className="flex space-x-4">
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2" />
              </Link>
              <a
                href="#demo"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg flex items-center hover:bg-gray-50 transition-colors"
              >
                View Demo
                <Info className="ml-2" />
              </a>
            </div>
          </div>

          {/* Interactive Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">
                {stats.areasScanned}+
              </h3>
              <p className="text-gray-600">Areas Scanned</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-3xl font-bold text-red-600 mb-2">
                {stats.pollutionDetected}%
              </h3>
              <p className="text-gray-600">Pollution Detected</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-3xl font-bold text-green-600 mb-2">
                {stats.accuracyRate}%
              </h3>
              <p className="text-gray-600">Accuracy Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="demo" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Live Pollution Detection Demo
        </h2>
        <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={[35, 115]}
            zoom={4}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
            {pollutionSpots.map((spot) => (
              <Circle
                key={spot.id}
                center={spot.position}
                radius={50000}
                pathOptions={{
                  color:
                    spot.severity > 66
                      ? "red"
                      : spot.severity > 33
                      ? "yellow"
                      : "green",
                  fillColor:
                    spot.severity > 66
                      ? "red"
                      : spot.severity > 33
                      ? "yellow"
                      : "green",
                  fillOpacity: 0.4,
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">Pollution Detected</h3>
                    <p>Type: {spot.type}</p>
                    <p>Severity: {spot.severity.toFixed(1)}%</p>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Real-time Detection</h3>
            <p className="text-gray-600">
              Advanced algorithms for instant pollution detection and analysis
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Accurate Analysis</h3>
            <p className="text-gray-600">
              High-precision pollution pattern recognition and classification
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Global Coverage</h3>
            <p className="text-gray-600">
              Worldwide satellite and drone imagery analysis capabilities
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
