import React from 'react';
import { ClipboardIcon } from '../../assets/icons';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "No todos yet",
  message = "Create your first todo using the form above!",
  icon
}) => {
  return (
    <div className="rounded-2xl border-2 border-dashed border-white/30 bg-white/10 backdrop-blur-sm px-6 py-16 text-center">
      <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
        {icon || <ClipboardIcon className="w-10 h-10 text-white/60" strokeWidth={1.5} />}
      </div>
      <h3 className="text-white/80 font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/50">{message}</p>
    </div>
  );
};

export default EmptyState;
