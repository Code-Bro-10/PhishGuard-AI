import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Globe,
  Mail,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { scanApi } from '../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

export const ScanHistoryPage = () => {
  const [scans, setScans] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search,
        type,
        riskLevel,
        sortBy,
      };

      const res = await scanApi.getHistory(params);
      if (res.success) {
        setScans(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load scan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [pagination.page, type, riskLevel, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchHistory();
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      await scanApi.deleteScan(deleteTargetId);
      toast.success('Scan record deleted from database.');
      setDeleteTargetId(null);
      fetchHistory();
    } catch (err) {
      toast.error(err.message || 'Failed to delete scan.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-text-main">
                Scan Audit History
              </h1>
              <p className="text-xs text-text-muted mt-0.5">
                Archived security evaluations, threat indicators, and risk scores.
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-text-dim">
          Total Records: {pagination.total}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bg-card border border-border-dark rounded-xl p-4 shadow-card-glow space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-dim absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by URL, domain, or email snippet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-bg-secondary border border-border-dark focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan text-xs text-text-main placeholder-text-dim font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-accent-cyan text-bg-dark font-semibold text-xs hover:bg-cyan-400 transition-all shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-dark/60 text-xs">
          {/* Type filters */}
          <div className="flex items-center gap-2">
            <span className="text-text-dim">Type:</span>
            {['all', 'url', 'email'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setPagination(prev => ({ ...prev, page: 1 })); }}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  type === t
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40 font-semibold'
                    : 'text-text-muted hover:text-text-main bg-bg-secondary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Risk Level filter */}
          <div className="flex items-center gap-2">
            <span className="text-text-dim">Risk Level:</span>
            <select
              value={riskLevel}
              onChange={(e) => { setRiskLevel(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
              className="px-2.5 py-1 rounded-md bg-bg-secondary border border-border-dark text-text-main focus:outline-none focus:border-accent-cyan capitalize"
            >
              <option value="all">All Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-text-dim">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-bg-secondary border border-border-dark text-text-main focus:outline-none focus:border-accent-cyan"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Records Table / Cards */}
      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : scans.length === 0 ? (
        <div className="bg-bg-card border border-border-dark rounded-2xl p-12 text-center space-y-3">
          <History className="w-10 h-10 text-text-dim mx-auto" />
          <h3 className="text-base font-bold text-text-main">No Scan Records Found</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            No scans match your current filter criteria or none have been submitted yet.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard/scan-url"
              className="px-4 py-2 rounded-lg bg-accent-cyan text-bg-dark font-semibold text-xs inline-block"
            >
              Run First Scan
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-bg-card border border-border-dark rounded-xl shadow-card-glow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-dark bg-bg-secondary/60 text-text-dim uppercase tracking-wider font-mono">
                  <th className="p-4 font-semibold">Target / Input</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Score</th>
                  <th className="p-4 font-semibold">Risk Classification</th>
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark font-mono">
                {scans.map((scan) => {
                  let badge = 'text-status-success bg-status-success/10 border-status-success/30';
                  if (scan.riskLevel === 'medium') badge = 'text-status-warning bg-status-warning/10 border-status-warning/30';
                  if (scan.riskLevel === 'high') badge = 'text-status-danger bg-status-danger/10 border-status-danger/30';
                  if (scan.riskLevel === 'critical') badge = 'text-red-500 bg-red-500/10 border-red-500/30';

                  return (
                    <tr key={scan._id} className="hover:bg-bg-secondary/40 transition-colors">
                      <td className="p-4 max-w-xs truncate text-text-main font-mono">
                        {scan.normalizedInput}
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 font-sans capitalize text-text-muted">
                          {scan.scanType === 'url' ? (
                            <Globe className="w-3.5 h-3.5 text-accent-cyan" />
                          ) : (
                            <Mail className="w-3.5 h-3.5 text-accent-purple" />
                          )}
                          {scan.scanType}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-text-main">
                        {scan.riskScore}/100
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${badge}`}>
                          {scan.riskLevel}
                        </span>
                      </td>
                      <td className="p-4 text-text-dim text-[11px]">
                        {new Date(scan.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 font-sans">
                          <Link
                            to={`/dashboard/scan/${scan._id}`}
                            className="px-2.5 py-1 rounded bg-bg-secondary hover:bg-slate-800 text-accent-cyan text-xs font-medium border border-border-dark"
                          >
                            Details
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(scan._id)}
                            className="p-1 rounded text-text-dim hover:text-status-danger hover:bg-status-danger/10"
                            title="Delete scan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-border-dark flex items-center justify-between text-xs text-text-muted">
              <div>
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="p-1.5 rounded bg-bg-secondary border border-border-dark text-text-main disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="p-1.5 rounded bg-bg-secondary border border-border-dark text-text-main disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Scan Record"
        message="Are you sure you want to permanently delete this scan record and its associated security alerts from your audit log?"
        confirmLabel="Delete Permanently"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

