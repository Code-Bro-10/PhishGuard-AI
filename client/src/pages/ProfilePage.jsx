import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Key,
  Trash2,
  LogOut,
  Shield,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { userApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Account Deletion State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    try {
      setProfileSaving(true);
      const res = await userApi.updateProfile({ name: name.trim() });
      if (res.success && res.data) {
        updateUser(res.data);
        toast.success('Analyst profile updated successfully.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Both current and new passwords are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    try {
      setPasswordSaving(true);
      const res = await userApi.changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success('Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true);
      await userApi.deleteAccount();
      toast.info('Your account and all associated scan data have been permanently removed.');
      logout();
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to delete account.');
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-main">
              Analyst Profile & Security Settings
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Manage credential settings, profile identity, and account lifecycle.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-6 sm:p-8 shadow-card-glow space-y-6">
        <div className="flex items-center gap-3 border-b border-border-dark pb-4">
          <Shield className="w-5 h-5 text-accent-cyan" />
          <h2 className="text-base font-bold text-text-main">Identity Information</h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 font-mono">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-dark focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan text-sm text-text-main"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 font-mono">
              Email Address (Immutable)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary/40 border border-border-dark/60 text-sm text-text-dim cursor-not-allowed font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="px-6 py-2.5 rounded-lg bg-accent-cyan text-bg-dark font-bold text-xs hover:bg-cyan-400 transition-all shadow-cyan-glow flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{profileSaving ? 'Saving...' : 'Update Name'}</span>
          </button>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-6 sm:p-8 shadow-card-glow space-y-6">
        <div className="flex items-center gap-3 border-b border-border-dark pb-4">
          <Key className="w-5 h-5 text-accent-purple" />
          <h2 className="text-base font-bold text-text-main">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 font-mono">
              Current Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-dark focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple text-sm text-text-main"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 font-mono">
              New Password (Min. 6 Characters)
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-dark focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple text-sm text-text-main"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 font-mono">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-dark focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple text-sm text-text-main"
            />
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="px-6 py-2.5 rounded-lg bg-accent-purple text-white font-bold text-xs hover:bg-purple-600 transition-all shadow-purple-glow flex items-center gap-2 disabled:opacity-50"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{passwordSaving ? 'Updating...' : 'Change Password'}</span>
          </button>
        </form>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-bg-card border border-status-danger/30 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-border-dark pb-4">
          <Trash2 className="w-5 h-5 text-status-danger" />
          <h2 className="text-base font-bold text-status-danger">Danger Zone: Delete Account</h2>
        </div>

        <p className="text-xs text-text-muted leading-relaxed">
          Deleting your analyst account will permanently purge your user profile, all associated scan audit history, and security alert records from the database. This action is irreversible.
        </p>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="px-5 py-2.5 rounded-lg bg-status-danger/15 hover:bg-status-danger/25 text-status-danger border border-status-danger/40 font-semibold text-xs transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Permanently Delete Account</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Permanently Delete Analyst Account"
        message="Are you certain you want to delete your PhishGuard account? All URL scans, email analyses, and custom telemetry data will be erased forever."
        confirmLabel="Yes, Delete My Account"
        isLoading={isDeletingAccount}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

