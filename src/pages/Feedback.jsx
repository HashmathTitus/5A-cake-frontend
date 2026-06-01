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

const getImageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || image.secure_url || image.path || '';
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
        <section className="section-shell pb-12 pt-20 sm:pt-24 lg:pt-28">
          <div className="grid gap-0 overflow-hidden rounded-[1.75rem] bg-slate-900 text-white shadow-2xl sm:rounded-[2.25rem] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4 p-5 sm:space-y-5 sm:p-10">
              <p className="eyebrow !text-amber-300">Private review</p>
              <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-5xl">Share your feedback for {tokenEvent?.name || 'this completed event'}.</h1>
              <p className="max-w-xl text-sm leading-7 text-white/75">
                This form is linked to your private review link. The event cannot be changed manually.
              </p>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-white/70">You are reviewing</p>
                <p className="mt-1 text-lg font-semibold">{tokenEvent?.name || 'This completed event'}</p>
                <p className="text-sm text-white/75">{tokenEvent?.category || 'Completed project'}</p>
                <p className="text-sm text-white/75">{tokenEvent?.location || 'Location not shown'}</p>
              </div>
            </div>

            <div className="relative min-h-[220px] overflow-hidden sm:min-h-[280px] lg:min-h-[320px]">
              <img src={getImageUrl(tokenEvent?.coverImage) || galleryImages[0]} alt={tokenEvent?.name || 'Review form'} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.7))]" />
            </div>
          </div>
        </section>

        <section className="section-shell pb-12 sm:pb-16 lg:pb-20">
          {submitted ? (
            <div className="glass-card rounded-[1.5rem] p-5 text-center sm:rounded-[2rem] sm:p-8">
              <MessageSquareText className="mx-auto h-12 w-12 text-amber-600" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">Thank you for your review</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Your feedback has been saved and will appear publicly after admin moderation.</p>
              <Link to="/gallery" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
                Back to Gallery
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="glass-card rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-8">
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
      <section className="section-shell pb-8 pt-20 sm:pt-24 lg:pb-14 lg:pt-28">
        <div className="grid gap-0 overflow-hidden rounded-[1.75rem] bg-slate-900 text-white shadow-2xl sm:rounded-[2.25rem] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 p-5 sm:space-y-5 sm:p-10">
            <p className="eyebrow !text-amber-300">Customer reviews</p>
            <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-5xl">Verified feedback from completed event projects.</h1>
            <p className="max-w-xl text-sm leading-7 text-white/75">
              Only published reviews appear here. Private feedback links are sent separately to real customers after the event is completed.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-2.5 text-center text-sm font-semibold text-slate-900 sm:w-auto">
                Have a feedback link? Open it from your message.
              </div>
              <Link to="/gallery" className="premium-button-secondary w-full !border-white/20 !bg-white/10 !text-white hover:!bg-white/20 sm:w-auto">
                View Gallery
              </Link>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 pt-2 sm:flex-wrap sm:overflow-visible">
              <button onClick={() => setSelectedEvent('')} className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${!selectedEvent ? 'bg-white text-slate-900' : 'bg-white/10 text-white'}`}>
                All reviews
              </button>
              {events.map((event) => (
                <button
                  key={event._id}
                  onClick={() => setSelectedEvent(event._id)}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${selectedEvent === event._id ? 'bg-amber-500 text-white' : 'bg-white/10 text-white'}`}
                >
                  {event.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[220px] overflow-hidden sm:min-h-[280px] lg:min-h-[320px]">
            <img src={galleryImages[0]} alt="Verified reviews" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.15),rgba(15,23,42,0.7))]" />
            <div className="absolute bottom-4 left-4 right-4 rounded-[1.25rem] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/70 sm:text-xs sm:tracking-[0.28em]">Moderation</p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Published reviews only appear after admin approval</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-12 sm:pb-16 lg:pb-20">
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filteredReviews.map((review) => {
              const uploadedReviewImages = Array.isArray(review.images) ? review.images.map(getImageUrl).filter(Boolean) : [];
              const reviewImages = uploadedReviewImages.length > 0 ? uploadedReviewImages : [fallbackEventImage];

              return (
                <article key={review._id} className="glass-card overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                  <div className="grid grid-cols-1 gap-0 xl:grid-cols-[0.9fr_1.1fr]">
                    <img
                      src={reviewImages[0]}
                      alt={review.customerName}
                      className="h-44 w-full cursor-pointer object-cover sm:h-52 xl:h-full xl:min-h-[220px]"
                      onClick={() => {
                        setPreviewImages(reviewImages);
                        setPreviewOpen(true);
                      }}
                    />
                    <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
                      <div>
                        <p className="eyebrow">{review.eventId?.name || 'Completed event'}</p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">{review.customerName}</h3>
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
          <div className="glass-card overflow-hidden rounded-[1.5rem] p-5 text-center sm:rounded-[2rem] sm:p-8">
            <img src={fallbackEventImage} alt="No reviews yet" className="mx-auto h-44 w-full max-w-2xl rounded-[1.25rem] object-cover sm:h-64 sm:rounded-[1.75rem]" />
            <h2 className="mt-5 text-2xl font-semibold text-slate-900 sm:mt-6 sm:text-3xl">No published reviews yet</h2>
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
