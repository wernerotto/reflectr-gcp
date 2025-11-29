import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</label>}
      <input 
        className={`bg-surface border border-gray-800 rounded-lg px-3 py-2 text-white focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className = '', ...props }) => {
   return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</label>}
      <textarea 
        className={`bg-surface border border-gray-800 rounded-lg px-3 py-2 text-white focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};
