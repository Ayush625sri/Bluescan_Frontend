// components/auth/VerificationRequired.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../utils/api';
import { MailCheck, RefreshCcw } from 'lucide-react';

const VerificationRequired = () => {
  const [email, setEmail] = useState(() => {
    // Try to get email from localStorage or sessionStorage if available
    return localStorage.getItem('pendingVerificationEmail') || '';
  });
  const [resendState, setResendState] = useState({
    loading: false,
    sent: false,
    error: null
  });
  
  const handleResendVerification = async () => {
    if (!email || resendState.loading) return;
    
    setResendState({ loading: true, sent: false, error: null });
    
    try {
      await authApi.resendVerification(email);
      setResendState({ loading: false, sent: true, error: null });
    } catch (error) {
      setResendState({ 
        loading: false, 
        sent: false, 
        error: error.response?.data?.message || 'Failed to resend verification email.' 
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <MailCheck className="mx-auto h-16 w-16 text-blue-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email address
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <p className="text-gray-600">
              We've sent a verification email to <strong>{email}</strong>. 
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>
          
          {resendState.sent && (
            <div className="mb-6 p-3 bg-green-50 text-green-800 rounded-md">
              Verification email has been resent. Please check your inbox.
            </div>
          )}
          
          {resendState.error && (
            <div className="mb-6 p-3 bg-red-50 text-red-800 rounded-md">
              {resendState.error}
            </div>
          )}
          
          <div className="text-center">
            <div className="mb-4">
              <button
                onClick={handleResendVerification}
                disabled={resendState.loading}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                {resendState.loading ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Don't see the email? Check your spam folder.
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequired;