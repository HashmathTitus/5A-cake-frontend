import React from 'react';

export const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title, message, danger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-md rounded-[2rem] border border-white/40 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="p-6">
          <h2 className="mb-2 text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mb-6 text-sm leading-6 text-slate-600">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
                danger
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
