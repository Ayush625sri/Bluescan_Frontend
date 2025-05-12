import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGithub, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SocialLogin = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState({
    google: false,
    github: false,
    apple: false
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setLoading(prev => ({ ...prev, google: true }));
        await googleLogin(response.access_token, navigate);
      } catch (error) {
        console.error("Google login error:", error);
        toast.error(error.message || "Failed to login with Google");
      } finally {
        setLoading(prev => ({ ...prev, google: false }));
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      toast.error("Google sign-in failed");
      setLoading(prev => ({ ...prev, google: false }));
    }
  });

  const socialProviders = [
    {
      name: 'google',
      icon: FcGoogle,
      label: 'Continue with Google',
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      hoverBg: 'hover:bg-gray-50',
      borderColor: 'border-gray-300',
      action: () => handleGoogleLogin()
    },
    {
      name: 'apple',
      icon: FaApple,
      label: 'Continue with Apple',
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
      hoverBg: 'hover:bg-gray-900',
      borderColor: 'border-transparent'
    },
    {
      name: 'github',
      icon: FaGithub,
      label: 'Continue with GitHub',
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
      hoverBg: 'hover:bg-gray-900',
      borderColor: 'border-transparent'
    }
  ];

  return (
    <div className="space-y-3">
      {socialProviders.map(provider => (
        <button
          key={provider.name}
          onClick={provider.action || (() => {})}
          disabled={loading[provider.name] || provider.name !== 'google'}
          className={`
            relative w-full flex items-center justify-center
            px-4 py-2 border ${provider.borderColor} rounded-md
            ${provider.bgColor} ${provider.textColor} ${provider.hoverBg}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-colors duration-200
            disabled:opacity-50 ${provider.name !== 'google' ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <provider.icon className="h-5 w-5 mr-2" aria-hidden="true" />
          <span className="text-sm font-medium">
            {loading[provider.name] ? 'Connecting...' : provider.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SocialLogin;