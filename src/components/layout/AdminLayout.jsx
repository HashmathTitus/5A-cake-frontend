import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, MessageSquareText, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logoAsset } from '../../utils/imageAssets';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageSquareText },
];

export const AdminLayout = ({ title, subtitle, children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf4_0%,#f5efe6_55%,#f7f3ef_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="hidden w-full max-w-[280px] border-r border-white/70 bg-white/85 px-6 py-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:block">
          <div className="flex items-center gap-3">
            <img src={logoAsset} alt="5A Events" className="h-12 w-12 rounded-2xl object-cover shadow-md" />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-600">Admin</p>
              <h1 className="text-lg font-semibold text-slate-900">5A Events</h1>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em]">Signed in</span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-800">{admin?.email || 'admin@5aevents.com'}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <img src={logoAsset} alt="5A Events" className="h-10 w-10 rounded-2xl object-cover" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Admin</p>
                  <h1 className="text-base font-semibold">5A Events</h1>
                </div>
              </div>
              <button onClick={() => setMobileOpen((value) => !value)} className="rounded-2xl border border-slate-200 p-2.5 text-slate-700">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            {mobileOpen ? (
              <div className="space-y-2 border-t border-slate-100 bg-white px-4 py-4">
                {adminLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                          isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mb-6 rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">Admin workspace</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{subtitle}</p>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;