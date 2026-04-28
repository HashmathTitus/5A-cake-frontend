import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MessageSquareText, Star, ArrowRight, LayoutGrid } from 'lucide-react';
import { eventsAPI, feedbackAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import { AdminLayout } from '../components/layout/AdminLayout';
import { showToast } from '../components/common/Toast';
import { galleryImages } from '../utils/imageAssets';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ events: {}, feedback: {} });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [eventStatsResponse, feedbackStatsResponse] = await Promise.all([
          eventsAPI.getStats(),
          feedbackAPI.getStats(),
        ]);

        setStats({
          events: eventStatsResponse.data || {},
          feedback: feedbackStatsResponse.data || {},
        });
      } catch (error) {
        showToast('Failed to load dashboard stats', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const metrics = useMemo(() => ([
    {
      title: 'Total Events',
      value: stats.events.totalEvents ?? 0,
      icon: CalendarDays,
      tone: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Total Feedback',
      value: stats.feedback.totalFeedback ?? 0,
      icon: MessageSquareText,
      tone: 'from-sky-500 to-blue-600',
    },
    {
      title: 'Average Rating',
      value: Number(stats.feedback.averageRating ?? 0).toFixed(1),
      icon: Star,
      tone: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Completed Events',
      value: stats.events.completedEvents ?? 0,
      icon: LayoutGrid,
      tone: 'from-slate-700 to-slate-900',
    },
  ]), [stats]);

  if (loading) {
    return <Loading message="Loading dashboard metrics..." />;
  }

  return (
    <AdminLayout
      title="Dashboard overview"
      subtitle="Monitor event performance, review latest feedback, and jump directly into management tasks."
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article key={metric.title} className="glass-card rounded-[1.75rem] p-5">
                  <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${metric.tone} p-3 text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-500">{metric.title}</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-900">{metric.value}</p>
                </article>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card rounded-[2rem] p-6">
              <p className="eyebrow">Quick actions</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Go straight to the content teams manage most</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link to="/admin/events" className="premium-button-primary">
                  Manage Events <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/admin/feedback" className="premium-button-secondary">
                  Manage Feedback <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="glass-card overflow-hidden rounded-[2rem]">
              <img src={galleryImages[1]} alt="Dashboard visual" className="h-full min-h-[220px] w-full object-cover" />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="glass-card rounded-[2rem] p-6">
            <p className="eyebrow">Latest feedback</p>
            <div className="mt-4 space-y-4">
              {(stats.feedback.latestFeedback || []).length > 0 ? stats.feedback.latestFeedback.map((item) => (
                <article key={item._id} className="rounded-[1.5rem] border border-slate-100 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.eventId?.name || 'Event feedback'}</p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{Number(item.rating || 0).toFixed(1)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              )) : (
                <p className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-600">No feedback has been published yet.</p>
              )}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <p className="eyebrow">Operational note</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The dashboard is wired to live backend stats and will update as events and feedback are created or removed.
            </p>
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
