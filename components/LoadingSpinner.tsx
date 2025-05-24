import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'small' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-4',
    large: 'w-12 h-12 border-[6px]',
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} border-amber-500 border-t-transparent`}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Đang tải...</span>
    </div>
  );
};