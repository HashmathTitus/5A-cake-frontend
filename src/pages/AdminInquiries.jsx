import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Trash2, PhoneCall, Mail, MessageCircle, CalendarDays, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { inquiriesAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import { showToast } from '../components/common/Toast';
import { AdminLayout } from '../components/layout/AdminLayout';
import {
  cleanWhatsAppPhone,
  getInquiryStatusBadgeClass,
  getInquiryStatusLabel,
  getInquiryWhatsAppUrl,
  hasLikelyCountryCode,
  inquiryStatusBadgeBaseClass,
} from '../utils/inquiryNotifications';

const statusOptions = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [notificationPrompt, setNotificationPrompt] = useState({ open: false, inquiry: null, status: '' });

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
      const response = await inquiriesAPI.updateStatus(id, status);
      const updatedInquiry = response.data.inquiry || response.data.data?.inquiry || inquiries.find((inquiry) => inquiry._id === id);
      setNotificationPrompt({ open: true, inquiry: updatedInquiry, status });
      fetchInquiries();
    } catch (error) {
      showToast('Failed to update inquiry status', 'error');
    }
  };

  const closeNotificationPrompt = () => setNotificationPrompt({ open: false, inquiry: null, status: '' });

  const handleNotifyCustomer = () => {
    const inquiry = notificationPrompt.inquiry;
    if (!cleanWhatsAppPhone(inquiry?.phone)) {
      showToast('Customer phone number is not available.', 'error');
      return;
    }

    window.open(getInquiryWhatsAppUrl(inquiry, notificationPrompt.status), '_blank', 'noopener,noreferrer');
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

            <div className="grid gap-2">
              <div className="flex flex-wrap gap-2">
                {['all', ...statusOptions].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`${inquiryStatusBadgeBaseClass} ${getInquiryStatusBadgeClass(status)} ${statusFilter === status ? 'ring-2 ring-slate-900/10' : 'opacity-75'}`}
                  >
                    {status === 'all' ? 'All statuses' : getInquiryStatusLabel(status)}
                  </button>
                ))}
              </div>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
                <option value="all">All statuses</option>
                {statusOptions.map((status) => <option key={status} value={status}>{getInquiryStatusLabel(status)}</option>)}
              </select>
            </div>

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
                  <span className={`${inquiryStatusBadgeBaseClass} ${getInquiryStatusBadgeClass(inquiry.status)}`}>
                    {getInquiryStatusLabel(inquiry.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2"><PhoneCall className="h-4 w-4 text-amber-600" /> {inquiry.phone}</div>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-amber-600" /> {inquiry.email || 'No email provided'}</div>
                  <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-amber-600" /> {inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString() : 'No date'}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-600" /> {inquiry.location}</div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">{inquiry.message}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={`https://wa.me/${cleanWhatsAppPhone(inquiry.phone)}`} target="_blank" rel="noreferrer" className="premium-button-secondary">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <select value={inquiry.status} onChange={(event) => updateStatus(inquiry._id, event.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                    {statusOptions.map((status) => <option key={status} value={status}>{getInquiryStatusLabel(status)}</option>)}
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

      <Modal isOpen={notificationPrompt.open} onClose={closeNotificationPrompt} title="Status Updated" size="md">
        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Inquiry status has been changed to {getInquiryStatusLabel(notificationPrompt.status)}.
            </div>
            <p className="mt-2 text-emerald-800">
              Status changes are not automatically sent to customers. Notify the customer manually through WhatsApp when needed.
            </p>
          </div>

          {notificationPrompt.inquiry ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">Customer:</span> {notificationPrompt.inquiry.name}</p>
              <p><span className="font-semibold text-slate-800">Phone:</span> {notificationPrompt.inquiry.phone || 'Not available'}</p>
              {!hasLikelyCountryCode(notificationPrompt.inquiry.phone) && cleanWhatsAppPhone(notificationPrompt.inquiry.phone) ? (
                <p className="mt-2 flex items-start gap-2 text-amber-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  This phone number may need a country code for WhatsApp delivery.
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={handleNotifyCustomer} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
              <MessageCircle className="h-4 w-4" />
              Notify via WhatsApp
            </button>
            <button type="button" onClick={closeNotificationPrompt} className="premium-button-secondary w-full">
              Close
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminInquiries;
