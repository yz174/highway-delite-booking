import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  label?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  label,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-error dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-dark-card text-secondary dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
          error ? 'border-error focus:ring-error hover:border-error' : 'border-gray-300 dark:border-gray-600'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-error dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;

