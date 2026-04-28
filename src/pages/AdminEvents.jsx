import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { eventsAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ImagePreview from '../components/common/ImagePreview';
import { showToast } from '../components/common/Toast';
import { AdminLayout } from '../components/layout/AdminLayout';
import { fallbackEventImage, galleryImages } from '../utils/imageAssets';

const emptyForm = { name: '', description: '', date: '', location: '', status: 'upcoming' };

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
      const response = await eventsAPI.getAll();
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
      showToast(error.response?.data?.error || 'Failed to save event', 'error');
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

  const currentStats = useMemo(() => [
    ['All', events.length],
    ['Upcoming', events.filter((event) => event.status === 'upcoming').length],
    ['Ongoing', events.filter((event) => event.status === 'ongoing').length],
    ['Completed', events.filter((event) => event.status === 'completed').length],
  ], [events]);

  if (loading) {
    return <Loading message="Loading event management..." />;
  }

  return (
    <AdminLayout
      title="Event management"
      subtitle="Create, preview, update, and delete polished event concepts using the built-in hospitality assets and uploaded media."
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
            <p className="eyebrow">Image-backed events</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Manage real event imagery and metadata</h3>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData(emptyForm);
              setImages([]);
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
              const eventImages = event.images && event.images.length > 0 ? event.images : [fallbackEventImage];

              return (
                <article key={event._id} className="glass-card overflow-hidden rounded-[2rem]">
                  <div className="relative">
                    <img src={eventImages[0]} alt={event.name} className="h-56 w-full cursor-pointer object-cover" onClick={() => { setPreviewImages(eventImages); setPreviewOpen(true); }} />
                    <span className="absolute left-4 top-4 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-xl">{event.status}</span>
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
                      <span className="rounded-full bg-slate-100 px-3 py-1">{new Date(event.date).toLocaleDateString()}</span>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{event.feedbackCount || 0} feedback</span>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-1">
                      {eventImages.slice(0, 3).map((image, index) => (
                        <button key={`${event._id}-${index}`} onClick={() => { setPreviewImages(eventImages); setPreviewOpen(true); }} className="shrink-0 overflow-hidden rounded-2xl border border-slate-100">
                          <img src={image} alt={`${event.name} preview ${index + 1}`} className="h-16 w-16 object-cover" />
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setFormData({
                            name: event.name || '',
                            description: event.description || '',
                            date: event.date ? String(event.date).slice(0, 10) : '',
                            location: event.location || '',
                            status: event.status || 'upcoming',
                          });
                          setEditingId(event._id);
                          setImages([]);
                          setFormOpen(true);
                        }}
                        className="premium-button-secondary flex-1"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button onClick={() => setDeleteConfirm({ open: true, id: event._id })} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
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
            <p className="mt-2 text-sm leading-6 text-slate-600">Create the first event to populate the public events page and feedback form.</p>
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

      <ImagePreview images={previewImages} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </AdminLayout>
  );
};

export default AdminEvents;
