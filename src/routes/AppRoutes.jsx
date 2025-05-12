import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/common/Loading";
import toast from "react-hot-toast";


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
const OceanPollutionPlatform = lazy(() => import("../pages/OceanPollutionPlatform"));

// New authentication pages
const VerificationRequired = lazy(() => import("../components/auth/VerificationRequired"));
const EmailVerification = lazy(() => import("../components/auth/EmailVerification"));
const ForgotPassword = lazy(() => import("../components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/auth/ResetPassword"));
const Profile = lazy(() => import("../pages/Profile"));

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("Protected route check - User:", user, "Loading:", loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("User authenticated, rendering protected content");
  return children;
};
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Get the intended destination after login, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    }>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Auth routes that require guest (not logged in) */}
        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
        <Route path="/signup" element={
          <GuestRoute>
            <SignUp />
          </GuestRoute>
        } />
        
        {/* New authentication related routes */}
        <Route path="/verification-required" element={<VerificationRequired />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/analysis" element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        <Route path="/ocean-pollution" element={
          <ProtectedRoute>
            <OceanPollutionPlatform />
          </ProtectedRoute>
        } />
        
        <Route path="/upload" element={
          <ProtectedRoute>
            <ImageUpload />
          </ProtectedRoute>
        } />
        
        <Route path="/alerts" element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        } />
        
        <Route path="/data" element={
          <ProtectedRoute>
            <DataManagement />
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={
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
        } />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;