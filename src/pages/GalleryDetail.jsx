import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Star, ArrowLeft, Sparkles } from 'lucide-react';
import { eventsAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import ImagePreview from '../components/common/ImagePreview';
import { showToast } from '../components/common/Toast';
import SafeImage from '../components/common/SafeImage';
import { fallbackEventImage } from '../utils/imageAssets';
import { SOCIAL_LINKS } from '../utils/constants';
import { getEventCoverImage, getEventImages } from '../utils/eventImages';
import { getStatusBadgeClass, getStatusLabel, statusBadgeBaseClass } from '../utils/statusStyles';

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

  const images = getEventImages(event);
  const coverImage = getEventCoverImage(event);
  const previewImages = images.length > 0 ? images : [fallbackEventImage];

  return (
    <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
      <section className="section-shell pb-12 pt-20 sm:pt-24 lg:pb-20 lg:pt-28">
        <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>

        <div className="mt-4 grid gap-0 overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:rounded-[2.25rem] lg:grid-cols-[1fr_0.95fr]">
          <div className="relative h-56 overflow-hidden bg-slate-100 sm:h-[380px] lg:h-auto lg:min-h-[380px]">
            <SafeImage
              src={coverImage}
              alt={event.name || 'Event image'}
              className="h-full w-full cursor-pointer object-cover"
              onClick={() => setPreviewOpen(true)}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.5))]" />
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-900 sm:left-5 sm:top-5 sm:text-xs sm:tracking-[0.25em]">
              {event.category || 'Gallery'}
            </div>
            <div className={`absolute bottom-4 left-4 ${statusBadgeBaseClass} ${getStatusBadgeClass(event.visibility || 'published')} shadow-sm sm:left-5`}>
              {getStatusLabel(event.visibility || 'published')}
            </div>
          </div>

          <div className="space-y-4 p-5 sm:space-y-5 sm:p-8">
            <p className="eyebrow">Gallery detail</p>
            <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">{event.name}</h1>
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link to="/book" state={{ eventId: event._id, eventName: event.name }} className="premium-button-primary w-full">
                Request Similar Setup
              </Link>
              <a href={SOCIAL_LINKS.whatsapp(`Hello 5A Events, I would like a quote for a setup similar to ${event.name}.`)} target="_blank" rel="noreferrer" className="premium-button-secondary w-full">
                WhatsApp Booking
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
              Published gallery content only. Admin access stays hidden.
            </div>
          </div>
        </div>
      </section>

      <ImagePreview images={previewImages} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
};

export default GalleryDetail;
