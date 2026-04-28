import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Trash2, Pencil, Image as ImageIcon, Star, CheckCircle2, Sparkles } from 'lucide-react';
import { feedbackAPI, eventsAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import ImagePreview from '../components/common/ImagePreview';
import { showToast } from '../components/common/Toast';
import { AdminLayout } from '../components/layout/AdminLayout';
import { fallbackEventImage, galleryImages } from '../utils/imageAssets';

const initialFeedbackForm = {
  name: '',
  description: '',
  rating: 5,
  isApproved: true,
  isPublished: true,
};

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialFeedbackForm);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filterEvent, filterRating, search]);

  useEffect(() => {
    if (!images.length) {
      setPreviewImages([]);
      return undefined;
    }

    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setPreviewImages(objectUrls);

    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const fetchData = async () => {
    try {
      const [feedResponse, eventResponse] = await Promise.all([
        feedbackAPI.getAll(filterEvent, filterRating, 1, 50, search),
        eventsAPI.getAll(),
      ]);

      setFeedbacks(feedResponse.data.feedbacks || []);
      setEvents(eventResponse.data.events || []);
    } catch (error) {
      showToast('Failed to load feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await feedbackAPI.delete(id);
      showToast('Feedback deleted successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to delete feedback', 'error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('rating', formData.rating);
    submitData.append('isApproved', formData.isApproved);
    submitData.append('isPublished', formData.isPublished);
    images.forEach((image) => submitData.append('images', image));

    try {
      await feedbackAPI.update(editingId, submitData);
      showToast('Feedback updated successfully', 'success');
      setFormOpen(false);
      setEditingId(null);
      setFormData(initialFeedbackForm);
      setImages([]);
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update feedback', 'error');
    }
  };

  const stats = useMemo(() => ([
    ['All', feedbacks.length],
    ['Approved', feedbacks.filter((feedback) => feedback.isApproved).length],
    ['Pending', feedbacks.filter((feedback) => !feedback.isApproved).length],
  ]), [feedbacks]);

  if (loading) {
    return <Loading message="Loading feedback management..." />;
  }

  return (
    <AdminLayout
      title="Feedback management"
      subtitle="Search, filter, review, update, and delete guest feedback while keeping the gallery polished and responsive."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(([label, value]) => (
            <div key={label} className="glass-card rounded-[1.5rem] p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[2rem] p-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or feedback" className="w-full bg-transparent outline-none" />
            </label>

            <select value={filterEvent} onChange={(event) => setFilterEvent(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
              <option value="">All events</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>{event.name}</option>
              ))}
            </select>

            <select value={filterRating} onChange={(event) => setFilterRating(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
              <option value="">Any rating</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>{rating} stars</option>
              ))}
            </select>

            <button
              onClick={() => {
                setFilterEvent('');
                setFilterRating('');
                setSearch('');
              }}
              className="premium-button-secondary"
            >
              <Filter className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {feedbacks.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-2">
            {feedbacks.map((feedback) => {
              const feedbackImages = feedback.images && feedback.images.length > 0 ? feedback.images : [fallbackEventImage];

              return (
                <article key={feedback._id} className="glass-card overflow-hidden rounded-[2rem]">
                  <div className="grid gap-0 md:grid-cols-[0.8fr_1.2fr]">
                    <img src={feedbackImages[0]} alt={feedback.name} className="h-full min-h-[240px] w-full cursor-pointer object-cover" onClick={() => { setPreviewImages(feedbackImages); setPreviewOpen(true); }} />
                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="eyebrow">{feedback.eventId?.name || 'Event feedback'}</p>
                          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{feedback.name}</h3>
                        </div>
                        <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{Number(feedback.rating || 0).toFixed(1)} ★</div>
                      </div>

                      <p className="text-sm leading-6 text-slate-600">{feedback.description}</p>

                      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        <span className={`rounded-full px-3 py-1 ${feedback.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{feedback.isApproved ? 'Approved' : 'Pending'}</span>
                        <span className={`rounded-full px-3 py-1 ${feedback.isPublished ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-600'}`}>{feedback.isPublished ? 'Published' : 'Hidden'}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{new Date(feedback.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            setEditingId(feedback._id);
                            setFormData({
                              name: feedback.name || '',
                              description: feedback.description || '',
                              rating: feedback.rating || 5,
                              isApproved: Boolean(feedback.isApproved),
                              isPublished: Boolean(feedback.isPublished),
                            });
                            setImages([]);
                            setFormOpen(true);
                          }}
                          className="premium-button-secondary"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                        <button onClick={() => setDeleteConfirm({ open: true, id: feedback._id })} className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                        <button onClick={() => { setPreviewImages(feedbackImages); setPreviewOpen(true); }} className="premium-button-primary">
                          <ImageIcon className="h-4 w-4" />
                          Preview images
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-[2rem] p-8 text-center">
            <img src={galleryImages[2]} alt="No feedback found" className="mx-auto h-64 w-full max-w-2xl rounded-[1.75rem] object-cover" />
            <h3 className="mt-6 text-3xl font-semibold text-slate-900">No feedback matches the current filters</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Adjust the filters or clear them to see all published guest feedback.</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete feedback"
        message="This feedback entry will be removed permanently. Continue?"
        danger
        onConfirm={() => {
          handleDelete(deleteConfirm.id);
          setDeleteConfirm({ open: false, id: null });
        }}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="Edit feedback" size="lg">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
              <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
              <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} rows={6} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Rating</label>
              <input type="range" min="1" max="5" step="1" value={formData.rating} onChange={(event) => setFormData({ ...formData, rating: Number(event.target.value) })} className="w-full" />
              <p className="mt-1 text-sm text-slate-500">Current rating: {formData.rating}/5</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={formData.isApproved} onChange={(event) => setFormData({ ...formData, isApproved: event.target.checked })} />
                Approved
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={formData.isPublished} onChange={(event) => setFormData({ ...formData, isPublished: event.target.checked })} />
                Published
              </label>
            </div>

            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Upload replacement images</label>
              <input type="file" multiple accept="image/*" onChange={(event) => setImages(Array.from(event.target.files || []).slice(0, 10))} className="w-full text-sm" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {(previewImages.length > 0 ? previewImages : galleryImages.slice(6, 9)).map((preview, index) => (
                  <img key={`${preview}-${index}`} src={preview} alt="Feedback preview" className="h-20 w-full rounded-2xl object-cover" />
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 className="h-4 w-4" /> Image replacement is optional when only editing text or ratings</p>
            </div>

            <button type="submit" className="premium-button-primary w-full">
              Save feedback
            </button>
          </div>
        </form>
      </Modal>

      <ImagePreview images={previewImages} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </AdminLayout>
  );
};

export default AdminFeedback;
