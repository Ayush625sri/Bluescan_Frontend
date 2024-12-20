import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({ 
  type, 
  label,
  placeholder, 
  icon: Icon,
  value,
  onChange,
  name,
  error,
  required = false,
  disabled = false,
  className = ""
}) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  
  const togglePassword = () => {
    setIsPasswordShown(prev => !prev);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        
        <input
          type={isPasswordShown ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            block w-full rounded-md border-gray-300 
            ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${className}
          `}
          aria-invalid={error ? "true" : "false"}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {isPasswordShown ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
export default InputField