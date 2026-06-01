import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Star, Sparkles, ArrowRight } from 'lucide-react';
import { eventsAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import ImagePreview from '../components/common/ImagePreview';
import { showToast } from '../components/common/Toast';
import SafeImage from '../components/common/SafeImage';
import { fallbackEventImage, heroBannerImage } from '../utils/imageAssets';
import { SOCIAL_LINKS } from '../utils/constants';
import { getEventCoverImage, getEventImages } from '../utils/eventImages';
import { getStatusBadgeClass, getStatusLabel, statusBadgeBaseClass } from '../utils/statusStyles';

const categoryOptions = ['all', 'Birthday Decorations', 'Wedding Decorations', 'Engagement Setups', 'Corporate Events', 'Custom Event Styling'];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsAPI.getAll();
        setEvents(response.data.events || []);
      } catch (error) {
        showToast('Failed to load events', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const visibleEvents = useMemo(() => {
    if (categoryFilter === 'all') return events;
    return events.filter((event) => (event.category || 'General Event') === categoryFilter);
  }, [events, categoryFilter]);

  if (loading) {
    return <Loading message="Gathering upcoming events..." />;
  }

  return (
    <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
      <section className="section-shell pb-8 pt-20 sm:pt-24 lg:pb-14 lg:pt-28">
        <div className="grid gap-0 overflow-hidden rounded-[1.75rem] bg-slate-900 text-white shadow-2xl sm:rounded-[2.25rem] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 p-5 sm:space-y-5 sm:p-10">
            <p className="eyebrow !text-amber-300">Our work</p>
            <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-5xl">A polished gallery of celebrations, decor, cakes, and styled event spaces.</h1>
            <p className="max-w-xl text-sm leading-7 text-white/75">
              {/* Browse completed and published projects. Each card highlights the visual style, category, and real event details that matter to new clients. */}
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:gap-3 sm:overflow-visible">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${categoryFilter === category ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {category === 'all' ? 'All Projects' : category}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/book" className="premium-button-primary w-full bg-white text-slate-900 hover:bg-amber-50 sm:w-auto">
                Request a Quote
              </Link>
              <a href={SOCIAL_LINKS.whatsapp('Hello 5A Events, I would like to request a similar setup from your gallery.')} target="_blank" rel="noreferrer" className="premium-button-secondary w-full !border-white/20 !bg-white/10 !text-white hover:!bg-white/20 sm:w-auto">
                WhatsApp Booking
              </a>
            </div>
            <Link to="/reviews" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-white">
              See verified reviews <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative min-h-[220px] overflow-hidden sm:min-h-[280px] lg:min-h-[320px]">
            <img src={heroBannerImage} alt="Events hero" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.6))]" />
            <div className="absolute bottom-4 left-4 right-4 grid gap-2 sm:bottom-6 sm:left-6 sm:right-6 sm:grid-cols-3 sm:gap-3">
              {[
                ['Projects', events.length],
                ['Average Rating', 'Verified reviews'],
                ['Style', 'Gallery-first'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl sm:p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.16em] text-white/70 sm:text-xs sm:tracking-[0.25em]">{label}</p>
                  <p className="mt-1 text-base font-semibold sm:text-xl">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-12 sm:pb-16 lg:pb-20">
        {visibleEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {visibleEvents.map((event) => {
              const eventImages = getEventImages(event);
              const eventImage = getEventCoverImage(event);
              const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'Date to be confirmed';
              const eventCategory = event.category || 'General Event';
              const previewSet = eventImages.length > 0 ? eventImages : [fallbackEventImage];

              return (
                <article key={event._id} className="glass-card overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 sm:h-56 md:h-64">
                    <SafeImage
                      src={eventImage}
                      alt={event.name || 'Event image'}
                      className="h-full w-full cursor-pointer object-cover transition duration-500 hover:scale-[1.03]"
                      onClick={() => {
                        setPreviewImages(previewSet);
                        setPreviewOpen(true);
                      }}
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xl sm:left-4 sm:top-4 sm:text-xs sm:tracking-[0.25em]">
                      {eventCategory}
                    </div>
                    {event.featured ? (
                      <div className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xl sm:right-4 sm:top-4 sm:text-xs sm:tracking-[0.22em]">
                        Featured
                      </div>
                    ) : null}
                    <div className={`absolute bottom-3 left-3 ${statusBadgeBaseClass} ${getStatusBadgeClass(event.visibility || 'published')} shadow-sm backdrop-blur-xl sm:bottom-4 sm:left-4`}>
                      {getStatusLabel(event.visibility || 'published')}
                    </div>
                  </div>

                  <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{event.name}</h2>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{event.description}</p>
                      </div>
                      <Sparkles className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 sm:space-y-3">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0 text-amber-600" />
                        <span>{eventDate}</span>
                      </div>
                      {event.location ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-amber-600" />
                          <span>{event.location}</span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 shrink-0 text-amber-600" />
                        <span>{Number(event.averageRating || 0).toFixed(1)} rating - {event.feedbackCount || 0} reviews</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Link to={`/gallery/${event._id}`} className="premium-button-primary w-full">
                        View Details
                      </Link>
                      <Link to="/book" state={{ eventId: event._id, eventName: event.name }} className="premium-button-secondary w-full">
                        Request Similar Setup
                      </Link>
                    </div>
                    <a href={SOCIAL_LINKS.whatsapp(`Hello 5A Events, I would like a similar setup to ${event.name}.`)} target="_blank" rel="noreferrer" className="premium-button-secondary w-full">
                      WhatsApp This Setup
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-[1.5rem] p-5 text-center sm:rounded-[2rem] sm:p-8">
            <img src={fallbackEventImage} alt="No events yet" className="mx-auto h-44 w-full max-w-2xl rounded-[1.25rem] object-cover sm:h-64 sm:rounded-[1.75rem]" />
            <h2 className="mt-5 text-2xl font-semibold text-slate-900 sm:mt-6 sm:text-3xl">No projects match this filter yet</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Try a different category or open the full gallery to browse all published work.</p>
            <button onClick={() => setCategoryFilter('all')} className="mt-5 premium-button-primary sm:mt-6">
              Reset Filter
            </button>
          </div>
        )}
      </section>

      <ImagePreview images={previewImages} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
};

export default Events;
