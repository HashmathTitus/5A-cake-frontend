import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, PhoneCall, Sparkles, Upload, X } from 'lucide-react';
import { inquiriesAPI, getApiErrorMessage } from '../api/axiosClient';
import { showToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';
import { SOCIAL_LINKS, CONTACT_CONFIG } from '../utils/constants';
import { contactVisualImage } from '../utils/imageAssets';

const initialFormState = {
  name: '',
  phone: '',
  email: '',
  eventType: '',
  eventDate: '',
  location: '',
  guestCount: '',
  message: '',
  budgetRange: '',
  preferredContactMethod: 'whatsapp',
};

const eventTypes = ['Birthday Decorations', 'Wedding Decorations', 'Engagement Setup', 'Cake Table Decoration', 'Stage Decorations', 'Balloon Decorations', 'Corporate Event', 'Custom Styling'];

const BookNow = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [referenceImages, setReferenceImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
      referenceImages.forEach((file) => submitData.append('referenceImages', file));

      await inquiriesAPI.create(submitData);
      setFormData(initialFormState);
      setReferenceImages([]);
      setSuccessOpen(true);
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Failed to submit your inquiry'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
      <section className="section-shell pb-8 pt-20 sm:pt-24 lg:pb-14 lg:pt-28">
        <div className="grid gap-0 overflow-hidden rounded-[1.75rem] bg-slate-900 text-white shadow-2xl sm:rounded-[2.25rem] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 p-5 sm:space-y-5 sm:p-10">
            <p className="eyebrow !text-amber-300">Book now</p>
            <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-5xl">Send us your event details and we'll prepare a proper quote.</h1>
            <p className="max-w-xl text-sm leading-7 text-white/75">
              Use this form for birthdays, weddings, corporate functions, and custom decor requests. We'll reply using your preferred contact method.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={SOCIAL_LINKS.whatsapp('Hello 5A Events, I would like to book a decoration service.')} target="_blank" rel="noreferrer" className="premium-button-primary w-full bg-white text-slate-900 hover:bg-amber-50 sm:w-auto">
                <PhoneCall className="h-4 w-4" />
                WhatsApp
              </a>
              <Link to="/contact" className="premium-button-secondary w-full !border-white/20 !bg-white/10 !text-white hover:!bg-white/20 sm:w-auto">
                Contact Details
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl sm:p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/70 sm:text-xs sm:tracking-[0.28em]">Phone</p>
                <p className="mt-1 text-base font-semibold sm:text-lg">{CONTACT_CONFIG.whatsapp}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl sm:p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/70 sm:text-xs sm:tracking-[0.28em]">Response</p>
                <p className="mt-1 text-base font-semibold sm:text-lg">Within one business day</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[220px] overflow-hidden sm:min-h-[280px] lg:min-h-[320px]">
            <img src={contactVisualImage} alt="Booking visual" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.7))]" />
            <div className="absolute bottom-4 left-4 right-4 rounded-[1.25rem] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/70 sm:text-xs sm:tracking-[0.28em]">What we need</p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Name, phone, event type, date, location, and a short brief</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-12 sm:pb-16 lg:pb-20">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <form onSubmit={handleSubmit} className="glass-card rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-8">
            <div className="mb-6 flex items-center gap-3 text-amber-600">
              <Sparkles className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em]">Request quote</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required placeholder="Customer name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
              <input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required placeholder="Phone number" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
              <input value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="Email (optional)" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
              <select value={formData.eventType} onChange={(event) => setFormData({ ...formData, eventType: event.target.value })} required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500">
                <option value="">Select event type</option>
                {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <input type="date" value={formData.eventDate} onChange={(event) => setFormData({ ...formData, eventDate: event.target.value })} required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
              <input value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} required placeholder="Event location" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
              <input value={formData.guestCount} onChange={(event) => setFormData({ ...formData, guestCount: event.target.value })} placeholder="Estimated guest count (optional)" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
              <select value={formData.preferredContactMethod} onChange={(event) => setFormData({ ...formData, preferredContactMethod: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500">
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
              </select>
              <input value={formData.budgetRange} onChange={(event) => setFormData({ ...formData, budgetRange: event.target.value })} placeholder="Budget range (optional)" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
            </div>

            <textarea value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} required rows={5} placeholder="Tell us about the decoration style, colors, theme, and any special details." className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Reference images</label>
              <input type="file" multiple accept="image/*" onChange={(event) => setReferenceImages(Array.from(event.target.files || []).slice(0, 3))} className="w-full text-sm" />
              {referenceImages.length > 0 ? <p className="mt-2 text-xs text-slate-500">{referenceImages.length} image(s) selected</p> : null}
            </div>

            <button type="submit" disabled={submitting} className="mt-6 premium-button-primary w-full">
              <Upload className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>

          <div className="space-y-5">
            <div className="glass-card rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6">
              <p className="eyebrow">We'll Be in Touch Soon</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                <p>Thanks for your inquiry. Our team will review your request and contact you shortly with the next steps.</p>
              </div>
            </div>

            <div className="glass-card rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6">
              <p className="eyebrow">Easy Access</p>
              <div className="mt-4 grid gap-3">
                <a href={SOCIAL_LINKS.whatsapp('Hello 5A Events, I want to request a quote for an event setup.')} target="_blank" rel="noreferrer" className="premium-button-secondary w-full">WhatsApp booking</a>
                <Link to="/gallery" className="premium-button-secondary w-full">View our work</Link>
                <Link to="/services" className="premium-button-secondary w-full">Browse services</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal isOpen={successOpen} onClose={() => setSuccessOpen(false)} title="Thank you!" size="md">
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">
              Your booking request has been submitted successfully.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Our team will contact you soon through your preferred contact method.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              If your request is urgent, you can also contact us directly on WhatsApp.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link to="/" className="premium-button-primary w-full" onClick={() => setSuccessOpen(false)}>
              Back to Home
            </Link>
            <a href={SOCIAL_LINKS.whatsapp('Hello 5A Events, I submitted a booking request and would like to follow up.')} target="_blank" rel="noreferrer" className="premium-button-secondary w-full">
              <PhoneCall className="h-4 w-4" />
              WhatsApp
            </a>
            <button type="button" onClick={() => setSuccessOpen(false)} className="premium-button-secondary w-full">
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookNow;
