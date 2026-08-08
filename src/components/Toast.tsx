import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ show, message, type }) => {
  if (!show) return null;

  return (
    <div
      className={`fixed bottom-20 right-6 z-50 transform transition-all duration-300 flex items-center space-x-2 px-4 py-3 rounded-xl text-xs font-medium shadow-2xl border ${
        type === 'success'
          ? 'bg-emerald-900/90 border-emerald-700 text-emerald-100'
          : type === 'error'
          ? 'bg-rose-900/90 border-rose-700 text-rose-100'
          : 'bg-sky-900/90 border-sky-700 text-sky-100'
      }`}
    >
      {type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-300" />}
      {type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300" />}
      {type === 'info' && <Info className="w-4 h-4 text-sky-300" />}
      <span>{message}</span>
    </div>
  );
};
