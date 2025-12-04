import React from 'react';
import { DeleteIcon, CheckIcon, WarningIcon } from '../assets/icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: 'delete' | 'complete' | 'warning';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  confirmButtonClass,
  onConfirm,
  onCancel,
  icon = 'warning',
}) => {
  if (!isOpen) return null;

  const iconComponents = {
    delete: (
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <DeleteIcon className="w-8 h-8 text-red-600" />
      </div>
    ),
    complete: (
      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
        <CheckIcon className="w-8 h-8 text-green-600" strokeWidth={2} />
      </div>
    ),
    warning: (
      <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
        <WarningIcon className="w-8 h-8 text-amber-600" />
      </div>
    ),
  };

  const defaultConfirmClass = icon === 'delete' 
    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
    : icon === 'complete'
    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
    : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div 
        className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {iconComponents[icon]}
        
        <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 text-center mb-6">
          {message}
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-xl font-medium shadow-lg transition-all cursor-pointer ${confirmButtonClass || defaultConfirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
