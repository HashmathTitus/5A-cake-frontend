import React from 'react';
import { Mail, MessageCircle, Instagram, Facebook, PhoneCall, Sparkles } from 'lucide-react';
import { SOCIAL_LINKS, CONTACT_CONFIG } from '../utils/constants';
import { contactVisualImage, galleryImages } from '../utils/imageAssets';

const contactCards = [
  {
    title: 'WhatsApp',
    description: 'Quick event enquiries, booking follow-ups, and delivery updates.',
    href: SOCIAL_LINKS.whatsapp('Hello 5A Events, I would like to inquire about a celebration.'),
    icon: MessageCircle,
    tone: 'from-emerald-500 to-emerald-600',
    meta: CONTACT_CONFIG.whatsapp,
  },
  {
    title: 'Email',
    description: 'Formal proposals, venue details, and collaboration requests.',
    href: SOCIAL_LINKS.email('5A Events Inquiry'),
    icon: Mail,
    tone: 'from-sky-500 to-sky-600',
    meta: CONTACT_CONFIG.email,
  },
  {
    title: 'Instagram',
    description: 'Browse recent event visuals and behind-the-scenes styling.',
    href: SOCIAL_LINKS.instagram(),
    icon: Instagram,
    tone: 'from-fuchsia-500 to-pink-600',
    meta: CONTACT_CONFIG.instagramUrl,
  },
  {
    title: 'Facebook / Messenger',
    description: 'Send messages or follow the page for updates and albums.',
    href: SOCIAL_LINKS.facebook(),
    icon: Facebook,
    tone: 'from-blue-600 to-indigo-600',
    meta: CONTACT_CONFIG.facebookUrl,
  },
];

const Contact = () => {
  return (
    <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
      <section className="section-shell pb-10 pt-24 lg:pb-14 lg:pt-28">
        <div className="grid gap-6 overflow-hidden rounded-[2.25rem] bg-slate-900 text-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5 p-6 sm:p-10">
            <p className="eyebrow !text-amber-300">Connect with us</p>
            <h1 className="max-w-xl text-4xl font-semibold sm:text-5xl">Let’s plan something elegant, memorable, and well coordinated.</h1>
            <p className="max-w-xl text-sm leading-7 text-white/75">
              Use your preferred channel to enquire about celebrations, book a viewing, or request a custom event concept.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-white/70">Fast response</p>
                <p className="mt-1 text-xl font-semibold">Within one business day</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-white/70">Service style</p>
                <p className="mt-1 text-xl font-semibold">Hospitality-first</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden">
            <img src={contactVisualImage} alt="Contact visual" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.7))]" />
            <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 text-white backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">Visual direction</p>
              <h2 className="mt-2 text-2xl font-semibold">Elegant décor, cakes, stages, and banquet layouts</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-16 lg:pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Preferred channels</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Reach the team however you like</h2>
          </div>
          <Sparkles className="hidden h-8 w-8 text-amber-500 sm:block" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card) => {
            const Icon = card.icon;

            return (
              <a key={card.title} href={card.href} target="_blank" rel="noreferrer" className="group glass-card overflow-hidden rounded-[2rem] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
                <div className={`flex h-28 items-center justify-between bg-gradient-to-br ${card.tone} px-6 text-white`}>
                  <Icon className="h-9 w-9" />
                  <PhoneCall className="h-5 w-5 opacity-80" />
                </div>
                <div className="space-y-4 p-5">
                  <h3 className="text-2xl font-semibold text-slate-900">{card.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{card.description}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 break-all">{card.meta}</p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.slice(8, 12).map((image, index) => (
            <div key={`${image}-${index}`} className="glass-card overflow-hidden rounded-[1.75rem]">
              <img src={image} alt={`Contact gallery ${index + 1}`} className="h-40 w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
