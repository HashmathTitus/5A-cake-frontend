import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Trash2, Pencil, Image as ImageIcon, CheckCircle2, EyeOff, ThumbsUp, ThumbsDown } from 'lucide-react';
import { feedbackAPI, eventsAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import ImagePreview from '../components/common/ImagePreview';
import { showToast } from '../components/common/Toast';
import { AdminLayout } from '../components/layout/AdminLayout';
import { fallbackEventImage, galleryImages } from '../utils/imageAssets';
import { getStatusBadgeClass, getStatusLabel, statusBadgeBaseClass } from '../utils/statusStyles';
import { getApiErrorMessage } from '../api/axiosClient';

const statuses = ['all', 'pending', 'published', 'rejected', 'hidden'];

const initialFeedbackForm = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  message: '',
  rating: 5,
  status: 'pending',
};

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterEvent, setFilterEvent] = useState('');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialFeedbackForm);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.set('status', statusFilter);
      if (filterEvent) query.set('eventId', filterEvent);
      if (search) query.set('search', search);
      query.set('page', '1');
      query.set('limit', '50');

      const [feedResponse, eventResponse] = await Promise.all([
        feedbackAPI.getAdmin(query.toString()),
        eventsAPI.getAdmin(),
      ]);

      setFeedbacks(feedResponse.data.feedbacks || []);
      setEvents(eventResponse.data.events || []);
    } catch (error) {
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [filterEvent, search, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!images.length) {
      setPreviewImages([]);
      return undefined;
    }

    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setPreviewImages(objectUrls);

    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleDelete = async (id) => {
    try {
      await feedbackAPI.delete(id);
      showToast('Review deleted successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to delete review', 'error');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const data = new FormData();
      data.append('status', status);
      await feedbackAPI.update(id, data);
      showToast('Review status updated', 'success');
      fetchData();
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Failed to update review'), 'error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = new FormData();
    submitData.append('customerName', formData.customerName);
    submitData.append('customerEmail', formData.customerEmail);
    submitData.append('customerPhone', formData.customerPhone);
    submitData.append('message', formData.message);
    submitData.append('rating', formData.rating);
    submitData.append('status', formData.status);
    images.forEach((image) => submitData.append('images', image));

    try {
      await feedbackAPI.update(editingId, submitData);
      showToast('Review updated successfully', 'success');
      setFormOpen(false);
      setEditingId(null);
      setFormData(initialFeedbackForm);
      setImages([]);
      fetchData();
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Failed to update review'), 'error');
    }
  };

  const stats = useMemo(() => ([
    ['All', feedbacks.length],
    ['Pending', feedbacks.filter((feedback) => feedback.status === 'pending').length],
    ['Published', feedbacks.filter((feedback) => feedback.status === 'published').length],
    ['Rejected', feedbacks.filter((feedback) => feedback.status === 'rejected').length],
  ]), [feedbacks]);

  if (loading) {
    return <Loading message="Loading review management..." />;
  }

  return (
    <AdminLayout
      title="Review moderation"
      subtitle="Review private customer feedback, publish verified reviews, and keep the public gallery trustworthy."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="glass-card rounded-[1.5rem] p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[2rem] p-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer name, email, or review text" className="w-full bg-transparent outline-none" />
            </label>

            <div className="grid gap-2">
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`${statusBadgeBaseClass} ${getStatusBadgeClass(status)} ${statusFilter === status ? 'ring-2 ring-slate-900/10' : 'opacity-75'}`}
                  >
                    {status === 'all' ? 'All statuses' : getStatusLabel(status)}
                  </button>
                ))}
              </div>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
                {statuses.map((status) => <option key={status} value={status}>{status === 'all' ? 'All statuses' : getStatusLabel(status)}</option>)}
              </select>
            </div>

            <select value={filterEvent} onChange={(event) => setFilterEvent(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
              <option value="">All events</option>
              {events.map((event) => <option key={event._id} value={event._id}>{event.name}</option>)}
            </select>
          </div>
        </div>

        {feedbacks.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-2">
            {feedbacks.map((feedback) => {
              const feedbackImages = feedback.images && feedback.images.length > 0 ? feedback.images : [fallbackEventImage];

              return (
                <article key={feedback._id} className="glass-card overflow-hidden rounded-[2rem]">
                  <div className="grid gap-0 md:grid-cols-[0.8fr_1.2fr]">
                    <img src={feedbackImages[0]} alt={feedback.customerName} className="h-full min-h-[240px] w-full cursor-pointer object-cover" onClick={() => { setPreviewImages(feedbackImages); setPreviewOpen(true); }} />
                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="eyebrow">{feedback.eventId?.name || 'Verified review'}</p>
                          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{feedback.customerName}</h3>
                        </div>
                        <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{Number(feedback.rating || 0).toFixed(1)} ★</div>
                      </div>

                      <p className="text-sm leading-6 text-slate-600">{feedback.message}</p>

                      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        <span className={`${statusBadgeBaseClass} ${getStatusBadgeClass(feedback.status)}`}>{getStatusLabel(feedback.status)}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{new Date(feedback.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            setEditingId(feedback._id);
                            setFormData({
                              customerName: feedback.customerName || '',
                              customerEmail: feedback.customerEmail || '',
                              customerPhone: feedback.customerPhone || '',
                              message: feedback.message || '',
                              rating: feedback.rating || 5,
                              status: feedback.status || 'pending',
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
                        <button onClick={() => updateStatus(feedback._id, 'published')} className="premium-button-primary">
                          <ThumbsUp className="h-4 w-4" />
                          Publish
                        </button>
                        <button onClick={() => updateStatus(feedback._id, 'rejected')} className="premium-button-secondary">
                          <ThumbsDown className="h-4 w-4" />
                          Reject
                        </button>
                        <button onClick={() => updateStatus(feedback._id, 'hidden')} className="premium-button-secondary">
                          <EyeOff className="h-4 w-4" />
                          Hide
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
            <img src={galleryImages[2]} alt="No reviews found" className="mx-auto h-64 w-full max-w-2xl rounded-[1.75rem] object-cover" />
            <h3 className="mt-6 text-3xl font-semibold text-slate-900">No reviews match the current filters</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Adjust the filters or clear them to see all reviews.</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete review"
        message="This review entry will be removed permanently. Continue?"
        danger
        onConfirm={() => {
          handleDelete(deleteConfirm.id);
          setDeleteConfirm({ open: false, id: null });
        }}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="Edit review" size="lg">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Customer name</label>
              <input value={formData.customerName} onChange={(event) => setFormData({ ...formData, customerName: event.target.value })} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
              <textarea value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} rows={6} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Rating</label>
              <input type="range" min="1" max="5" step="1" value={formData.rating} onChange={(event) => setFormData({ ...formData, rating: Number(event.target.value) })} className="w-full" />
              <p className="mt-1 text-sm text-slate-500">Current rating: {formData.rating}/5</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-slate-700">Status</label>
                <span className={`${statusBadgeBaseClass} ${getStatusBadgeClass(formData.status)}`}>{getStatusLabel(formData.status)}</span>
              </div>
              <select value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500">
                <option value="pending">Pending</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Upload replacement images</label>
              <input type="file" multiple accept="image/*" onChange={(event) => setImages(Array.from(event.target.files || []).slice(0, 3))} className="w-full text-sm" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {(previewImages.length > 0 ? previewImages : galleryImages.slice(6, 9)).map((preview, index) => (
                  <img key={`${preview}-${index}`} src={preview} alt="Review preview" className="h-20 w-full rounded-2xl object-cover" />
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 className="h-4 w-4" /> Image replacement is optional when only editing text or status</p>
            </div>

            <button type="submit" className="premium-button-primary w-full">
              Save review
            </button>
          </div>
        </form>
      </Modal>

      <ImagePreview images={previewImages} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </AdminLayout>
  );
};

export default AdminFeedback;
