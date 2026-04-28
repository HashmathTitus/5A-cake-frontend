import React from 'react';

export const Loading = ({ message = 'Loading the experience...' }) => (
  <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
    <div className="rounded-[2rem] border border-white/60 bg-white/80 px-8 py-10 text-center shadow-xl backdrop-blur-xl">
      <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">5A Events</p>
      <p className="mt-2 text-base text-slate-700">{message}</p>
    </div>
  </div>
);

export const Spinner = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-4',
  }[size];

  return <div className={`animate-spin rounded-full border-slate-200 border-t-amber-600 ${sizeClass}`} />;
};

export default Loading;
