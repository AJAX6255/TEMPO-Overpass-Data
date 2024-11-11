import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
      <AlertCircle className="w-5 h-5" />
      <p>{message}</p>
      <button 
        onClick={onDismiss}
        className="ml-4 hover:text-red-200 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}