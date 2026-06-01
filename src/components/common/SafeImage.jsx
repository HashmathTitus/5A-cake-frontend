import React, { useState } from 'react';

const SafeImage = ({ src, alt, className = '', placeholder = 'No image available', onClick }) => {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = typeof src === 'string' ? src.trim() : '';

  if (!resolvedSrc || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 px-4 text-sm font-semibold text-slate-500">
        {placeholder}
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => {
        console.warn('Image failed to load:', resolvedSrc);
        setFailed(true);
      }}
    />
  );
};

export default SafeImage;
