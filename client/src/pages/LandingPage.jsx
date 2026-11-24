import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Globe,
  Mail,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const [quickUrl, setQuickUrl] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;
    if (isAuthenticated) {
      navigate(`/dashboard/scan-url?url=${encodeURIComponent(quickUrl.trim())}`);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(`/dashboard/scan-url?url=${encodeURIComponent(quickUrl.trim())}`)}`);
    }
  };

  const heuristicChecks = [
    { title: 'RFC 3986 Syntax Validation', desc: 'Checks URL structural validity and unescaped parser differential exploits.' },
    { title: 'TLS / HTTPS Transport Check', desc: 'Validates transport encryption while maintaining awareness that HTTPS does not guarantee safety.' },
    { title: 'Raw IP Address Hostname', desc: 'Detects dotted decimal, hexadecimal, or octal IP hosts bypassing DNS reputations.' },
    { title: 'Subdomain Chain Stacking', desc: 'Flags deeply nested subdomains designed to obscure registered domains on mobile viewports.' },
    { title: 'Extreme String Length', desc: 'Identifies oversized URLs engineered to evade signature matching or hide tokens.' },
    { title: 'Public Shortener Detection', desc: 'Flags link shorteners (bit.ly, tinyurl, t.co) concealing final destination hostnames.' },
    { title: 'Userinfo "@" Character Lures', desc: 'Detects RFC userinfo trickery (e.g., google.com@attacker.com) fooling human readers.' },
    { title: 'Hyphen Typosquatting Analysis', desc: 'Evaluates multi-hyphen synthetic domains mimicking well-known service names.' },
    { title: 'Punycode & IDN Homoglyphs', desc: 'Catches Cyrillic and Greek unicode spoofing (e.g. xn--pple) indistinguishable to the eye.' },
    { title: 'Credential Keyword Stacking', desc: 'Flags sensitive words (login, verify, secure, update, banking, password) in suspect hosts.' },
    { title: 'Hex Encoding Obfuscation', desc: 'Analyzes heavy percent-encoding (%20, %2E) and double-percent (%25) evasion.' },
    { title: 'Non-Standard Network Ports', desc: 'Flags connections to arbitrary high ports (8888, 4444, 1337) often hosting C2 kits.' },
    { title: 'High-Risk TLD & Brand Hijacking', desc: 'Flags cheap/abused TLDs (.tk, .xyz, .top) and brand names placed in subdomains.' },
    { title: 'Dangerous Payload Extensions', desc: 'Flags direct links to executables and archives (.exe, .scr, .bat, .iso, .vbs, .apk).' },
    { title: 'Threat Intelligence Correlation', desc: 'Cross-checks with known threat indicators and optional Google Safe Browsing reputation.' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-mono tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
            NEXT-GEN CYBERSECURITY PLATFORM
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-main leading-tight sm:leading-none"
          >
            Intelligent Defense Against <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-blue-400 to-accent-purple">
              Malicious URLs & Phishing Emails
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed"
          >
            PhishGuard AI analyzes URLs and email messages through 15 safe, explainable heuristic security checks. Calculate risk scores, inspect deceptive techniques, and protect against social engineering.
          </motion.p>

          {/* Quick Scan Input Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="pt-4 max-w-2xl mx-auto"
          >
            <form onSubmit={handleQuickScan} className="relative flex items-center">
              <div className="absolute left-4 text-text-dim">
                <Globe className="w-5 h-5 text-accent-cyan" />
              </div>
              <input
                type="text"
                placeholder="Enter target URL to analyze (e.g., https://login.example.com)..."
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                className="w-full pl-12 pr-36 py-4 rounded-xl bg-bg-card border border-border-dark focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan text-sm text-text-main placeholder-text-dim shadow-card-glow font-mono"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-lg bg-accent-cyan text-bg-dark font-semibold text-sm hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-cyan-glow"
              >
                Scan Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="flex flex-wrap justify-center items-center gap-2 mt-3 text-xs text-text-dim">
              <span>Quick tests:</span>
              <button
                type="button"
                onClick={() => setQuickUrl('https://example.com')}
                className="text-text-muted hover:text-accent-cyan underline"
              >
                Safe URL
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setQuickUrl('https://paypal.com.account-update.xyz/login')}
                className="text-text-muted hover:text-status-danger underline"
              >
                Brand Spoof
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setQuickUrl('http://192.168.1.100:8888/verify')}
                className="text-text-muted hover:text-status-warning underline"
              >
                IP Host
              </button>
            </div>
          </motion.div>
        </div>

        {/* Live Security Stats Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
          {[
            { label: 'Heuristic Checks', val: '15 Active', sub: 'Multi-layer rule engine' },
            { label: 'Analysis Speed', val: '< 15 ms', sub: 'Zero SSRF latency' },
            { label: 'Safe Execution', val: '100% Offline', sub: 'No arbitrary fetching' },
            { label: 'Scoring Engine', val: '0 - 100', sub: 'Transparent risk weights' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-bg-card/70 border border-border-dark rounded-xl p-5 text-center backdrop-blur-sm"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-accent-cyan font-mono">
                {stat.val}
              </div>
              <div className="text-xs font-semibold text-text-main mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="text-[11px] text-text-dim mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-20 bg-bg-secondary/60 border-y border-border-dark px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-accent-cyan uppercase tracking-widest font-mono">
              COMPREHENSIVE CAPABILITIES
            </h2>
            <p className="text-3xl font-bold text-text-main mt-2">
              Engineered for Real-World Cybersecurity Defense
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-bg-card border border-border-dark hover:border-accent-cyan/40 rounded-xl p-6 transition-all duration-300">
              <div className="p-3 rounded-lg bg-accent-cyan/10 text-accent-cyan w-fit mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">
                15-Point URL Phishing Engine
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Evaluates URL structure, protocol security, raw IP addressing, subdomain chain depth, character-level homograph spoofing, and dangerous file extensions.
              </p>
            </div>

            <div className="bg-bg-card border border-border-dark hover:border-accent-purple/40 rounded-xl p-6 transition-all duration-300">
              <div className="p-3 rounded-lg bg-accent-purple/10 text-accent-purple w-fit mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">
                Email Social Engineering Parser
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Detects urgent deadlines, credential solicitations, 2FA/OTP theft hooks, executive impersonation, and fake lottery lures directly from pasted email bodies.
              </p>
            </div>

            <div className="bg-bg-card border border-border-dark hover:border-status-success/40 rounded-xl p-6 transition-all duration-300">
              <div className="p-3 rounded-lg bg-status-success/10 text-status-success w-fit mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">
                Threat Intelligence & Analytics
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Persistent database records, interactive Recharts telemetry, downloadable security reports, and optional Google Safe Browsing v4 reputation lookups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 15 Heuristic Checks Grid */}
      <section id="detection-engine" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-accent-cyan uppercase tracking-widest font-mono">
            DEFENSIVE RULE MATRIX
          </h2>
          <p className="text-3xl font-bold text-text-main mt-2">
            15 Heuristic Security Checks
          </p>
          <p className="text-xs text-text-muted mt-2">
            Configurable, transparent weights. No black-box guesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {heuristicChecks.map((item, index) => (
            <div
              key={index}
              className="bg-bg-card border border-border-dark hover:border-slate-700 p-4 rounded-xl transition-all"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs text-accent-cyan font-bold">
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <h4 className="text-sm font-semibold text-text-main truncate">
                  {item.title}
                </h4>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-bg-secondary/40 border-y border-border-dark px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-accent-cyan uppercase tracking-widest font-mono">
              WORKFLOW PIPELINE
            </h2>
            <p className="text-3xl font-bold text-text-main mt-2">
              How PhishGuard AI Evaluates Threats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Input Normalization', desc: 'Cleans, standardizes, and parses submitted URLs or email strings safely without making arbitrary network calls.' },
              { step: '02', title: 'Heuristic Decomposition', desc: 'Executes 15 discrete static rule checks against URI components, vocabulary patterns, and domain structures.' },
              { step: '03', title: 'Risk Score Calculation', desc: 'Aggregates weighted indicator impacts into a transparent 0-100 severity index (Low, Med, High, Critical).' },
              { step: '04', title: 'Defensive Advisory', desc: 'Generates detailed indicator rationales, actionable security recommendations, and downloadable reports.' },
            ].map((st, i) => (
              <div key={i} className="bg-bg-card border border-border-dark rounded-xl p-6 relative">
                <span className="text-3xl font-black text-accent-cyan/30 font-mono block mb-2">
                  {st.step}
                </span>
                <h3 className="text-base font-bold text-text-main mb-2">{st.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-b from-bg-card to-bg-secondary border border-border-dark rounded-2xl p-10 sm:p-14 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main">
              Ready to Inspect Suspicious URLs & Emails?
            </h2>
            <p className="text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
              Launch the PhishGuard AI Operations Console now to evaluate security threats, track scan telemetry, and safeguard digital credentials.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="px-6 py-3 rounded-xl bg-accent-cyan text-bg-dark font-bold text-sm hover:bg-cyan-400 transition-all shadow-cyan-glow flex items-center gap-2"
              >
                {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard/scan-url' : '/login'}
                className="px-6 py-3 rounded-xl bg-bg-card border border-border-dark text-text-main font-semibold text-sm hover:bg-slate-800 transition-colors"
              >
                {isAuthenticated ? 'Scan a URL' : 'Sign In'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

