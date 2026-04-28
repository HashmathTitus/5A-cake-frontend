import React from 'react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, CONTACT_EMAIL, WHATSAPP_NUMBER } from '../../utils/constants';
import { heroBackdropImage, logoAssetVariant } from '../../utils/imageAssets';

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/70 bg-[#140f0b] text-slate-200">
      <div className="absolute inset-0 opacity-20">
        <img src={heroBackdropImage} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoAssetVariant} alt="5A Events" className="h-12 w-12 rounded-2xl object-cover shadow-lg" />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-amber-400">5A Events</p>
                <h3 className="text-xl font-semibold text-white">Hospitality-first event design</h3>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-300">
              Beautiful events, polished feedback flows, and a clean admin experience for your team and clients.
            </p>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300 backdrop-blur-xl">
              <p>WhatsApp: {WHATSAPP_NUMBER}</p>
              <p>Email: {CONTACT_EMAIL}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Navigate</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/" className="transition hover:text-white">Home</Link></li>
              <li><Link to="/events" className="transition hover:text-white">Events</Link></li>
              <li><Link to="/feedback" className="transition hover:text-white">Feedback</Link></li>
              <li><Link to="/contact" className="transition hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Social</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href={SOCIAL_LINKS.whatsapp()} target="_blank" rel="noreferrer" className="transition hover:text-white">WhatsApp</a></li>
              <li><a href={SOCIAL_LINKS.instagram()} target="_blank" rel="noreferrer" className="transition hover:text-white">Instagram</a></li>
              <li><a href={SOCIAL_LINKS.facebook()} target="_blank" rel="noreferrer" className="transition hover:text-white">Facebook</a></li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-xl">
            <img src={heroBackdropImage} alt="Elegant event setup" className="h-40 w-full object-cover" />
            <div className="space-y-2 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Contact</p>
              <a href={SOCIAL_LINKS.email()} className="block transition hover:text-white">{CONTACT_EMAIL}</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-400">
          <p>&copy; 2026 5A Events. Crafted for premium event and hospitality experiences.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
