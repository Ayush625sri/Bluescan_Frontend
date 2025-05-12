import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../utils/api';
import Loading from '../common/Loading';

const EmailVerification = () => {
  const [verifyState, setVerifyState] = useState({
    loading: true,
    success: false,
    message: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const verifyToken = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      
      if (!token) {
        setVerifyState({
          loading: false,
          success: false,
          message: 'Invalid verification link. No token provided.'
        });
        return;
      }
      
      try {
        const response = await authApi.verifyEmail(token);
        setVerifyState({
          loading: false,
          success: true,
          message: response.data.message || 'Email verified successfully!'
        });
      } catch (error) {
        setVerifyState({
          loading: false,
          success: false,
          message: error.response?.data?.message || 'Failed to verify email. The link may have expired.'
        });
      }
    };
    
    verifyToken();
  }, [location]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Email Verification
        </h2>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {verifyState.loading ? (
            <div className="flex flex-col items-center">
              <Loading size="large" />
              <p className="mt-4 text-gray-600">Verifying your email...</p>
            </div>
          ) : (
            <>
              <div className={`rounded-md p-4 ${verifyState.success ? 'bg-green-50' : 'bg-red-50'} mb-4`}>
                <p className={`text-md ${verifyState.success ? 'text-green-800' : 'text-red-800'}`}>
                  {verifyState.message}
                </p>
              </div>
              
              {verifyState.success ? (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Login
                </button>
              ) : (
                <button
                  onClick={() => navigate('/resend-verification')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Request New Verification Email
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;