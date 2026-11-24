import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, AlertTriangle, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export const IndicatorList = ({ indicators = [] }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!indicators || indicators.length === 0) {
    return (
      <div className="text-center py-6 text-text-dim text-sm">
        No specific threat indicators flagged for this scan.
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          badge: 'bg-red-500/15 text-red-400 border-red-500/30',
          icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
        };
      case 'high':
        return {
          badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
          icon: <AlertCircle className="w-4 h-4 text-orange-400" />,
        };
      case 'medium':
        return {
          badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        };
      case 'low':
        return {
          badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          icon: <Info className="w-4 h-4 text-blue-400" />,
        };
      case 'info':
      default:
        return {
          badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  return (
    <div className="space-y-3">
      {indicators.map((indicator, index) => {
        const isExpanded = expandedId === indicator.id || (index === 0 && indicator.severity === 'critical');
        const style = getSeverityStyle(indicator.severity);

        return (
          <div
            key={indicator.id || index}
            className="border border-border-dark hover:border-slate-700 bg-bg-secondary/70 rounded-lg p-4 transition-all duration-200"
          >
            <div
              className="flex items-start justify-between gap-3 cursor-pointer select-none"
              onClick={() => toggleExpand(indicator.id)}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5">{style.icon}</div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-text-main">
                      {indicator.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.badge}`}
                    >
                      {indicator.severity}
                    </span>
                    {indicator.category && (
                      <span className="text-[10px] bg-slate-800 text-text-dim px-2 py-0.5 rounded border border-slate-700/50">
                        {indicator.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {indicator.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {indicator.scoreImpact > 0 && (
                  <span className="text-xs font-mono font-bold text-status-danger bg-status-danger/10 px-2 py-0.5 rounded">
                    +{indicator.scoreImpact} pts
                  </span>
                )}
                <button
                  type="button"
                  className="p-1 text-text-dim hover:text-text-main transition-colors"
                  aria-label={isExpanded ? 'Collapse explanation' : 'Expand explanation'}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expandable Technical Explanation */}
            {isExpanded && indicator.explanation && (
              <div className="mt-3 pt-3 border-t border-border-dark/70 text-xs text-text-dim bg-bg-card/40 p-3 rounded">
                <span className="font-semibold text-accent-cyan uppercase tracking-wider text-[10px] block mb-1">
                  Technical Security Analysis & Threat Context:
                </span>
                <p className="leading-relaxed text-text-muted">
                  {indicator.explanation}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

