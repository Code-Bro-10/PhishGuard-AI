import React, { useState, useEffect } from 'react';
import {
  Radio,
  Shield,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Key,
  Info,
  Server,
} from 'lucide-react';
import { threatIntelApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const ThreatIntelligencePage = () => {
  const [status, setStatus] = useState(null);
  const [lookupUrl, setLookupUrl] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await threatIntelApi.getStatus();
        if (res.success) {
          setStatus(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
  }, []);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupUrl.trim()) return;

    try {
      setLoading(true);
      setLookupResult(null);
      const res = await threatIntelApi.lookup(lookupUrl.trim());
      if (res.success) {
        setLookupResult(res.data);
        toast.info('Threat intelligence lookup completed.');
      }
    } catch (err) {
      toast.error(err.message || 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent-purple/15 text-accent-purple border border-accent-purple/30">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-main">
              Threat Intelligence & Feeds
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Correlate local heuristic detections with external reputation indices.
            </p>
          </div>
        </div>
      </div>

      {/* Provider Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Heuristic Engine Card */}
        <div className="bg-bg-card border border-border-dark rounded-xl p-5 shadow-card-glow space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-cyan" />
              <h3 className="text-sm font-bold text-text-main">
                PhishGuard Heuristic Core
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-status-success/10 text-status-success border border-status-success/30 font-mono">
              Operational
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            15 static heuristic inspection rules analyzing URI components, character-level homoglyphs, brand spoofing, and structure.
          </p>
          <div className="pt-2 border-t border-border-dark flex items-center justify-between text-[11px] text-text-dim font-mono">
            <span>Latency: &lt; 15ms</span>
            <span>Mode: Standalone / Offline</span>
          </div>
        </div>

        {/* Google Safe Browsing API Card */}
        <div className="bg-bg-card border border-border-dark rounded-xl p-5 shadow-card-glow space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-accent-purple" />
              <h3 className="text-sm font-bold text-text-main">
                Google Safe Browsing v4
              </h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                status?.googleSafeBrowsing?.configured
                  ? 'bg-status-success/10 text-status-success border border-status-success/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}
            >
              {status?.googleSafeBrowsing?.configured ? 'Active' : 'Standby / Optional'}
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            {status?.googleSafeBrowsing?.configured
              ? 'External threat lookup active. Verified against Google threat database.'
              : 'No external API key provided in server environment. Local heuristics operate 100% independently.'}
          </p>
          <div className="pt-2 border-t border-border-dark flex items-center justify-between text-[11px] text-text-dim font-mono">
            <span>Key Storage: Backend .env</span>
            <span>Frontend: Zero Exposure</span>
          </div>
        </div>
      </div>

      {/* Live Threat Intelligence Query Tool */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-6 sm:p-8 shadow-card-glow space-y-6">
        <div>
          <h2 className="text-base font-bold text-text-main flex items-center gap-2 font-mono">
            <Search className="w-4 h-4 text-accent-cyan" />
            Live Threat Database Query
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Query a domain or URL against configured threat intelligence services without launching full scanning pipelines.
          </p>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Radio className="w-4 h-4 text-text-dim absolute left-3 top-3" />
            <input
              type="text"
              required
              disabled={loading}
              placeholder="e.g. testsafebrowsing.appspot.com or https://example.com"
              value={lookupUrl}
              onChange={(e) => setLookupUrl(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-bg-secondary border border-border-dark focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan text-xs text-text-main placeholder-text-dim font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-accent-cyan text-bg-dark font-bold text-xs hover:bg-cyan-400 transition-all shadow-cyan-glow shrink-0 disabled:opacity-50"
          >
            {loading ? 'Querying...' : 'Query Threat Feed'}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs text-text-dim">
          <span>Test indicators:</span>
          <button
            type="button"
            onClick={() => setLookupUrl('https://testsafebrowsing.appspot.com/s/phishing.html')}
            className="text-text-muted hover:text-status-danger underline font-mono text-[11px]"
          >
            Google Safe Browsing Test Fixture
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setLookupUrl('https://www.google.com')}
            className="text-text-muted hover:text-accent-cyan underline font-mono text-[11px]"
          >
            Google.com (Clean)
          </button>
        </div>

        {/* Lookup Result Box */}
        {lookupResult && (
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-dark space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border-dark pb-2 font-sans">
              <span className="font-bold text-text-main">
                Reputation Provider: {lookupResult.provider}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  lookupResult.isThreat
                    ? 'bg-status-danger/10 text-status-danger border border-status-danger/30'
                    : 'bg-status-success/10 text-status-success border border-status-success/30'
                }`}
              >
                {lookupResult.isThreat ? 'Threat Confirmed' : 'No External Threat Listed'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-text-dim">Target Queried:</span>
                <p className="text-text-main break-all">{lookupResult.queriedUrl}</p>
              </div>
              <div>
                <span className="text-text-dim">Execution Status:</span>
                <p className="text-text-main">
                  {lookupResult.executed ? 'Direct API Match' : 'Standby / Heuristic Mode'}
                </p>
              </div>
            </div>

            <div>
              <span className="text-text-dim">Details:</span>
              <p className="text-text-muted font-sans text-xs mt-0.5">
                {lookupResult.details || lookupResult.reason}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Integration Instructions */}
      <div className="bg-bg-secondary/40 border border-border-dark rounded-xl p-5 text-xs text-text-muted space-y-2">
        <h4 className="font-semibold text-text-main flex items-center gap-2">
          <Key className="w-4 h-4 text-accent-cyan" />
          External Threat Provider Architecture:
        </h4>
        <p className="leading-relaxed">
          To connect Google Safe Browsing, obtain a free API key from Google Cloud Console and set <code className="text-accent-cyan bg-slate-900 px-1 py-0.5 rounded">GOOGLE_SAFE_BROWSING_KEY=your_key</code> inside <code className="text-accent-cyan bg-slate-900 px-1 py-0.5 rounded">server/.env</code>. The application cleanly differentiates external database matches from local heuristic rule scores, ensuring defensive operations are never interrupted even when offline.
        </p>
      </div>
    </div>
  );
};

