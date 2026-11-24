import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Shield,
  ArrowRight,
  AlertCircle,
  FileText,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import { scanApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const EmailAnalyzerPage = () => {
  const [content, setContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim() || content.trim().length < 5) {
      setError('Please provide at least 5 characters of email content to analyze.');
      return;
    }

    try {
      setAnalyzing(true);
      const res = await scanApi.scanEmail(content.trim());
      if (res.success && res.data) {
        toast.success(`Email analyzed successfully. Risk score: ${res.data.riskScore}/100`);
        navigate(`/dashboard/scan/${res.data._id}`);
      }
    } catch (err) {
      setError(err.message || 'Analysis failed.');
      toast.error(err.message || 'Analysis error');
    } finally {
      setAnalyzing(false);
    }
  };

  const sampleEmails = [
    {
      title: 'Credential Harvesting & Threat',
      type: 'Phishing',
      text: `URGENT SECURITY ALERT: Immediate action required!
Your account will be suspended within 24 hours due to unauthorized activity.
Please verify your password immediately by clicking the link below or replying with your login credentials.
Link: http://192.168.1.50/verify-login-credentials`,
    },
    {
      title: 'OTP / 2FA Theft Attack',
      type: 'Phishing',
      text: `Dear Customer,
We detected a suspicious sign-in to your bank portal from an unrecognized browser.
To safeguard your funds, please share the 6-digit one-time passcode (OTP) that was just sent to your phone.
Respond immediately to prevent account termination.`,
    },
    {
      title: 'Advance-Fee / Lottery Scam',
      type: 'Phishing',
      text: `Congratulations! You have been selected to receive $1,500,000 in our international lottery payout!
Claim your cash prize now. Send your bank account details and wire transfer confirmation fee to release the funds.`,
    },
    {
      title: 'Benign Corporate Meeting Notice',
      type: 'Legitimate',
      text: `Hi Team,
Please find attached the agenda for our upcoming product retrospective scheduled for Wednesday at 10:00 AM.
Feel free to add your talking points to the shared document before tomorrow morning.
Best regards,
Operations Management`,
    },
  ];

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent-purple/15 text-accent-purple border border-accent-purple/30">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-main">
              Email Phishing & Social Engineering Analyzer
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Inspects email text for psychological coercion, credential demands, and fraudulent lures.
            </p>
          </div>
        </div>
      </div>

      {/* Main Analyzer Card */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-6 sm:p-8 shadow-card-glow backdrop-blur-md">
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Disclaimer Banner */}
        <div className="mb-4 p-3.5 rounded-xl bg-bg-secondary border border-border-dark flex items-start gap-3 text-xs text-text-muted">
          <Info className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-text-main">Heuristic Analysis Notice:</strong> Email text is analyzed heuristically for psychological urgency, credential solicitation, and deceptive patterns. Sender authenticity (SPF, DKIM, DMARC) cannot be proven from pasted body text alone.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
                Email Content / Body Text
              </label>
              <span className="text-[11px] font-mono text-text-dim">
                {wordCount} words | {charCount} characters
              </span>
            </div>
            <textarea
              rows={8}
              required
              disabled={analyzing}
              placeholder="Paste email message text here for threat analysis..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 rounded-xl bg-bg-secondary border border-border-dark focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple text-sm text-text-main placeholder-text-dim font-mono leading-relaxed resize-y"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={analyzing}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-accent-purple text-white font-bold text-sm hover:bg-purple-600 transition-all shadow-purple-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Social Engineering Patterns...</span>
                </>
              ) : (
                <>
                  <span>Analyze Email Content</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* 1-Click Sample Email Templates */}
        <div className="mt-8 pt-6 border-t border-border-dark">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
            Sample Email Templates (1-Click Load)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sampleEmails.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setContent(sample.text)}
                className="p-3 text-left rounded-lg bg-bg-secondary/60 hover:bg-bg-secondary border border-border-dark hover:border-accent-purple/40 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-text-main">
                    {sample.title}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      sample.type === 'Phishing'
                        ? 'bg-status-danger/10 text-status-danger border border-status-danger/30'
                        : 'bg-status-success/10 text-status-success border border-status-success/30'
                    }`}
                  >
                    {sample.type}
                  </span>
                </div>
                <p className="text-[11px] text-text-dim line-clamp-2 leading-relaxed">
                  {sample.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

