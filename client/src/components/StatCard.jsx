import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'cyan',
  subtext,
  isLoading = false,
}) => {
  const colorMap = {
    cyan: {
      border: 'hover:border-accent-cyan/50',
      iconBg: 'bg-accent-cyan/10 text-accent-cyan',
      glow: 'hover:shadow-cyan-glow',
    },
    purple: {
      border: 'hover:border-accent-purple/50',
      iconBg: 'bg-accent-purple/10 text-accent-purple',
      glow: 'hover:shadow-purple-glow',
    },
    green: {
      border: 'hover:border-status-success/50',
      iconBg: 'bg-status-success/10 text-status-success',
      glow: 'hover:shadow-[0_0_20px_-3px_rgba(34,197,94,0.3)]',
    },
    yellow: {
      border: 'hover:border-status-warning/50',
      iconBg: 'bg-status-warning/10 text-status-warning',
      glow: 'hover:shadow-[0_0_20px_-3px_rgba(245,158,11,0.3)]',
    },
    red: {
      border: 'hover:border-status-danger/50',
      iconBg: 'bg-status-danger/10 text-status-danger',
      glow: 'hover:shadow-[0_0_20px_-3px_rgba(239,68,68,0.3)]',
    },
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`bg-bg-card border border-border-dark ${scheme.border} ${scheme.glow} rounded-xl p-5 transition-all duration-300 shadow-card-glow relative overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        {isLoading ? (
          <div className="h-9 w-24 bg-border-dark animate-pulse rounded"></div>
        ) : (
          <span className="text-3xl font-extrabold text-text-main font-mono tracking-tight">
            {value}
          </span>
        )}
        {trend && (
          <span className="text-xs font-medium text-status-success">
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-text-dim mt-2 truncate">
          {subtext}
        </p>
      )}
    </motion.div>
  );
};

