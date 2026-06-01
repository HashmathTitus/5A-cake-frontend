import { API_BASE_URL } from './constants';

const getBackendOrigin = () => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch (error) {
    return API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
  }
};

const backendOrigin = getBackendOrigin();

const extractImageValue = (image) => {
  if (!image) {
    return null;
  }

  if (typeof image === 'string') {
    return image;
  }

  if (typeof image === 'object') {
    return image.url || image.secure_url || image.path || image.location || null;
  }

  return null;
};

const isLikelyValidImageReference = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return true;
  }

  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/') || trimmed.startsWith('/api/uploads/')) {
    return true;
  }

  if (trimmed.startsWith('/')) {
    return true;
  }

  return /[\w-]+\.(jpg|jpeg|png|webp|gif|avif|bmp|svg)$/i.test(trimmed);
};

export const resolveImageUrl = (value) => {
  const extractedValue = extractImageValue(value);
  if (extractedValue == null) {
    return '';
  }

  const trimmed = String(extractedValue).trim();
  if (!trimmed) {
    return '';
  }

  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `${window.location.protocol}${trimmed}`;
  }

  const normalized = trimmed.replace(/\\/g, '/');
  const lowerValue = normalized.toLowerCase();
  const uploadsIndex = lowerValue.lastIndexOf('/uploads/');

  if (uploadsIndex >= 0) {
    return `${backendOrigin}${normalized.slice(uploadsIndex)}`;
  }

  if (lowerValue.startsWith('uploads/')) {
    return `${backendOrigin}/${normalized}`;
  }

  if (lowerValue.startsWith('/api/uploads/')) {
    return `${backendOrigin}${normalized.slice(4)}`;
  }

  if (lowerValue.startsWith('/uploads/')) {
    return `${backendOrigin}${normalized}`;
  }

  return isLikelyValidImageReference(normalized) ? normalized : '';
};

export const getImageUrl = (image) => {
  if (!image) {
    return '';
  }

  if (typeof image === 'string') {
    return resolveImageUrl(image);
  }

  return resolveImageUrl(image);
};

export const getEventImages = (event, fallbackImage = '') => {
  const images = [];

  const imageValues = [
    ...(Array.isArray(event?.images) ? event.images : []),
    event?.coverImage,
    event?.image,
  ];

  imageValues.forEach((image) => {
    const resolved = getImageUrl(image);
    if (resolved) {
      images.push(resolved);
    }
  });

  const uniqueImages = [...new Set(images)];

  if (uniqueImages.length > 0) {
    return uniqueImages;
  }

  const fallback = resolveImageUrl(fallbackImage);
  return fallback ? [fallback] : [];
};

export const getEventCoverImage = (event, fallbackImage = '') => {
  const coverImage = getImageUrl(event?.coverImage);
  if (coverImage) return coverImage;

  if (Array.isArray(event?.images)) {
    for (const image of event.images) {
      const resolvedImage = getImageUrl(image);
      if (resolvedImage) {
        return resolvedImage;
      }
    }
  }

  const legacyImage = getImageUrl(event?.image);
  if (legacyImage) return legacyImage;

  return resolveImageUrl(fallbackImage);
};
