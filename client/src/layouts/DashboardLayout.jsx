import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import {
  Menu,
  Bell,
  Plus,
  ShieldAlert,
  Check,
  Trash2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { alertApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const fetchAlerts = async () => {
    try {
      const res = await alertApi.getAlerts();
      if (res.success) {
        setAlerts(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch security alerts:', err.message);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [location.pathname]);

  const unreadAlerts = alerts.filter(a => !a.isRead);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await alertApi.markAsRead(id);
      setAlerts(prev => prev.map(a => (a._id === id ? { ...a, isRead: true } : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await alertApi.markAllAsRead();
      setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-bg-dark text-text-main overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-border-dark bg-bg-secondary/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-card border border-border-dark"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan hidden sm:inline">
                SOC ENVIRONMENT
              </span>
              <span className="text-xs text-text-dim hidden md:inline">
                | Intelligent Threat Detection
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action Button */}
            <Link
              to="/dashboard/scan-url"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-cyan text-bg-dark text-xs font-bold hover:bg-cyan-400 transition-all shadow-cyan-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Scan Target</span>
            </Link>

            {/* Alert Center Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAlertDropdown(prev => !prev)}
                className="relative p-2 rounded-lg border border-border-dark bg-bg-card hover:bg-bg-cardHover text-text-muted hover:text-text-main transition-colors"
                aria-label="Security Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-danger text-[9px] font-bold text-white font-mono animate-pulse">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {showAlertDropdown && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border-dark bg-bg-secondary shadow-2xl z-50 overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="p-3 border-b border-border-dark flex items-center justify-between bg-bg-card/60">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-status-danger" />
                      <span className="text-xs font-bold uppercase tracking-wider text-text-main">
                        Security Alerts ({alerts.length})
                      </span>
                    </div>
                    {unreadAlerts.length > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-accent-cyan hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-border-dark">
                    {alerts.length === 0 ? (
                      <div className="p-6 text-center text-text-dim text-xs">
                        No security alerts on record.
                      </div>
                    ) : (
                      alerts.map(alert => (
                        <div
                          key={alert._id}
                          className={`p-3 text-xs transition-colors hover:bg-bg-card ${
                            !alert.isRead ? 'bg-status-danger/5 border-l-2 border-status-danger' : 'opacity-70'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-text-main block">
                              {alert.title}
                            </span>
                            {!alert.isRead && (
                              <button
                                onClick={e => handleMarkAsRead(alert._id, e)}
                                title="Mark read"
                                className="text-text-dim hover:text-status-success p-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-text-muted mt-1 leading-relaxed">
                            {alert.description}
                          </p>
                          <span className="text-[10px] text-text-dim font-mono mt-1 block">
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          onClick={() => setShowAlertDropdown(false)}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

