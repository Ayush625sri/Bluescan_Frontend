// App.jsx
import { BrowserRouter } from 'react-router-dom';
import React, { Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Loading from './components/common/Loading';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-100">
          {/* Main Layout */}
          <div className="flex flex-1">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col">
              {/* Top Navigation */}
              <Navbar />

              {/* Main Content Area */}
              <main className="flex-1 p-6">
                <div className="container mx-auto">
                  <Suspense fallback={
                    <div className="flex justify-center items-center h-screen">
                      <Loading size="large" />
                    </div>
                  }>
                    <AppRoutes />
                  </Suspense>
                </div>
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </div>

          {/* Toast Container for Notifications */}
          <div id="toast-container" className="fixed top-4 right-4 z-50" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

// Optional: Add error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the App component with ErrorBoundary
const SafeApp = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default SafeApp;