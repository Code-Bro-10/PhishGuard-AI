import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-bg-card border border-border-dark rounded-xl max-w-md w-full p-6 shadow-2xl relative"
        >
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="absolute top-4 right-4 text-text-dim hover:text-text-main transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-full ${isDestructive ? 'bg-status-danger/10 text-status-danger' : 'bg-status-warning/10 text-status-warning'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main">{title}</h3>
              <p className="text-sm text-text-muted mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main bg-bg-secondary hover:bg-slate-800 transition-colors border border-border-dark"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center gap-2 ${
                isDestructive
                  ? 'bg-status-danger hover:bg-red-600 text-white'
                  : 'bg-accent-cyan hover:bg-cyan-400 text-bg-dark'
              }`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              )}
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

