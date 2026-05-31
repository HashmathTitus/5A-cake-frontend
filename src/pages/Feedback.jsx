import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Upload, ShieldCheck, ArrowRight, MessageSquareText } from 'lucide-react';
import { eventsAPI, feedbackAPI, reviewTokenAPI, getApiErrorMessage } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import ImagePreview from '../components/common/ImagePreview';
import { showToast } from '../components/common/Toast';
import { fallbackEventImage, galleryImages } from '../utils/imageAssets';

const initialReviewForm = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  rating: 5,
  message: '',
};

const Feedback = () => {
  const { eventId, token } = useParams();
  const isTokenMode = Boolean(eventId && token);

  const [reviews, setReviews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [formData, setFormData] = useState(initialReviewForm);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tokenEvent, setTokenEvent] = useState(null);
  const [tokenStatus, setTokenStatus] = useState('loading');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!images.length) {
      setImagePreviews([]);
      return undefined;
    }

    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(objectUrls);

    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    const fetchPublicReviews = async () => {
      setLoading(true);
      try {
        const [reviewResponse, eventResponse] = await Promise.all([
          feedbackAPI.getPublic(selectedEvent),
          eventsAPI.getPublic(),
        ]);

        setReviews(reviewResponse.data.feedbacks || []);
        setEvents(eventResponse.data.events || []);
      } catch (error) {
        showToast('Failed to load customer reviews', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (!isTokenMode) {
      fetchPublicReviews();
    }
  }, [selectedEvent, isTokenMode]);

  useEffect(() => {
    if (!isTokenMode) {
      return undefined;
    }

    const validateToken = async () => {
      setLoading(true);
      setTokenStatus('loading');
      try {
        const response = await reviewTokenAPI.validate(eventId, token);
        setTokenEvent(response.data.event || response.data.data?.event || null);
        setTokenStatus('valid');
      } catch (error) {
        setTokenStatus('invalid');
        showToast(getApiErrorMessage(error, 'Invalid feedback link'), 'error');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [eventId, isTokenMode, token]);

  const filteredReviews = useMemo(() => reviews, [reviews]);
  const renderStars = (rating) => '★'.repeat(Math.max(1, Math.round(Number(rating || 0))));

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append('customerName', formData.customerName);
      submitData.append('customerEmail', formData.customerEmail);
      submitData.append('customerPhone', formData.customerPhone);
      submitData.append('rating', formData.rating);
      submitData.append('message', formData.message);
      images.forEach((image) => submitData.append('images', image));

      await reviewTokenAPI.submit(eventId, token, submitData);
      showToast('Thank you. Your review has been submitted for moderation.', 'success');
      setSubmitted(true);
      setFormData(initialReviewForm);
      setImages([]);
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Failed to submit review'), 'error');
    }
  };

  if (loading) {
    return <Loading message={isTokenMode ? 'Validating your private review link...' : 'Loading customer reviews...'} />;
  }

  if (isTokenMode) {
    if (tokenStatus === 'invalid') {
      return (
        <div className="section-shell py-24 text-center">
          <div className="mx-auto max-w-xl rounded-[2rem] border border-rose-200 bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
            <ShieldCheck className="mx-auto h-12 w-12 text-rose-600" />
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Invalid or expired review link</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Please ask the business to resend your private feedback link.</p>
            <Link to="/gallery" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
              Back to Gallery
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
        <section className="section-shell pb-16 pt-24 lg:pt-28">
          <div className="grid gap-6 overflow-hidden rounded-[2.25rem] bg-slate-900 text-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5 p-6 sm:p-10">
              <p className="eyebrow !text-amber-300">Private review</p>
              <h1 className="max-w-xl text-4xl font-semibold sm:text-5xl">Share your feedback for {tokenEvent?.name || 'this completed event'}.</h1>
              <p className="max-w-xl text-sm leading-7 text-white/75">
                This form is linked to your private review link. The event cannot be changed manually.
              </p>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-white/70">Linked event</p>
                <p className="mt-1 text-lg font-semibold">{tokenEvent?.category || 'Completed project'}</p>
                <p className="text-sm text-white/75">{tokenEvent?.location || 'Location not shown'}</p>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden">
              <img src={(tokenEvent?.coverImage && tokenEvent.coverImage.url) || galleryImages[0]} alt={tokenEvent?.name || 'Review form'} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.7))]" />
            </div>
          </div>
        </section>

        <section className="section-shell pb-16 lg:pb-20">
          {submitted ? (
            <div className="glass-card rounded-[2rem] p-8 text-center">
              <MessageSquareText className="mx-auto h-12 w-12 text-amber-600" />
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">Thank you for your review</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Your feedback has been saved and will appear publicly after admin moderation.</p>
              <Link to="/gallery" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
                Back to Gallery
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="glass-card rounded-[2rem] p-6 sm:p-8">
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Your name</label>
                    <input value={formData.customerName} onChange={(event) => setFormData({ ...formData, customerName: event.target.value })} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                    <input value={formData.customerEmail} onChange={(event) => setFormData({ ...formData, customerEmail: event.target.value })} type="email" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
                    <input value={formData.customerPhone} onChange={(event) => setFormData({ ...formData, customerPhone: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Rating</label>
                    <input type="range" min="1" max="5" step="1" value={formData.rating} onChange={(event) => setFormData({ ...formData, rating: Number(event.target.value) })} className="w-full" />
                    <p className="mt-1 text-sm text-slate-500">Current rating: {formData.rating}/5</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Your review</label>
                    <textarea value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} required minLength={10} rows={8} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Upload images</label>
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
                      <input type="file" multiple accept="image/*" onChange={(event) => setImages(Array.from(event.target.files || []).slice(0, 3))} className="w-full text-sm" />
                      <div className="mt-3 flex flex-wrap gap-3">
                        {imagePreviews.map((preview) => (
                          <img key={preview} src={preview} alt="Selected preview" className="h-16 w-16 rounded-xl object-cover" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="premium-button-primary w-full">
                    <Upload className="h-4 w-4" />
                    Submit Review
                  </button>
                </div>
              </div>
            </form>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
      <section className="section-shell pb-10 pt-24 lg:pb-14 lg:pt-28">
        <div className="grid gap-6 overflow-hidden rounded-[2.25rem] bg-slate-900 text-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5 p-6 sm:p-10">
            <p className="eyebrow !text-amber-300">Customer reviews</p>
            <h1 className="max-w-xl text-4xl font-semibold sm:text-5xl">Verified feedback from completed event projects.</h1>
            <p className="max-w-xl text-sm leading-7 text-white/75">
              Only published reviews appear here. Private feedback links are sent separately to real customers after the event is completed.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/book" className="premium-button-primary bg-white text-slate-900 hover:bg-amber-50">
                Request a Quote
              </Link>
              <Link to="/gallery" className="premium-button-secondary !border-white/20 !bg-white/10 !text-white hover:!bg-white/20">
                View Gallery
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => setSelectedEvent('')} className={`rounded-full px-4 py-2 text-sm font-semibold ${!selectedEvent ? 'bg-white text-slate-900' : 'bg-white/10 text-white'}`}>
                All reviews
              </button>
              {events.map((event) => (
                <button
                  key={event._id}
                  onClick={() => setSelectedEvent(event._id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${selectedEvent === event._id ? 'bg-amber-500 text-white' : 'bg-white/10 text-white'}`}
                >
                  {event.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden">
            <img src={galleryImages[0]} alt="Verified reviews" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.15),rgba(15,23,42,0.7))]" />
            <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 text-white backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">Moderation</p>
              <h2 className="mt-2 text-2xl font-semibold">Published reviews only appear after admin approval</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-16 lg:pb-20">
        {filteredReviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredReviews.map((review) => {
              const reviewImages = review.images && review.images.length > 0 ? review.images : [fallbackEventImage];

              return (
                <article key={review._id} className="glass-card overflow-hidden rounded-[2rem]">
                  <div className="grid grid-cols-[0.9fr_1.1fr] gap-0">
                    <img
                      src={reviewImages[0]}
                      alt={review.customerName}
                      className="h-full min-h-[220px] w-full cursor-pointer object-cover"
                      onClick={() => {
                        setPreviewImages(reviewImages);
                        setPreviewOpen(true);
                      }}
                    />
                    <div className="space-y-4 p-5">
                      <div>
                        <p className="eyebrow">{review.eventId?.name || 'Completed event'}</p>
                        <h3 className="mt-2 text-2xl font-semibold text-slate-900">{review.customerName}</h3>
                      </div>

                      <p className="text-sm leading-6 text-slate-600">{review.message}</p>

                      <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                        <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">{renderStars(review.rating)}</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>

                      <button onClick={() => { setPreviewImages(reviewImages); setPreviewOpen(true); }} className="premium-button-secondary w-full">
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
            <img src={fallbackEventImage} alt="No reviews yet" className="mx-auto h-64 w-full max-w-2xl rounded-[1.75rem] object-cover" />
            <h2 className="mt-6 text-3xl font-semibold text-slate-900">No published reviews yet</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Once the first verified review is approved, it will appear here.</p>
            <Link to="/book" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
              <ArrowRight className="h-4 w-4" />
              Request a Quote
            </Link>
          </div>
        )}
      </section>

      <ImagePreview images={previewImages} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
};

export default Feedback;
