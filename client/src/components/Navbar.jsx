import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Menu, X, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-dark/80 bg-bg-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan group-hover:shadow-cyan-glow transition-all">
            <Shield className="w-5 h-5 text-accent-cyan" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-wider text-text-main flex items-center gap-1">
              PhishGuard <span className="text-accent-cyan text-xs font-mono px-1.5 py-0.5 rounded bg-accent-cyan/15 border border-accent-cyan/30">AI</span>
            </span>
            <span className="text-[10px] text-text-dim tracking-wider font-mono -mt-1">INTELLIGENT DEFENSE</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
          <a href="#features" className="hover:text-accent-cyan transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-accent-cyan transition-colors">How It Works</a>
          <a href="#detection-engine" className="hover:text-accent-cyan transition-colors">15 Heuristic Checks</a>
          <a href="#tech-stack" className="hover:text-accent-cyan transition-colors">Architecture</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan text-bg-dark font-semibold text-sm hover:bg-cyan-400 transition-all shadow-cyan-glow"
              >
                <LayoutDashboard className="w-4 h-4" />
                Console
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="p-2 rounded-lg text-text-dim hover:text-status-danger transition-colors border border-border-dark"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-cyan text-bg-dark font-semibold text-sm hover:bg-cyan-400 transition-all shadow-cyan-glow"
              >
                Start Scanning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-main border border-border-dark"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-dark bg-bg-secondary p-4 space-y-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-text-muted hover:text-accent-cyan py-1"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-text-muted hover:text-accent-cyan py-1"
          >
            How It Works
          </a>
          <a
            href="#detection-engine"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-text-muted hover:text-accent-cyan py-1"
          >
            15 Heuristic Checks
          </a>
          <div className="pt-3 border-t border-border-dark flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-accent-cyan text-bg-dark font-semibold text-sm"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg border border-border-dark text-sm text-text-main"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-accent-cyan text-bg-dark font-semibold text-sm"
                >
                  Start Scanning
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

