import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Shield, Lock, Terminal, Github, Heart } from 'lucide-react';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-dark text-text-main">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-dark bg-bg-secondary/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-text-main">PhishGuard AI</span>
            </div>
            <p className="text-xs text-text-muted max-w-md leading-relaxed">
              Intelligent defensive cybersecurity platform delivering safe heuristic inspection for malicious URLs, domain spoofing, homoglyph attacks, and social engineering email threats.
            </p>
            <div className="text-[11px] text-text-dim">
              Designed as a defensive cybersecurity mini-project demonstration. Zero SSRF, zero arbitrary external fetching.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main mb-3 font-mono">
              Detection Engines
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>15 Heuristic URL Checks</li>
              <li>Homograph & IDN Analysis</li>
              <li>Brand Impersonation Classifier</li>
              <li>Email Social Engineering Parser</li>
              <li>Threat Intelligence Integrator</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main mb-3 font-mono">
              System Access
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link to="/login" className="hover:text-accent-cyan transition-colors">
                  Analyst Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-accent-cyan transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-accent-cyan transition-colors">
                  Operations Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-border-dark flex flex-col sm:flex-row items-center justify-between text-xs text-text-dim gap-4">
          <p>© 2026 PhishGuard AI. All rights reserved. Defensive Security Suite.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
            <span>All systems fully operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

