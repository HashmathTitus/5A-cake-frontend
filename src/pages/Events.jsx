import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Star, Sparkles } from 'lucide-react';
import { eventsAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import ImagePreview from '../components/common/ImagePreview';
import { showToast } from '../components/common/Toast';
import { fallbackEventImage, heroBannerImage } from '../utils/imageAssets';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

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
    if (statusFilter === 'all') return events;
    return events.filter((event) => event.status === statusFilter);
  }, [events, statusFilter]);

  if (loading) {
    return <Loading message="Gathering upcoming events..." />;
  }

  return (
    <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
      <section className="section-shell pb-10 pt-24 lg:pb-14 lg:pt-28">
        <div className="grid gap-6 overflow-hidden rounded-[2.25rem] bg-slate-900 text-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5 p-6 sm:p-10">
            <p className="eyebrow !text-amber-300">Event showcase</p>
            <h1 className="max-w-xl text-4xl font-semibold sm:text-5xl">Premium event spaces, stages, cakes, and curated setups.</h1>
            <p className="max-w-xl text-sm leading-7 text-white/75">
              Browse the collection of events and visual concepts already stored in the system. Each card uses real asset-backed photography or a graceful fallback image.
            </p>

            <div className="flex flex-wrap gap-3">
              {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${statusFilter === status ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {status === 'all' ? 'All Events' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <Link to="/feedback" className="premium-button-primary bg-white text-slate-900 hover:bg-amber-50">
              Submit Feedback
            </Link>
          </div>

          <div className="relative min-h-[320px]">
            <img src={heroBannerImage} alt="Events hero" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.6))]" />
            <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-3">
              {[
                ['Events', events.length],
                ['Average Rating', '5-star ready'],
                ['Style', 'Hospitality-first'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70">{label}</p>
                  <p className="mt-1 text-xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-16 lg:pb-20">
        {visibleEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleEvents.map((event) => {
              const eventImage = event.images && event.images.length > 0 ? event.images[0] : fallbackEventImage;

              return (
                <article key={event._id} className="glass-card overflow-hidden rounded-[2rem]">
                  <div className="relative">
                    <img
                      src={eventImage}
                      alt={event.name}
                      className="h-64 w-full cursor-pointer object-cover transition duration-500 hover:scale-[1.03]"
                      onClick={() => {
                        setPreviewImages(event.images?.length ? event.images : [fallbackEventImage]);
                        setPreviewOpen(true);
                      }}
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-xl">
                      {event.status}
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-900">{event.name}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
                      </div>
                      <Sparkles className="mt-1 h-5 w-5 text-amber-500" />
                    </div>

                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-amber-600" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      {event.location ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-amber-600" />
                          <span>{event.location}</span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-600" />
                        <span>{Number(event.averageRating || 0).toFixed(1)} average rating • {event.feedbackCount || 0} reviews</span>
                      </div>
                    </div>

                    <Link to="/feedback" className="premium-button-primary w-full">
                      Share Your Feedback
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-[2rem] p-8 text-center">
            <img src={fallbackEventImage} alt="No events yet" className="mx-auto h-64 w-full max-w-2xl rounded-[1.75rem] object-cover" />
            <h2 className="mt-6 text-3xl font-semibold text-slate-900">No events match this filter yet</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Use the admin panel to create a new event concept, or switch back to the full list.</p>
            <button onClick={() => setStatusFilter('all')} className="mt-6 premium-button-primary">
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
