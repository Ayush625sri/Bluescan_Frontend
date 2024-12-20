// routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import { useAuth } from "../contexts/AuthContext";

// Lazy load components for better performance
const Login = lazy(() => import("../components/auth/Login"));
const SignUp = lazy(() => import("../components/auth/SignUp"));
const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Analysis = lazy(() => import("../pages/Analysis"));
const Reports = lazy(() => import("../pages/Reports"));
const Settings = lazy(() => import("../pages/Settings"));
const Alerts = lazy(() => import("../pages/Alerts"));
const DataManagement = lazy(() => import("../pages/DataManagement"));
const ImageUpload = lazy(() => import("../pages/ImageUpload"));
const OceanPollutionPlatform = lazy(() =>
  import("../pages/OceanPollutionPlatform")
);

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          // <ProtectedRoute>
          <Dashboard />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          // <ProtectedRoute>
          <Analysis />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          // <ProtectedRoute>
          <Reports />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          // <ProtectedRoute>
          <Settings />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/ocean-pollution"
        element={
          <OceanPollutionPlatform />
          // <ProtectedRoute>
          // </ProtectedRoute>
        }
      />

      <Route path="/upload" element={<ImageUpload />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/data" element={<DataManagement />} />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Page not found</p>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
