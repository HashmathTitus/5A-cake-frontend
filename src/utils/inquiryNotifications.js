const statusConfig = {
  new: {
    label: 'New',
    className: 'border border-sky-200 bg-sky-100 text-sky-700',
  },
  contacted: {
    label: 'Contacted',
    className: 'border border-indigo-200 bg-indigo-100 text-indigo-700',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'border border-emerald-200 bg-emerald-100 text-emerald-700',
  },
  completed: {
    label: 'Completed',
    className: 'border border-teal-200 bg-teal-100 text-teal-700',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'border border-rose-200 bg-rose-100 text-rose-700',
  },
  all: {
    label: 'All',
    className: 'border border-slate-200 bg-white text-slate-700',
  },
};

export const inquiryStatusBadgeBaseClass = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]';

export const getInquiryStatusLabel = (status = '') => {
  const normalizedStatus = String(status || '').toLowerCase();
  return statusConfig[normalizedStatus]?.label || normalizedStatus.replace(/^\w/, (letter) => letter.toUpperCase()) || 'Unknown';
};

export const getInquiryStatusBadgeClass = (status = '') => {
  const normalizedStatus = String(status || '').toLowerCase();
  return statusConfig[normalizedStatus]?.className || 'border border-slate-200 bg-slate-100 text-slate-700';
};

export const cleanWhatsAppPhone = (phone = '') => String(phone).replace(/\D/g, '');

export const hasLikelyCountryCode = (phone = '') => {
  const trimmedPhone = String(phone).trim();
  return trimmedPhone.startsWith('+') || trimmedPhone.startsWith('00');
};

export const getInquiryStatusWhatsAppMessage = (inquiry, status) => {
  const name = inquiry?.name || 'there';
  const normalizedStatus = String(status || '').toLowerCase();
  const messageByStatus = {
    new: `Hi ${name}, thank you for sending your event request to 5A Events. We have received your inquiry and will review it shortly.`,
    contacted: `Hi ${name}, thank you for contacting 5A Events. We have reviewed your event request and will contact you shortly to discuss the details.`,
    confirmed: `Hi ${name}, your event booking request with 5A Events has been confirmed. We will contact you with the next details soon.`,
    completed: `Hi ${name}, thank you for choosing 5A Events. We hope you loved our service. We would be happy to work with you again.`,
    cancelled: `Hi ${name}, your booking request has been marked as cancelled. Please contact us if you need any further assistance.`,
  };

  const details = [
    inquiry?.eventType ? `Event type: ${inquiry.eventType}` : '',
    inquiry?.eventDate ? `Event date: ${new Date(inquiry.eventDate).toLocaleDateString()}` : '',
    inquiry?.location ? `Location: ${inquiry.location}` : '',
  ].filter(Boolean);

  return [messageByStatus[normalizedStatus] || messageByStatus.new, ...details].join('\n\n');
};

export const getInquiryWhatsAppUrl = (inquiry, status) => {
  const phone = cleanWhatsAppPhone(inquiry?.phone);
  if (!phone) {
    return '';
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(getInquiryStatusWhatsAppMessage(inquiry, status))}`;
};
