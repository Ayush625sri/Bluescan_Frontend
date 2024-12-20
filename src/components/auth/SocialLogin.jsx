import { useState } from 'react';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const SocialLogin = ({ onSocialLogin }) => {
  const [loading, setLoading] = useState({
    google: false,
    github: false,
    twitter: false
  });

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(prev => ({ ...prev, [provider]: true }));
      await onSocialLogin(provider);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const socialProviders = [
    {
      name: 'google',
      icon: FcGoogle,
      label: 'Continue with Google',
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      hoverBg: 'hover:bg-gray-50',
      borderColor: 'border-gray-300'
    },
    {
      name: 'github',
      icon: FaGithub,
      label: 'Continue with GitHub',
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
      hoverBg: 'hover:bg-gray-900',
      borderColor: 'border-transparent'
    },
    {
      name: 'twitter',
      icon: FaTwitter,
      label: 'Continue with Twitter',
      bgColor: 'bg-[#1DA1F2]',
      textColor: 'text-white',
      hoverBg: 'hover:bg-[#1a8cd8]',
      borderColor: 'border-transparent'
    }
  ];

  return (
    <div className="space-y-3">
      {socialProviders.map(provider => (
        <button
          key={provider.name}
          onClick={() => handleSocialLogin(provider.name)}
          disabled={loading[provider.name]}
          className={`
            relative w-full flex items-center justify-center
            px-4 py-2 border ${provider.borderColor} rounded-md
            ${provider.bgColor} ${provider.textColor} ${provider.hoverBg}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
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