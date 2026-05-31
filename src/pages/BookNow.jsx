import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Sparkles, Upload } from 'lucide-react';
import { inquiriesAPI, getApiErrorMessage } from '../api/axiosClient';
import { showToast } from '../components/common/Toast';
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
      referenceImages.forEach((file) => submitData.append('referenceImages', file));

      await inquiriesAPI.create(submitData);
      showToast('Thank you. Your request has been submitted. We will contact you soon.', 'success');
      setFormData(initialFormState);
      setReferenceImages([]);
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Failed to submit your inquiry'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
      <section className="section-shell pb-10 pt-24 lg:pb-14 lg:pt-28">
        <div className="grid gap-6 overflow-hidden rounded-[2.25rem] bg-slate-900 text-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5 p-6 sm:p-10">
            <p className="eyebrow !text-amber-300">Book now</p>
            <h1 className="max-w-xl text-4xl font-semibold sm:text-5xl">Send us your event details and we’ll prepare a proper quote.</h1>
            <p className="max-w-xl text-sm leading-7 text-white/75">
              Use this form for birthdays, weddings, corporate functions, and custom décor requests. We’ll reply using your preferred contact method.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={SOCIAL_LINKS.whatsapp('Hello 5A Events, I would like to book a decoration service.')} target="_blank" rel="noreferrer" className="premium-button-primary bg-white text-slate-900 hover:bg-amber-50">
                <PhoneCall className="h-4 w-4" />
                WhatsApp
              </a>
              <Link to="/contact" className="premium-button-secondary !border-white/20 !bg-white/10 !text-white hover:!bg-white/20">
                Contact Details
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-white/70">Phone</p>
                <p className="mt-1 text-lg font-semibold">{CONTACT_CONFIG.whatsapp}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-white/70">Response</p>
                <p className="mt-1 text-lg font-semibold">Within one business day</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden">
            <img src={contactVisualImage} alt="Booking visual" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.7))]" />
            <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 text-white backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">What we need</p>
              <h2 className="mt-2 text-2xl font-semibold">Name, phone, event type, date, location, and a short brief</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-16 lg:pb-20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3 text-amber-600">
              <Sparkles className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em]">Request quote</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
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

            <textarea value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} required rows={6} placeholder="Tell us about the decoration style, colors, theme, and any special details." className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />

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
            <div className="glass-card rounded-[2rem] p-6">
              <p className="eyebrow">What happens next</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                <p>1. We receive your inquiry and log it in the admin dashboard.</p>
                <p>2. A team member reviews the brief and contacts you by your preferred method.</p>
                <p>3. We confirm the style, budget, and timeline before finalizing the booking.</p>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-6">
              <p className="eyebrow">Shortcuts</p>
              <div className="mt-4 grid gap-3">
                <a href={SOCIAL_LINKS.whatsapp('Hello 5A Events, I want to request a quote for an event setup.')} target="_blank" rel="noreferrer" className="premium-button-secondary w-full">WhatsApp booking</a>
                <Link to="/gallery" className="premium-button-secondary w-full">View our work</Link>
                <Link to="/services" className="premium-button-secondary w-full">Browse services</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookNow;
