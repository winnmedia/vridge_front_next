import React from 'react';

interface LoadingAnimationProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export default function LoadingAnimation({ 
  size = 'medium', 
  color = '#1631F8',
  text 
}: LoadingAnimationProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]}`} 
           style={{ borderColor: color }}>
      </div>
      {text && (
        <p className="mt-4 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}