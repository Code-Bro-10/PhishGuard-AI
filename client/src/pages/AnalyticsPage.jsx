import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Shield,
  Activity,
  Layers,
  Globe,
  Mail,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { dashboardApi } from '../services/api';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const AnalyticsPage = () => {
  const [distribution, setDistribution] = useState(null);
  const [activity, setActivity] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [distRes, actRes, statsRes] = await Promise.all([
          dashboardApi.getThreatDistribution(),
          dashboardApi.getActivity(),
          dashboardApi.getStats(),
        ]);

        if (distRes.success) setDistribution(distRes.data);
        if (actRes.success) setActivity(actRes.data);
        if (statsRes.success) setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={3} type="card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-main">
              Security Telemetry & Analytics
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Deep-dive metrics on threat categories, risk profiles, and historical telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: Scan Volume Breakdown & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Detected Categories Bar Chart */}
        <div className="bg-bg-card border border-border-dark rounded-2xl p-6 shadow-card-glow space-y-4">
          <div>
            <h2 className="text-sm font-bold text-text-main uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-cyan" />
              Most Frequent Threat Categories
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Top indicator classifications triggered across scans
            </p>
          </div>

          <div className="h-64 w-full">
            {!distribution?.topCategories || distribution.topCategories.length === 0 ? (
              <div className="flex h-full items-center justify-center text-text-dim text-xs">
                No threat categories recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribution.topCategories} layout="vertical" margin={{ left: 30, right: 20 }}>
                  <XAxis type="number" stroke="#64748B" fontSize={11} allowDecimals={false} />
                  <YAxis type="category" dataKey="category" stroke="#64748B" fontSize={10} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101827',
                      border: '1px solid #1E293B',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#00D4FF" radius={[0, 4, 4, 0]} name="Trigger Count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Scan Type Ratio Doughnut Chart */}
        <div className="bg-bg-card border border-border-dark rounded-2xl p-6 shadow-card-glow space-y-4">
          <div>
            <h2 className="text-sm font-bold text-text-main uppercase tracking-wider font-mono flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-accent-purple" />
              URL vs. Email Scan Volume
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Proportion of URLs vs. pasted email analyses
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution?.byScanType || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(distribution?.byScanType || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101827',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Legend formatter={(val) => <span className="text-xs text-text-muted">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: 7-Day High Risk Trend Line */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-6 shadow-card-glow space-y-4">
        <div>
          <h2 className="text-sm font-bold text-text-main uppercase tracking-wider font-mono flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-status-danger" />
            High-Risk Threat Velocity
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Daily frequency of high and critical severity detections
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activity?.weeklyTrend || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#101827',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="highRisk"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ r: 4, fill: '#EF4444' }}
                name="High/Critical Threats"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

