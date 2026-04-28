export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '+1234567890';
export const CONTACT_EMAIL = process.env.REACT_APP_CONTACT_EMAIL || 'contact@example.com';
export const INSTAGRAM_URL = process.env.REACT_APP_INSTAGRAM_URL || 'https://instagram.com/5a_events';
export const FACEBOOK_URL = process.env.REACT_APP_FACEBOOK_URL || 'https://facebook.com/5aevents';

export const CONTACT_CONFIG = {
  whatsapp: WHATSAPP_NUMBER,
  email: CONTACT_EMAIL,
  instagramUrl: INSTAGRAM_URL,
  facebookUrl: FACEBOOK_URL,
};

export const SOCIAL_LINKS = {
  whatsapp: (message = 'Hi! I would like to book an event or ask about feedback.') =>
    `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
  email: (subject = 'Event Inquiry') =>
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`,
  instagram: () => INSTAGRAM_URL,
  facebook: () => FACEBOOK_URL,
};

export const ROUTES = {
  home: '/',
  events: '/events',
  feedback: '/feedback',
  feedbackDetail: '/feedback/:id',
  contact: '/contact',
  adminLogin: '/admin/login',
  adminDashboard: '/admin/dashboard',
  adminEvents: '/admin/events',
  adminFeedback: '/admin/feedback',
};
