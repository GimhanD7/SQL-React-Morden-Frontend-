import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function ErrorAlert({ message }) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-3 md:px-4 py-2 md:py-3 rounded-lg mx-4 md:mx-6 mt-3 md:mt-4 flex items-center gap-2 md:gap-3 animate-slide-down">
      <AlertCircle size={16} className="flex-shrink-0 md:w-[18px] md:h-[18px]" />
      <span className="text-xs md:text-sm">{message}</span>
    </div>
  );
}

export function SuccessAlert({ message }) {
  if (!message) return null;
  
  return (
    <div className="bg-green-50 border border-green-200 text-green-800 px-3 md:px-4 py-2 md:py-3 rounded-lg mx-4 md:mx-6 mt-3 md:mt-4 flex items-center gap-2 md:gap-3 animate-slide-down">
      <CheckCircle size={16} className="flex-shrink-0 md:w-[18px] md:h-[18px]" />
      <span className="text-xs md:text-sm">{message}</span>
    </div>
  );
}
