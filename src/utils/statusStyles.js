const statusConfig = {
  draft: {
    label: 'Draft',
    className: 'border border-slate-200 bg-slate-100 text-slate-700',
  },
  published: {
    label: 'Published',
    className: 'border border-emerald-200 bg-emerald-100 text-emerald-700',
  },
  completed: {
    label: 'Completed',
    className: 'border border-indigo-200 bg-indigo-100 text-indigo-700',
  },
  hidden: {
    label: 'Hidden',
    className: 'border border-rose-200 bg-rose-100 text-rose-700',
  },
  upcoming: {
    label: 'Upcoming',
    className: 'border border-sky-200 bg-sky-100 text-sky-700',
  },
  ongoing: {
    label: 'Ongoing',
    className: 'border border-blue-200 bg-blue-100 text-blue-700',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'border border-rose-200 bg-rose-100 text-rose-700',
  },
  featured: {
    label: 'Featured',
    className: 'border border-amber-200 bg-amber-100 text-amber-700',
  },
  pending: {
    label: 'Pending',
    className: 'border border-amber-200 bg-amber-100 text-amber-700',
  },
  rejected: {
    label: 'Rejected',
    className: 'border border-rose-200 bg-rose-100 text-rose-700',
  },
  all: {
    label: 'All',
    className: 'border border-slate-200 bg-white text-slate-700',
  },
};

export const getStatusLabel = (status = '') => {
  const normalizedStatus = String(status || '').toLowerCase();
  return statusConfig[normalizedStatus]?.label || normalizedStatus.replace(/^\w/, (letter) => letter.toUpperCase()) || 'Unknown';
};

export const getStatusBadgeClass = (status = '') => {
  const normalizedStatus = String(status || '').toLowerCase();
  return statusConfig[normalizedStatus]?.className || 'border border-slate-200 bg-slate-100 text-slate-700';
};

export const statusBadgeBaseClass = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]';
