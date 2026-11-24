import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="space-y-4 max-w-md">
        <div className="inline-flex p-4 rounded-2xl bg-status-danger/10 text-status-danger border border-status-danger/30 mb-2">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold text-text-main font-mono">404</h1>
        <h2 className="text-lg font-bold text-text-main">Security Route Not Found</h2>
        <p className="text-xs text-text-muted leading-relaxed">
          The requested system node or resource is not available or you do not have permission to view this route.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-cyan text-bg-dark font-bold text-xs hover:bg-cyan-400 transition-all shadow-cyan-glow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Safety</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

