import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { authApi } from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success('Authenticated successfully. Welcome back!');
      navigate(redirectUrl);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('analyst@phishguard.ai');
    setPassword('CyberGuard2026!');
    try {
      setLoading(true);
      setError('');
      // Attempt login or register if not existing yet
      try {
        await login('analyst@phishguard.ai', 'CyberGuard2026!');
      } catch (err) {
        // If demo user does not exist in db yet, create it
        await authApi.register({
          name: 'Security Analyst Demo',
          email: 'analyst@phishguard.ai',
          password: 'CyberGuard2026!',
        });
        await login('analyst@phishguard.ai', 'CyberGuard2026!');
      }
      toast.success('Logged in as Security Analyst Demo!');
      navigate(redirectUrl);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            SOC Analyst Sign In
          </h1>
          <p className="text-xs text-text-muted">
            Enter your credentials to access the PhishGuard AI detection engine.
          </p>
        </div>

        <div className="bg-bg-card border border-border-dark rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-dim absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="analyst@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-bg-secondary border border-border-dark focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan text-sm text-text-main placeholder-text-dim"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-dim absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-bg-secondary border border-border-dark focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan text-sm text-text-main placeholder-text-dim"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-accent-cyan text-bg-dark font-bold text-sm hover:bg-cyan-400 transition-all shadow-cyan-glow flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-bg-dark border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Shortcut */}
          <div className="mt-5 pt-5 border-t border-border-dark">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent-purple/15 hover:bg-accent-purple/25 text-purple-300 border border-accent-purple/40 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
              <span>One-Click Demo Login</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-accent-cyan hover:underline font-semibold">
            Create an Analyst Account
          </Link>
        </p>
      </div>
    </div>
  );
};
