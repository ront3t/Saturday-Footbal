import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={cn(
      'bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg',
      className
    )}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-100', className)}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50', className)}>
      {children}
    </div>
  );
};
