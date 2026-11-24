import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, ShieldX } from 'lucide-react';

export const RiskGauge = ({ score = 0, level = 'low', size = 200 }) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

  let color = '#22C55E'; // green
  let glowColor = 'rgba(34, 197, 94, 0.3)';
  let label = 'Low Risk';
  let Icon = ShieldCheck;

  if (normalizedScore >= 80 || level === 'critical') {
    color = '#DC2626';
    glowColor = 'rgba(220, 38, 38, 0.4)';
    label = 'Critical Risk';
    Icon = ShieldX;
  } else if (normalizedScore >= 60 || level === 'high') {
    color = '#EF4444';
    glowColor = 'rgba(239, 68, 68, 0.35)';
    label = 'High Risk';
    Icon = ShieldAlert;
  } else if (normalizedScore >= 30 || level === 'medium') {
    color = '#F59E0B';
    glowColor = 'rgba(245, 158, 11, 0.35)';
    label = 'Medium Risk';
    Icon = AlertTriangle;
  }

  // Radial calculation (260 degree arc)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Use a 3/4 circle (270 degrees)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * normalizedScore) / 100;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full transform -rotate-225"
          viewBox="0 0 200 200"
        >
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Foreground animated score bar */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <Icon className="w-8 h-8 mb-1" style={{ color }} />
            <span className="text-4xl font-extrabold tracking-tight text-text-main font-mono">
              {normalizedScore}
              <span className="text-sm font-normal text-text-dim">/100</span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Risk Badge */}
      <div
        className="mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border"
        style={{
          color,
          backgroundColor: `${color}15`,
          borderColor: `${color}40`,
        }}
      >
        <span
          className="w-2 h-2 rounded-full animate-ping"
          style={{ backgroundColor: color }}
        />
        {label}
      </div>
    </div>
  );
};

