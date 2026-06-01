import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Sparkles, X } from 'lucide-react';
import { logoAsset } from '../../utils/imageAssets';

const publicLinks = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/gallery', 'Gallery'],
  ['/reviews', 'Reviews'],
  ['/contact', 'Contact'],
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';
  const shouldUseDarkText = isScrolled || !isHomePage;

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full border-b backdrop-blur-2xl transition-all duration-300 ${
        isScrolled
          ? 'border-white/60 bg-white/85 shadow-[0_10px_40px_rgba(15,23,42,0.12)]'
          : isHomePage
            ? 'border-transparent bg-transparent shadow-none'
            : 'border-white/40 bg-white/80 shadow-none'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <img src={logoAsset} alt="5A Cakes and Decorations" className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-md ring-1 ring-white/20 sm:h-11 sm:w-11 sm:rounded-2xl" />
          <div className="min-w-0">
            <p className={`text-[0.65rem] font-semibold uppercase tracking-[0.22em] sm:text-xs sm:tracking-[0.28em] ${shouldUseDarkText ? 'text-amber-600' : 'text-amber-200'}`}>5A</p>
            <p className={`truncate text-sm font-semibold leading-tight sm:text-lg ${shouldUseDarkText ? 'text-slate-900' : 'text-white'}`}>Cakes & Decorations</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {publicLinks.map(([to, label]) => (
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

          <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
            <Sparkles className="h-4 w-4" />
            Book Now
          </Link>
        </div>

        <button
          className={`ml-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border lg:hidden ${shouldUseDarkText ? 'border-slate-200 bg-white/70 text-slate-700' : 'border-white/40 bg-slate-900/20 text-white'}`}
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/20 bg-white/95 px-4 py-3 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {publicLinks.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `rounded-xl px-4 py-2.5 text-sm font-medium ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'}`}
              >
                {label}
              </NavLink>
            ))}

            <Link to="/book" className="rounded-xl bg-amber-500 px-4 py-2.5 text-center text-sm font-semibold text-white">
              Book Now
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
