
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  variant?: 'default' | 'accent' | 'destructive' | 'success';
  interactive?: boolean;
}

const DashboardCard = ({
  title,
  subtitle,
  icon,
  footer,
  children,
  className,
  isLoading = false,
  variant = 'default',
  interactive = false,
  ...props
}: DashboardCardProps) => {
  const variantStyles = {
    default: 'bg-white',
    accent: 'bg-medical-50 border-medical-100',
    destructive: 'bg-red-50 border-red-100',
    success: 'bg-green-50 border-green-100',
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-100 shadow-sm overflow-hidden',
        variantStyles[variant],
        interactive && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            {title && <h3 className="font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      )}
      
      <div className={cn('p-5', isLoading && 'animate-pulse')}>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : (
          children
        )}
      </div>
      
      {footer && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
