import React from 'react';
import LoadingAnimation from './LoadingAnimation';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'text-white bg-gradient-to-r from-[#1631F8] to-[#0F23C9] hover:from-[#0F23C9] hover:to-[#1631F8] focus:ring-[#1631F8]',
    secondary: 'text-[#1631F8] bg-white border-2 border-[#1631F8] hover:bg-[#1631F8] hover:text-white focus:ring-[#1631F8]',
    danger: 'text-white bg-gradient-to-r from-[#dc3545] to-[#c82333] hover:from-[#c82333] hover:to-[#dc3545] focus:ring-[#dc3545]',
    ghost: 'text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingAnimation size="small" color={variant === 'primary' || variant === 'danger' ? 'white' : '#1631F8'} />
          <span className="ml-2">처리중...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}