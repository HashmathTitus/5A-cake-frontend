import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Trash2, PhoneCall, Mail, MessageCircle, CalendarDays, MapPin } from 'lucide-react';
import { inquiriesAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { showToast } from '../components/common/Toast';
import { AdminLayout } from '../components/layout/AdminLayout';

const statusOptions = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchInquiries = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.set('search', search);
      if (statusFilter !== 'all') query.set('status', statusFilter);
      query.set('page', '1');
      query.set('limit', '100');

      const response = await inquiriesAPI.getAll(query.toString());
      setInquiries(response.data.inquiries || []);
    } catch (error) {
      showToast('Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const updateStatus = async (id, status) => {
    try {
      await inquiriesAPI.updateStatus(id, status);
      showToast('Inquiry status updated', 'success');
      fetchInquiries();
    } catch (error) {
      showToast('Failed to update inquiry status', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await inquiriesAPI.delete(id);
      showToast('Inquiry deleted successfully', 'success');
      fetchInquiries();
    } catch (error) {
      showToast('Failed to delete inquiry', 'error');
    }
  };

  const stats = useMemo(() => ([
    ['All', inquiries.length],
    ['New', inquiries.filter((item) => item.status === 'new').length],
    ['Contacted', inquiries.filter((item) => item.status === 'contacted').length],
    ['Confirmed', inquiries.filter((item) => item.status === 'confirmed').length],
  ]), [inquiries]);

  if (loading) {
    return <Loading message="Loading inquiries..." />;
  }

  return (
    <AdminLayout title="Inquiry management" subtitle="Track quote requests, update statuses, and keep the booking pipeline organized.">
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
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.6fr]">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, event type, or location" className="w-full bg-transparent outline-none" />
            </label>

            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
              <option value="all">All statuses</option>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>

            <button onClick={() => { setSearch(''); setStatusFilter('all'); }} className="premium-button-secondary">
              Reset
            </button>
          </div>
        </div>

        {inquiries.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-2">
            {inquiries.map((inquiry) => (
              <article key={inquiry._id} className="glass-card rounded-[2rem] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">{inquiry.eventType}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{inquiry.name}</h3>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{inquiry.status}</span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2"><PhoneCall className="h-4 w-4 text-amber-600" /> {inquiry.phone}</div>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-amber-600" /> {inquiry.email || 'No email provided'}</div>
                  <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-amber-600" /> {inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString() : 'No date'}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-600" /> {inquiry.location}</div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">{inquiry.message}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={`https://wa.me/${String(inquiry.phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="premium-button-secondary">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <select value={inquiry.status} onChange={(event) => updateStatus(inquiry._id, event.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                    {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <button onClick={() => setDeleteConfirm({ open: true, id: inquiry._id })} className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[2rem] p-8 text-center text-slate-600">
            No inquiries found.
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete inquiry"
        message="This inquiry will be removed permanently. Continue?"
        danger
        onConfirm={() => {
          handleDelete(deleteConfirm.id);
          setDeleteConfirm({ open: false, id: null });
        }}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </AdminLayout>
  );
};

export default AdminInquiries;
