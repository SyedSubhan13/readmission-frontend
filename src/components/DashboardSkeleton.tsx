import React from 'react';
import DashboardCard from './DashboardCard';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <DashboardCard key={i} className="animate-pulse">
            <div className="bg-gray-200 h-6 w-24 rounded mb-2"></div>
            <div className="bg-gray-300 h-8 w-16 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 w-32 rounded"></div>
          </DashboardCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-2 animate-pulse">
          <div className="h-80 bg-gray-200 rounded"></div>
        </DashboardCard>

        <DashboardCard className="animate-pulse">
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-100">
                <div className="bg-gray-200 h-5 w-32 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-24 rounded"></div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(2).fill(0).map((_, i) => (
          <DashboardCard key={i} className="animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                {Array(5).fill(0).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}; 