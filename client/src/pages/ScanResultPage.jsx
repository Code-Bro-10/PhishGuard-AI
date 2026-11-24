import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Globe,
  Mail,
  Download,
  Printer,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  FileCode,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { scanApi } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';
import { IndicatorList } from '../components/IndicatorList';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

export const ScanResultPage = () => {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScan = async () => {
      try {
        setLoading(true);
        const res = await scanApi.getScanById(id);
        if (res.success && res.data) {
          setScan(res.data);
        } else {
          setError('Scan record not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load scan record.');
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [id]);

  const handleDownloadJson = () => {
    if (!scan) return;
    const blob = new Blob([JSON.stringify(scan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PhishGuard-Scan-${scan._id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Scan report downloaded as JSON.');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <LoadingSkeleton count={3} type="general" />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <AlertCircle className="w-12 h-12 text-status-danger mx-auto" />
        <h2 className="text-xl font-bold text-text-main">Record Not Available</h2>
        <p className="text-xs text-text-muted">{error || 'Unable to access the requested scan.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex px-4 py-2 rounded-lg bg-bg-card border border-border-dark text-xs font-semibold text-text-main hover:bg-slate-800"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 print:p-0 print:m-0 print:max-w-full">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">
              Scan ID: {scan._id}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-main mt-0.5">
            Security Intelligence Report
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-bg-card border border-border-dark hover:border-slate-600 text-xs font-medium text-text-main transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-bg-card border border-border-dark hover:border-slate-600 text-xs font-medium text-text-main transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Print Report</span>
          </button>
          <Link
            to={scan.scanType === 'url' ? '/dashboard/scan-url' : '/dashboard/analyze-email'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-cyan text-bg-dark text-xs font-bold hover:bg-cyan-400 transition-all shadow-cyan-glow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </Link>
        </div>
      </div>

      {/* Main Score & Target Header Card */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-6 sm:p-8 shadow-card-glow relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Risk Gauge in Col 1 */}
          <div className="flex justify-center border-b md:border-b-0 md:border-r border-border-dark pb-6 md:pb-0 md:pr-6">
            <RiskGauge score={scan.riskScore} level={scan.riskLevel} size={190} />
          </div>

          {/* Target Metadata in Cols 2-3 */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
                {scan.scanType === 'url' ? <Globe className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan font-mono">
                {scan.scanType === 'url' ? 'URL Threat Evaluation' : 'Email Content Evaluation'}
              </span>
              <span className="text-text-dim text-xs font-mono">•</span>
              <span className="text-xs text-text-dim font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(scan.createdAt).toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-1">
                Analyzed Target:
              </span>
              <div className="p-3.5 rounded-xl bg-bg-secondary border border-border-dark font-mono text-xs text-text-main break-all max-h-32 overflow-y-auto leading-relaxed">
                {scan.originalInput}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-1">
              <div>
                <span className="text-text-dim">Risk Classification:</span>
                <p className="font-bold uppercase text-text-main mt-0.5">
                  {scan.riskLevel} ({scan.riskScore}/100)
                </p>
              </div>
              <div>
                <span className="text-text-dim">Threat Indicators Flagged:</span>
                <p className="font-bold text-text-main mt-0.5">
                  {scan.detectedIndicators?.length || 0} indicators
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detected Indicators List */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-6 sm:p-8 shadow-card-glow space-y-4">
        <div className="flex items-center justify-between border-b border-border-dark pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-base font-bold text-text-main">
              Detected Threat Indicators & Explanations
            </h2>
          </div>
          <span className="text-xs text-text-dim font-mono">
            {scan.detectedIndicators?.length || 0} Rule Matches
          </span>
        </div>

        <IndicatorList indicators={scan.detectedIndicators} />
      </div>

      {/* Security Defense Recommendations */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-6 sm:p-8 shadow-card-glow space-y-4">
        <div className="flex items-center gap-2 border-b border-border-dark pb-4">
          <Shield className="w-5 h-5 text-status-success" />
          <h2 className="text-base font-bold text-text-main">
            Security Recommendations & Mitigation Steps
          </h2>
        </div>

        <ul className="space-y-2.5">
          {scan.recommendations && scan.recommendations.length > 0 ? (
            scan.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-xs text-text-muted bg-bg-secondary/60 p-3 rounded-lg border border-border-dark"
              >
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))
          ) : (
            <li className="text-xs text-text-dim">No specific action required. Standard cyber hygiene advised.</li>
          )}
        </ul>
      </div>

      {/* Disclaimer Card */}
      <div className="p-4 rounded-xl bg-bg-secondary/40 border border-border-dark text-[11px] text-text-dim leading-relaxed">
        <strong>Defensive Security Notice:</strong> PhishGuard AI is an automated heuristic analysis system designed to identify indicators of compromise. Absence of flagged threats does not guarantee benign intent, and detection of anomalies does not constitute definitive proof of malice. Always exercise defense-in-depth and corroborate critical links with your security operations team.
      </div>
    </div>
  );
};

