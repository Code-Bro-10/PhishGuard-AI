import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Globe,
  Shield,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { scanApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const UrlScannerPage = () => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // If URL passed in query params, auto-fill
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramUrl = params.get('url');
    if (paramUrl) {
      setUrl(paramUrl);
    }
  }, [location.search]);

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please provide a target URL to analyze.');
      return;
    }

    try {
      setScanning(true);
      const res = await scanApi.scanUrl(url.trim());
      if (res.success && res.data) {
        toast.success(`URL analysis complete. Risk score: ${res.data.riskScore}/100`);
        navigate(`/dashboard/scan/${res.data._id}`);
      }
    } catch (err) {
      setError(err.message || 'Scan failed.');
      toast.error(err.message || 'Scan execution error');
    } finally {
      setScanning(false);
    }
  };

  const sampleFixtures = [
    { label: 'Safe Domain', url: 'https://example.com', badge: 'Benign' },
    { label: 'Brand Impersonation', url: 'https://paypal.com.account-update.xyz/login', badge: 'High Risk' },
    { label: 'Raw IP Host', url: 'http://192.168.1.100:8888/login', badge: 'Suspicious' },
    { label: 'Deceptive "@" Symbol', url: 'https://google.com@attacker-site.com/verify', badge: 'High Risk' },
    { label: 'Dangerous Executable', url: 'https://cloud-receipts.net/invoice.exe', badge: 'Malicious' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-main">
              URL Phishing & Malicious Link Scanner
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              15-layer static heuristic inspection, domain spoofing analysis, and threat reputation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Scanner Card */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-6 sm:p-8 shadow-card-glow backdrop-blur-md">
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 font-mono">
              Target URL
            </label>
            <div className="relative">
              <Globe className="w-5 h-5 text-accent-cyan absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                disabled={scanning}
                placeholder="https://example.com/login or http://192.168.1.1/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-secondary border border-border-dark focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan text-sm text-text-main placeholder-text-dim font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-text-dim flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Safe sandbox: zero SSRF, zero arbitrary external fetching.</span>
            </div>

            <button
              type="submit"
              disabled={scanning}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-accent-cyan text-bg-dark font-bold text-sm hover:bg-cyan-400 transition-all shadow-cyan-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-bg-dark border-t-transparent rounded-full animate-spin"></div>
                  <span>Evaluating 15 Heuristic Rules...</span>
                </>
              ) : (
                <>
                  <span>Execute Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* 1-Click Test Fixtures */}
        <div className="mt-8 pt-6 border-t border-border-dark">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5 font-mono">
            <Zap className="w-3.5 h-3.5 text-accent-cyan" />
            Quick Test Fixtures (1-Click Load & Test)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {sampleFixtures.map((fixture, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrl(fixture.url)}
                className="p-3 text-left rounded-lg bg-bg-secondary/60 hover:bg-bg-secondary border border-border-dark hover:border-accent-cyan/40 transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-text-main group-hover:text-accent-cyan transition-colors">
                    {fixture.label}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-text-dim border border-slate-700">
                    {fixture.badge}
                  </span>
                </div>
                <div className="text-[11px] text-text-dim font-mono truncate">
                  {fixture.url}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heuristic Checks Explanatory Card */}
      <div className="bg-bg-secondary/50 border border-border-dark rounded-xl p-5 text-xs text-text-muted space-y-2">
        <h4 className="font-semibold text-text-main flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-cyan" />
          Heuristic Engine Integrity Guarantee:
        </h4>
        <p className="leading-relaxed">
          The detection engine uses a safe, explainable rule-based scoring system. Analysis is performed strictly against structural URI components and string attributes. No network packets are dispatched to the submitted host, preventing Server-Side Request Forgery (SSRF) and ensuring the host machine remains safe from payload execution.
        </p>
      </div>
    </div>
  );
};

