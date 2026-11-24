import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-bg-card border border-border-dark rounded-xl p-5 animate-pulse"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 bg-slate-800 rounded w-24"></div>
              <div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
            </div>
            <div className="h-8 bg-slate-800 rounded w-16 mb-2"></div>
            <div className="h-3 bg-slate-800/60 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-bg-card border border-border-dark rounded-xl p-4 animate-pulse space-y-3">
        <div className="h-6 bg-slate-800 rounded w-1/4 mb-4"></div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-800/40 rounded flex items-center px-4 justify-between">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-4 bg-slate-800 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-slate-800 rounded w-1/3"></div>
      <div className="h-32 bg-slate-800/50 rounded-xl"></div>
    </div>
  );
};

