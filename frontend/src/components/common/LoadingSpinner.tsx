import React from 'react';
import { SpinnerIcon } from '../../assets/icons';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...",
  className = "text-white/70"
}) => {
  return (
    <div className="flex justify-center py-12">
      <div className={`flex items-center gap-3 ${className}`}>
        <SpinnerIcon className="w-5 h-5" />
        {message}
      </div>
    </div>
  );
};

export default LoadingSpinner;
