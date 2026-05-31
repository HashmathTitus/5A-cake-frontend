import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Star, ArrowLeft, Sparkles } from 'lucide-react';
import { eventsAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import ImagePreview from '../components/common/ImagePreview';
import { showToast } from '../components/common/Toast';
import { fallbackEventImage } from '../utils/imageAssets';
import { SOCIAL_LINKS } from '../utils/constants';

const GalleryDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await eventsAPI.getById(id);
        setEvent(response.data.event || response.data.data?.event || null);
      } catch (error) {
        showToast('Failed to load gallery item', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (loading) {
    return <Loading message="Loading gallery details..." />;
  }

  if (!event) {
    return (
      <div className="section-shell py-24 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Gallery item not found</h1>
        <Link to="/gallery" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>
      </div>
    );
  }

  const images = (event.images && event.images.length > 0 ? event.images : [event.coverImage?.url || fallbackEventImage]).filter(Boolean);

  return (
    <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
      <section className="section-shell pb-16 pt-24 lg:pb-20 lg:pt-28">
        <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>

        <div className="mt-4 grid gap-6 overflow-hidden rounded-[2.25rem] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1fr_0.95fr]">
          <div className="relative min-h-[380px] overflow-hidden">
            <img src={images[0]} alt={event.name} className="h-full w-full object-cover" onClick={() => setPreviewOpen(true)} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.5))]" />
            <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900">
              {event.category || 'Gallery'}
            </div>
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <p className="eyebrow">Gallery detail</p>
            <h1 className="text-4xl font-semibold text-slate-900">{event.name}</h1>
            <p className="text-sm leading-7 text-slate-600">{event.description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500"><CalendarDays className="h-4 w-4 text-amber-600" /> Date</div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{event.date ? new Date(event.date).toLocaleDateString() : 'To be confirmed'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500"><MapPin className="h-4 w-4 text-amber-600" /> Location</div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{event.location || 'Venue not disclosed'}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-amber-800"><Star className="h-4 w-4" /> Public rating</div>
              <p className="mt-2">{Number(event.averageRating || 0).toFixed(1)} average rating from {event.feedbackCount || 0} published reviews.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/book" state={{ eventId: event._id, eventName: event.name }} className="premium-button-primary flex-1">
                Request Similar Setup
              </Link>
              <a href={SOCIAL_LINKS.whatsapp(`Hello 5A Events, I would like a quote for a setup similar to ${event.name}.`)} target="_blank" rel="noreferrer" className="premium-button-secondary flex-1">
                WhatsApp Booking
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Published gallery content only. Admin access stays hidden.
            </div>
          </div>
        </div>
      </section>

      <ImagePreview images={images} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
};

export default GalleryDetail;