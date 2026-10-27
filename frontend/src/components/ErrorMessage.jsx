import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ 
  title = 'Something went wrong', 
  message, 
  onRetry 
}) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center max-w-lg mx-auto my-6">
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 mb-1">{title}</h3>
      <p className="text-xs text-rose-700 mb-4 whitespace-pre-wrap">{message || 'An unexpected error occurred while communicating with the server.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
