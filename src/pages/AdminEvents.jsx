import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon, Sparkles, Link2, CheckCircle2, Copy, ExternalLink, MessageCircle } from 'lucide-react';
import { eventsAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ImagePreview from '../components/common/ImagePreview';
import { showToast } from '../components/common/Toast';
import SafeImage from '../components/common/SafeImage';
import { AdminLayout } from '../components/layout/AdminLayout';
import { fallbackEventImage, galleryImages } from '../utils/imageAssets';
import { getEventCoverImage, getEventImages } from '../utils/eventImages';
import { SOCIAL_LINKS } from '../utils/constants';
import { getStatusBadgeClass, getStatusLabel, statusBadgeBaseClass } from '../utils/statusStyles';
import { getApiErrorMessage } from '../api/axiosClient';

const emptyForm = {
  name: '',
  description: '',
  date: '',
  location: '',
  category: '',
  status: 'upcoming',
  visibility: 'published',
  featured: false,
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkEventName, setLinkEventName] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!images.length) {
      setPreviewImages([]);
      return undefined;
    }

    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setPreviewImages(objectUrls);

    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAdmin();
      setEvents(response.data.events || []);
    } catch (error) {
      showToast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('date', formData.date);
    submitData.append('location', formData.location);
    submitData.append('status', formData.status);
    submitData.append('category', formData.category);
    submitData.append('visibility', formData.visibility);
    submitData.append('featured', String(formData.featured));
    images.forEach((image) => submitData.append('images', image));

    try {
      if (editingId) {
        await eventsAPI.update(editingId, submitData);
        showToast('Event updated successfully', 'success');
      } else {
        await eventsAPI.create(submitData);
        showToast('Event created successfully', 'success');
      }

      setFormOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      setImages([]);
      fetchEvents();
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Failed to save event'), 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await eventsAPI.delete(id);
      showToast('Event deleted successfully', 'success');
      fetchEvents();
    } catch (error) {
      showToast('Failed to delete event', 'error');
    }
  };

  const handleGenerateFeedbackLink = async (event) => {
    try {
      const response = await eventsAPI.generateFeedbackLink(event._id);
      const feedbackLink = response.data.feedbackLink || response.data.data?.feedbackLink || '';
      setGeneratedLink(feedbackLink);
      setLinkEventName(event.name || 'this event');
      setLinkModalOpen(true);
      if (feedbackLink && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(feedbackLink);
      }
      showToast(feedbackLink ? 'Feedback link generated and copied' : 'Feedback link generated', 'success');
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Failed to generate feedback link'), 'error');
    }
  };

  const handleCopyGeneratedLink = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      showToast('Feedback link copied', 'success');
    } catch (error) {
      showToast('Could not copy link automatically', 'error');
    }
  };

  const currentStats = useMemo(() => [
    ['All', events.length],
    ['Published', events.filter((event) => event.visibility === 'published').length],
    ['Completed', events.filter((event) => event.visibility === 'completed' || event.status === 'completed').length],
    ['Hidden', events.filter((event) => event.visibility === 'hidden').length],
  ], [events]);

  if (loading) {
    return <Loading message="Loading event management..." />;
  }

  return (
    <AdminLayout
      title="Gallery management"
      subtitle="Create, preview, update, and delete polished gallery items with public visibility and private review-link controls."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {currentStats.map(([label, value]) => (
            <div key={label} className="glass-card rounded-[1.5rem] p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow">Image-backed gallery items</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Manage real event imagery and metadata</h3>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData(emptyForm);
              setImages([]);
              setGeneratedLink('');
              setFormOpen(true);
            }}
            className="premium-button-primary"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => {
              const eventImages = getEventImages(event);
              const eventCover = getEventCoverImage(event);
              const previewSet = eventImages.length > 0 ? eventImages : [fallbackEventImage];
              const canGenerateLink = event.status === 'completed' || event.visibility === 'completed';

              return (
                <article key={event._id} className="glass-card overflow-hidden rounded-[2rem]">
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <SafeImage
                      src={eventCover}
                      alt={event.name || 'Event image'}
                      className="h-full w-full cursor-pointer object-cover"
                      onClick={() => { setPreviewImages(previewSet); setPreviewOpen(true); }}
                    />
                    <span className={`absolute left-4 top-4 ${statusBadgeBaseClass} ${getStatusBadgeClass(event.visibility || 'published')} shadow-sm`}>
                      {getStatusLabel(event.visibility || 'published')}
                    </span>
                    {event.featured ? (
                      <span className={`absolute right-4 top-4 ${statusBadgeBaseClass} ${getStatusBadgeClass('featured')} shadow-sm`}>
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-900">{event.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
                      </div>
                      <Sparkles className="mt-1 h-5 w-5 text-amber-500" />
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      <span className={`rounded-full px-3 py-1 ${getStatusBadgeClass(event.status || 'upcoming')}`}>{getStatusLabel(event.status || 'upcoming')}</span>
                      <span className={`rounded-full px-3 py-1 ${getStatusBadgeClass(event.visibility || 'published')}`}>{getStatusLabel(event.visibility || 'published')}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">{new Date(event.date).toLocaleDateString()}</span>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{event.feedbackCount || 0} feedback</span>
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">{event.category || 'General'}</span>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-1">
                      {eventImages.slice(0, 3).map((image, index) => (
                        <button key={`${event._id}-${index}`} onClick={() => { setPreviewImages(previewSet); setPreviewOpen(true); }} className="shrink-0 overflow-hidden rounded-2xl border border-slate-100">
                          <SafeImage src={image} alt={`${event.name} preview ${index + 1}`} className="h-16 w-16 object-cover" placeholder="No image" />
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setFormData({
                            name: event.name || '',
                            description: event.description || '',
                            date: event.date ? String(event.date).slice(0, 10) : '',
                            location: event.location || '',
                            category: event.category || '',
                            status: event.status || 'upcoming',
                            visibility: event.visibility || 'published',
                            featured: Boolean(event.featured),
                          });
                          setEditingId(event._id);
                          setImages([]);
                          setGeneratedLink('');
                          setFormOpen(true);
                        }}
                        className="premium-button-secondary"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button onClick={() => setDeleteConfirm({ open: true, id: event._id })} className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                      {canGenerateLink ? (
                        <button onClick={() => handleGenerateFeedbackLink(event)} className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600">
                          <Link2 className="h-4 w-4" />
                          Generate Review Link
                        </button>
                      ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                          Mark completed to generate review link
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-[2rem] p-8 text-center">
            <img src={fallbackEventImage} alt="No events available" className="mx-auto h-64 w-full max-w-2xl rounded-[1.75rem] object-cover" />
            <h3 className="mt-6 text-3xl font-semibold text-slate-900">No events have been created yet</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Create the first event to populate the public gallery.</p>
          </div>
        )}
      </div>

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editingId ? 'Edit Event' : 'Create Event'} size="lg">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Event name</label>
              <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
              <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} required rows={6} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Date</label>
                <input type="date" value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Location</label>
                <input value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
              <input value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" placeholder="Birthday Decorations" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
              <select value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Upload event images</label>
              <input type="file" multiple accept="image/*" onChange={(event) => setImages(Array.from(event.target.files || []).slice(0, 5))} className="w-full text-sm" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {(previewImages.length > 0 ? previewImages : galleryImages.slice(0, 3)).map((preview, index) => (
                  <img key={`${preview}-${index}`} src={preview} alt="Preview" className="h-20 w-full rounded-2xl object-cover" />
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><ImageIcon className="h-4 w-4" /> Multiple image upload with local/cloud fallback</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-semibold text-slate-700">Visibility</label>
                  <span className={`${statusBadgeBaseClass} ${getStatusBadgeClass(formData.visibility)}`}>
                    {getStatusLabel(formData.visibility)}
                  </span>
                </div>
                <select value={formData.visibility} onChange={(event) => setFormData({ ...formData, visibility: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={formData.featured} onChange={(event) => setFormData({ ...formData, featured: event.target.checked })} />
                Featured project
              </label>
            </div>

            <button type="submit" className="premium-button-primary w-full">
              <Upload className="h-4 w-4" />
              Save Event
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete event"
        message="This event and its related feedback will be removed. Continue?"
        danger
        onConfirm={() => {
          handleDelete(deleteConfirm.id);
          setDeleteConfirm({ open: false, id: null });
        }}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />

      <Modal isOpen={linkModalOpen} onClose={() => setLinkModalOpen(false)} title="Feedback Link Generated" size="md">
        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Send this private link to the customer for {linkEventName}.
            </div>
            <p className="mt-2 text-emerald-800">The customer will open an event-specific feedback form and cannot choose another event.</p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Private review link</span>
            <input value={generatedLink} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none" />
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={handleCopyGeneratedLink} className="premium-button-primary w-full">
              <Copy className="h-4 w-4" />
              Copy Link
            </button>
            <a href={generatedLink} target="_blank" rel="noreferrer" className="premium-button-secondary w-full">
              <ExternalLink className="h-4 w-4" />
              Open Link
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp(`Hi, thank you for choosing 5A Events. We would love to hear your feedback about your event. Please submit your review here: ${generatedLink}`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </Modal>

      <ImagePreview images={previewImages} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </AdminLayout>
  );
};

export default AdminEvents;
