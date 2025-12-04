import React from 'react';
import { ErrorIcon } from '../../assets/icons';

interface ErrorAlertProps {
  message: string;
  className?: string;
  testId?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  message,
  className = "rounded-xl border border-red-300/50 bg-red-50/80 backdrop-blur-sm px-4 py-3 text-sm text-red-700",
  testId = "error-message"
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid={testId}>
      <ErrorIcon className="w-5 h-5" />
      {message}
    </div>
  );
};

export default ErrorAlert;
