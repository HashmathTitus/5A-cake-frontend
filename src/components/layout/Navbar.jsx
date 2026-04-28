import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logoAsset } from '../../utils/imageAssets';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHomePage = location.pathname === '/';
  const shouldUseDarkText = isScrolled || !isHomePage;

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full border-b backdrop-blur-2xl transition-all duration-300 ${
        isScrolled
          ? 'border-white/60 bg-white/85 shadow-[0_10px_40px_rgba(15,23,42,0.12)]'
          : isHomePage
            ? 'border-transparent bg-transparent shadow-none'
            : 'border-white/40 bg-white/45 shadow-none'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoAsset} alt="5A Events" className="h-11 w-11 rounded-2xl object-cover shadow-md ring-1 ring-white/20" />
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${shouldUseDarkText ? 'text-amber-600' : 'text-amber-200'}`}>5A</p>
            <p className={`text-lg font-semibold ${shouldUseDarkText ? 'text-slate-900' : 'text-white'}`}>Cakes & Decorations</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {[
            ['/', 'Home'],
            ['/events', 'Events'],
            ['/feedback', 'Feedback'],
            ['/contact', 'Contact'],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? shouldUseDarkText
                      ? 'text-slate-900'
                      : 'text-white'
                    : shouldUseDarkText
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-white/80 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-3 rounded-full border border-amber-100 bg-amber-50 px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-amber-700" />
              <span className="text-sm font-medium text-slate-700">{admin?.email || 'Admin'}</span>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Admin Login
            </Link>
          )}
        </div>

        <button className="rounded-2xl border border-slate-200 p-2.5 text-slate-700 lg:hidden" onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/20 bg-white/90 px-4 py-4 text-slate-900 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {[
              ['/', 'Home'],
              ['/events', 'Events'],
              ['/feedback', 'Feedback'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `rounded-2xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'}`}
              >
                {label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <NavLink to="/admin/dashboard" onClick={() => setIsOpen(false)} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  Admin Dashboard
                </NavLink>
                <button onClick={handleLogout} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" onClick={() => setIsOpen(false)} className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
