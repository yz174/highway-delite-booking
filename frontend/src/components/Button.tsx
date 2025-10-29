import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  type = 'button',
  className = '',
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95';
  
  const variantStyles = {
    primary: 'bg-primary text-black hover:bg-primary-dark hover:shadow-md focus:ring-primary disabled:hover:bg-primary disabled:hover:shadow-none disabled:active:scale-100',
    secondary: 'bg-white text-secondary border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm focus:ring-secondary disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:shadow-none disabled:active:scale-100',
    outline: 'bg-transparent text-secondary border border-secondary hover:bg-secondary hover:text-white hover:shadow-sm focus:ring-secondary disabled:hover:bg-transparent disabled:hover:text-secondary disabled:hover:shadow-none disabled:active:scale-100',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
