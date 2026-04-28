import React, { useEffect, useState } from 'react';

export const ImagePreview = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    setCurrent(initialIndex);
  }, [initialIndex, images, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !images || images.length === 0) return null;

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[current]}
          alt={`Preview ${current + 1}`}
          className="max-h-[80vh] w-full rounded-[1.75rem] object-contain shadow-2xl"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-3xl text-white transition hover:bg-white/25"
        >
          ×
        </button>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl text-white transition hover:bg-white/25"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl text-white transition hover:bg-white/25"
            >
              ›
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-xl">
          {current + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
