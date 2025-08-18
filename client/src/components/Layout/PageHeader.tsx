import React from 'react';
import Button from '../ui/Button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action, children }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900/50 to-slate-900 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-slate-300">{subtitle}</p>
            )}
          </div>
          {action && (
            <div className="mt-4 sm:mt-0">
              <Button onClick={action.onClick} size="lg">
                {action.icon && <action.icon className="w-5 h-5 mr-2" />}
                {action.label}
              </Button>
            </div>
          )}
        </div>
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
