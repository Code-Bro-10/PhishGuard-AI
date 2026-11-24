import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      const newToast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message, title = 'Success') => addToast({ type: 'success', title, message }),
    error: (message, title = 'Error') => addToast({ type: 'error', title, message }),
    warning: (message, title = 'Warning') => addToast({ type: 'warning', title, message }),
    info: (message, title = 'Notice') => addToast({ type: 'info', title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((item) => {
            let borderColor = 'border-accent-cyan';
            let icon = <Info className="w-5 h-5 text-accent-cyan shrink-0" />;

            if (item.type === 'success') {
              borderColor = 'border-status-success';
              icon = <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />;
            } else if (item.type === 'error') {
              borderColor = 'border-status-danger';
              icon = <AlertCircle className="w-5 h-5 text-status-danger shrink-0" />;
            } else if (item.type === 'warning') {
              borderColor = 'border-status-warning';
              icon = <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />;
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto bg-bg-card/95 backdrop-blur-md border ${borderColor} rounded-lg p-4 shadow-xl flex items-start gap-3`}
              >
                {icon}
                <div className="flex-1 min-w-0">
                  {item.title && (
                    <h4 className="text-sm font-semibold text-text-main">{item.title}</h4>
                  )}
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed break-words">
                    {item.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(item.id)}
                  className="text-text-dim hover:text-text-main transition-colors p-1"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

