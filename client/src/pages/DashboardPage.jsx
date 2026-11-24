import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Globe,
  Mail,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  Radio,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { dashboardApi } from '../services/api';
import { StatCard } from '../components/StatCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickScanUrl, setQuickScanUrl] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes, distRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getActivity(),
        dashboardApi.getThreatDistribution(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (activityRes.success) setActivity(activityRes.data);
      if (distRes.success) setDistribution(distRes.data);
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickScanUrl.trim()) return;
    navigate(`/dashboard/scan-url?url=${encodeURIComponent(quickScanUrl.trim())}`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-card border border-border-dark p-6 rounded-2xl shadow-card-glow">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse"></span>
            <h1 className="text-xl font-extrabold text-text-main">
              PhishGuard SOC Command Center
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Real-time heuristic threat detection and security intelligence overview.
          </p>
        </div>

        {/* Quick URL Scan Box */}
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-text-dim absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Paste suspicious URL to analyze..."
              value={quickScanUrl}
              onChange={(e) => setQuickScanUrl(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg-secondary border border-border-dark focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan text-xs text-text-main placeholder-text-dim font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-accent-cyan text-bg-dark font-bold text-xs hover:bg-cyan-400 transition-all shadow-cyan-glow shrink-0"
          >
            Scan URL
          </button>
        </form>
      </div>

      {/* Main KPI Stats Row (100% Real Database Data) */}
      {loading ? (
        <LoadingSkeleton count={4} type="card" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Scans"
            value={stats?.totalScans ?? 0}
            icon={Activity}
            color="cyan"
            subtext={`${stats?.totalUrlsScanned ?? 0} URLs, ${stats?.totalEmailsAnalyzed ?? 0} Emails`}
          />
          <StatCard
            title="Safe Targets"
            value={stats?.safeUrls ?? 0}
            icon={ShieldCheck}
            color="green"
            subtext="Clean heuristic evaluation"
          />
          <StatCard
            title="Suspicious Targets"
            value={stats?.suspiciousUrls ?? 0}
            icon={AlertTriangle}
            color="yellow"
            subtext="Medium risk indicators"
          />
          <StatCard
            title="High / Critical Risks"
            value={stats?.highRiskUrls ?? 0}
            icon={ShieldAlert}
            color="red"
            subtext="Phishing or weaponized patterns"
          />
          <StatCard
            title="Avg Risk Score"
            value={`${stats?.averageRiskScore ?? 0}/100`}
            icon={TrendingUp}
            color="purple"
            subtext="Mean heuristic severity"
          />
        </div>
      )}

      {/* Charts Section: Weekly Trend & Threat Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-bg-card border border-border-dark rounded-2xl p-6 shadow-card-glow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-text-main uppercase tracking-wider font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent-cyan" />
                7-Day Scanning Activity
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Scan volume distribution over the past week
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-accent-cyan">
                <span className="w-2.5 h-2.5 rounded bg-accent-cyan"></span>
                URLs
              </span>
              <span className="flex items-center gap-1.5 text-accent-purple">
                <span className="w-2.5 h-2.5 rounded bg-accent-purple"></span>
                Emails
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity?.weeklyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="urls"
                  stroke="#00D4FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cyanGradient)"
                  name="URLs"
                />
                <Area
                  type="monotone"
                  dataKey="emails"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#purpleGradient)"
                  name="Emails"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Level Distribution Pie Chart (1 Col) */}
        <div className="bg-bg-card border border-border-dark rounded-2xl p-6 shadow-card-glow flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-main uppercase tracking-wider font-mono flex items-center gap-2">
              <Radio className="w-4 h-4 text-accent-purple" />
              Risk Level Distribution
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Breakdown across severity tiers
            </p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution?.byRiskLevel || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(distribution?.byRiskLevel || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
                <Legend
                  formatter={(val) => <span className="text-xs text-text-muted">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-border-dark text-center">
            <Link
              to="/dashboard/analytics"
              className="text-xs text-accent-cyan hover:underline font-semibold flex items-center justify-center gap-1"
            >
              View Full Security Telemetry
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Scans & Security Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Scans Table (2 Cols) */}
        <div className="lg:col-span-2 bg-bg-card border border-border-dark rounded-2xl p-6 shadow-card-glow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-text-main uppercase tracking-wider font-mono">
                Recent Scans
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Latest targets evaluated by the heuristic engine
              </p>
            </div>
            <Link
              to="/dashboard/history"
              className="text-xs text-accent-cyan hover:underline font-semibold flex items-center gap-1"
            >
              All History
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} type="table" />
          ) : !activity?.recentScans || activity.recentScans.length === 0 ? (
            <div className="text-center py-10 text-text-dim text-xs">
              No scans recorded yet. Use the scan box above to run your first evaluation.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border-dark text-text-dim uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Target / Snippet</th>
                    <th className="pb-3 font-semibold">Risk Score</th>
                    <th className="pb-3 font-semibold">Risk Level</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark/60 font-mono">
                  {activity.recentScans.map((scan) => {
                    let levelColor = 'text-status-success bg-status-success/10 border-status-success/30';
                    if (scan.riskLevel === 'medium') levelColor = 'text-status-warning bg-status-warning/10 border-status-warning/30';
                    if (scan.riskLevel === 'high') levelColor = 'text-status-danger bg-status-danger/10 border-status-danger/30';
                    if (scan.riskLevel === 'critical') levelColor = 'text-red-500 bg-red-500/10 border-red-500/30';

                    return (
                      <tr key={scan._id} className="hover:bg-bg-secondary/40 transition-colors">
                        <td className="py-3">
                          <span className="flex items-center gap-1.5 font-sans capitalize">
                            {scan.scanType === 'url' ? (
                              <Globe className="w-3.5 h-3.5 text-accent-cyan" />
                            ) : (
                              <Mail className="w-3.5 h-3.5 text-accent-purple" />
                            )}
                            {scan.scanType}
                          </span>
                        </td>
                        <td className="py-3 max-w-xs truncate text-text-main font-mono pr-4">
                          {scan.normalizedInput}
                        </td>
                        <td className="py-3 font-bold text-text-main">
                          {scan.riskScore}/100
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${levelColor}`}>
                            {scan.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/dashboard/scan/${scan._id}`}
                            className="text-accent-cyan hover:underline text-xs font-sans font-medium"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Alerts Feed (1 Col) */}
        <div className="bg-bg-card border border-border-dark rounded-2xl p-6 shadow-card-glow flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-main uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-status-danger" />
              Active Alerts
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              High-confidence threat detections
            </p>
          </div>

          <div className="my-4 space-y-3 flex-1 overflow-y-auto max-h-72">
            {!activity?.recentAlerts || activity.recentAlerts.length === 0 ? (
              <div className="text-center py-8 text-text-dim text-xs">
                No critical alerts recorded. Clean threat status.
              </div>
            ) : (
              activity.recentAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="p-3 rounded-lg bg-bg-secondary/80 border border-border-dark hover:border-status-danger/40 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-text-main truncate">
                      {alert.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-status-danger bg-status-danger/10 px-1.5 py-0.5 rounded">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-text-muted text-[11px] leading-relaxed">
                    {alert.description}
                  </p>
                  <span className="text-[10px] text-text-dim font-mono block mt-1">
                    {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-border-dark text-center">
            <Link
              to="/dashboard/threat-intel"
              className="text-xs text-accent-cyan hover:underline font-semibold flex items-center justify-center gap-1"
            >
              Threat Intelligence Feeds
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

