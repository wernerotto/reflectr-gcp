import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide";
  
  const variants = {
    primary: "bg-neon text-black hover:bg-neon-dim hover:shadow-[0_0_15px_rgba(50,255,246,0.4)]",
    secondary: "bg-surface border border-gray-800 text-white hover:border-gray-600",
    danger: "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20",
    ghost: "text-gray-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
