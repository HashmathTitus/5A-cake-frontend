import React, { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = previousOverflow;
      };
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full ${sizeClass} max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/40 bg-white shadow-2xl`} onClick={(event) => event.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-2xl font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
