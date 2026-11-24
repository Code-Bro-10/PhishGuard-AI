import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  Mail,
  History,
  Radio,
  BarChart3,
  User,
  LogOut,
  Shield,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'URL Scanner', path: '/dashboard/scan-url', icon: Globe },
    { name: 'Email Analyzer', path: '/dashboard/analyze-email', icon: Mail },
    { name: 'Scan History', path: '/dashboard/history', icon: History },
    { name: 'Threat Intelligence', path: '/dashboard/threat-intel', icon: Radio },
    { name: 'Security Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Profile & Settings', path: '/dashboard/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-bg-secondary border-r border-border-dark w-64 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-border-dark flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-accent-cyan/15 border border-accent-cyan/40 text-accent-cyan">
            <Shield className="w-5 h-5 text-accent-cyan" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-wider text-text-main flex items-center gap-1.5">
              PhishGuard <span className="text-[10px] text-accent-cyan font-mono px-1.5 py-0.2 rounded bg-accent-cyan/20 border border-accent-cyan/30">AI</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
              <span className="text-[10px] text-text-dim tracking-wider font-mono">SOC ONLINE</span>
            </div>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-wider text-text-dim px-3 py-2">
          Security Core
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 shadow-sm'
                    : 'text-text-muted hover:text-text-main hover:bg-bg-card/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-text-dim" />
            </NavLink>
          );
        })}
      </nav>

      {/* User Information & Logout */}
      <div className="p-3 border-t border-border-dark bg-bg-card/40">
        <div className="flex items-center justify-between p-2 rounded-lg bg-bg-secondary border border-border-dark/60">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-text-main truncate">
              {user?.name || 'Security Analyst'}
            </p>
            <p className="text-[11px] text-text-dim truncate">
              {user?.email || 'analyst@phishguard.ai'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-text-dim hover:text-status-danger hover:bg-status-danger/10 rounded-md transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 max-w-xs h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

