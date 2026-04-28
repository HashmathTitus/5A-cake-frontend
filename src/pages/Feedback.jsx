import React, { useEffect, useMemo, useState } from 'react';
import { PlusCircle, Filter, Star, Upload, Smile } from 'lucide-react';
import { feedbackAPI, eventsAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import ImagePreview from '../components/common/ImagePreview';
import Modal from '../components/common/Modal';
import { showToast } from '../components/common/Toast';
import { fallbackEventImage, galleryImages } from '../utils/imageAssets';

const initialFormState = {
  name: '',
  email: '',
  eventId: '',
  description: '',
  rating: 5,
};

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [feedbackResponse, eventResponse] = await Promise.all([
          feedbackAPI.getPublic(selectedEvent),
          eventsAPI.getAll(),
        ]);

        setFeedbacks(feedbackResponse.data.feedbacks || []);
        setEvents(eventResponse.data.events || []);
      } catch (error) {
        showToast('Failed to load public feedback', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedEvent]);

  useEffect(() => {
    if (!images.length) {
      setImagePreviews([]);
      return undefined;
    }

    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const filteredFeedback = useMemo(() => feedbacks, [feedbacks]);

  const handleSubmitFeedback = async (event) => {
    event.preventDefault();

    const submitFormData = new FormData();
    submitFormData.append('name', formData.name);
    submitFormData.append('email', formData.email);
    submitFormData.append('eventId', formData.eventId);
    submitFormData.append('description', formData.description);
    submitFormData.append('rating', formData.rating);
    images.forEach((image) => submitFormData.append('images', image));

    try {
      await feedbackAPI.create(submitFormData);
      showToast('Feedback submitted successfully', 'success');
      setFormOpen(false);
      setFormData(initialFormState);
      setImages([]);
      setSelectedEvent(formData.eventId || selectedEvent);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to submit feedback', 'error');
    }
  };

  const renderStars = (rating) => {
    const numericRating = Number(rating || 0);
    return '★'.repeat(Math.max(1, Math.round(numericRating)));
  };

  if (loading) {
    return <Loading message="Loading guest feedback..." />;
  }

  return (
    <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
      <section className="section-shell pb-10 pt-24 lg:pb-14 lg:pt-28">
        <div className="grid gap-6 overflow-hidden rounded-[2.25rem] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 p-6 sm:p-10">
            <p className="eyebrow">Guest feedback</p>
            <h1 className="max-w-2xl text-4xl font-semibold text-slate-900 sm:text-5xl">Celebrate the moments. Review the experience. Add your voice.</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Feedback cards are tied to real events, rated publicly, and can include image uploads with a lightbox preview.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setFormOpen(true)} className="premium-button-primary">
                <PlusCircle className="h-4 w-4" />
                Submit Feedback
              </button>
              <button onClick={() => setSelectedEvent('')} className="premium-button-secondary">
                <Filter className="h-4 w-4" />
                Clear Filter
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setSelectedEvent('')}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${!selectedEvent ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                All events
              </button>
              {events.map((event) => (
                <button
                  key={event._id}
                  onClick={() => setSelectedEvent(event._id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${selectedEvent === event._id ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200'}`}
                >
                  {event.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden">
            <img src={galleryImages[0]} alt="Feedback preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.15),rgba(15,23,42,0.7))]" />
            <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 text-white backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">Preview</p>
              <h2 className="mt-2 text-2xl font-semibold">Uploaded feedback images open in a clean lightbox</h2>
              <p className="mt-2 text-sm leading-6 text-white/80">Use the form below to submit your own review, complete with photos from the event.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-16 lg:pb-20">
        {filteredFeedback.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredFeedback.map((feedback) => {
              const feedbackImages = feedback.images && feedback.images.length > 0 ? feedback.images : [fallbackEventImage];

              return (
                <article key={feedback._id} className="glass-card overflow-hidden rounded-[2rem]">
                  <div className="grid grid-cols-[0.9fr_1.1fr] gap-0">
                    <img
                      src={feedbackImages[0]}
                      alt={feedback.name}
                      className="h-full min-h-[220px] w-full cursor-pointer object-cover"
                      onClick={() => {
                        setPreviewImages(feedbackImages);
                        setPreviewOpen(true);
                      }}
                    />
                    <div className="space-y-4 p-5">
                      <div>
                        <p className="eyebrow">{feedback.eventId?.name || 'Event feedback'}</p>
                        <h3 className="mt-2 text-2xl font-semibold text-slate-900">{feedback.name}</h3>
                      </div>

                      <p className="text-sm leading-6 text-slate-600">{feedback.description}</p>

                      <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                        <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">{renderStars(feedback.rating)}</span>
                        <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                      </div>

                      <button onClick={() => { setPreviewImages(feedbackImages); setPreviewOpen(true); }} className="premium-button-secondary w-full">
                        View Images
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-[2rem] p-8 text-center">
            <img src={fallbackEventImage} alt="No feedback yet" className="mx-auto h-64 w-full max-w-2xl rounded-[1.75rem] object-cover" />
            <h2 className="mt-6 text-3xl font-semibold text-slate-900">No feedback has been published yet</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Use the feedback form to share the first review for a specific event.</p>
            <button onClick={() => setFormOpen(true)} className="mt-6 premium-button-primary">
              <Smile className="h-4 w-4" />
              Submit Feedback
            </button>
          </div>
        )}
      </section>

      <ImagePreview images={previewImages} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="Share Your Experience" size="lg">
        <form onSubmit={handleSubmitFeedback} className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Event</label>
              <select
                value={formData.eventId}
                onChange={(event) => setFormData({ ...formData, eventId: event.target.value })}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>{event.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Rating</label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData.rating}
                onChange={(event) => setFormData({ ...formData, rating: Number(event.target.value) })}
                className="w-full"
              />
              <p className="mt-1 text-sm text-slate-500">Current rating: {formData.rating}/5</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Your feedback</label>
              <textarea
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                required
                minLength={10}
                rows={8}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Upload images</label>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => setImages(Array.from(event.target.files || []).slice(0, 10))}
                  className="w-full text-sm"
                />
                <div className="mt-3 flex flex-wrap gap-3">
                  {imagePreviews.map((preview) => (
                    <img key={preview} src={preview} alt="Selected preview" className="h-16 w-16 rounded-xl object-cover" />
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="premium-button-primary w-full">
              <Upload className="h-4 w-4" />
              Submit Feedback
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Feedback;
