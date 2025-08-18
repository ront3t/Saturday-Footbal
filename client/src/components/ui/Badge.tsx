import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}) => {
  const variants = {
    primary: 'bg-blue-600/20 text-blue-300 border-blue-500/30',
    secondary: 'bg-slate-600/20 text-slate-300 border-slate-500/30',
    success: 'bg-green-600/20 text-green-300 border-green-500/30',
    warning: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
    danger: 'bg-red-600/20 text-red-300 border-red-500/30',
    info: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/30'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
