import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading data...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-blue-600 mb-3`} />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
