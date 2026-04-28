import React, { useEffect, useState } from 'react';

let toastId = 0;
const activeToasts = [];
const listeners = new Set();

const notify = () => {
  const snapshot = [...activeToasts];
  listeners.forEach((listener) => listener(snapshot));
};

const removeToast = (id) => {
  const index = activeToasts.findIndex((toast) => toast.id === id);
  if (index >= 0) {
    activeToasts.splice(index, 1);
    notify();
  }
};

export const showToast = (message, type = 'success', duration = 3200) => {
  const id = toastId += 1;
  activeToasts.push({ id, message, type });
  notify();

  if (duration > 0) {
    window.setTimeout(() => removeToast(id), duration);
  }

  return id;
};

const typeStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
};

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`pointer-events-auto flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${typeStyles[toast.type] || typeStyles.info}`}>
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={onClose} className="text-lg font-semibold leading-none opacity-70 hover:opacity-100">
        ×
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (snapshot) => setToasts(snapshot);
    listeners.add(listener);
    listener([...activeToasts]);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-[70] flex w-[min(100vw-2rem,24rem)] flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};
