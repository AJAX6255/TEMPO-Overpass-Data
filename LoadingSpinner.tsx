import React from 'react';
import type { LoadingSpinnerProps } from '../types/satellite';

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center my-8">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="h-full w-full border-4 border-blue-400 border-t-transparent rounded-full" />
      </div>
    </div>
  );
}