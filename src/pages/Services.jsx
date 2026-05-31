import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, CakeSlice, Circle, HeartHandshake, LayoutGrid, PartyPopper, Sparkles, Stars } from 'lucide-react';
import { SOCIAL_LINKS } from '../utils/constants';
import { birthdayEventImage, cakeEventImage, serviceImages, stageEventImage, weddingImage } from '../utils/imageAssets';

const services = [
  { name: 'Birthday Decorations', description: 'Colourful birthday styling with balloons, cakes, table decor, and photo moments.', image: birthdayEventImage, icon: PartyPopper },
  { name: 'Wedding Decorations', description: 'Elegant ceremonies, receptions, sweetheart tables, and full venue styling.', image: weddingImage, icon: HeartHandshake },
  { name: 'Engagement Setups', description: 'Warm, intimate decor for rings, proposals, and pre-wedding celebrations.', image: serviceImages.engagement || weddingImage, icon: Sparkles },
  { name: 'Cake Table Styling', description: 'Signature dessert table design for birthdays, weddings, and premium parties.', image: cakeEventImage, icon: CakeSlice },
  { name: 'Stage Decorations', description: 'Backdrops, florals, drapery, and stage compositions for formal occasions.', image: stageEventImage, icon: LayoutGrid },
  { name: 'Balloon Decorations', description: 'Organic balloon arches, garlands, and bold statement decor installations.', image: serviceImages.balloon || birthdayEventImage, icon: Circle },
  { name: 'Corporate Events', description: 'Brand-appropriate styling for launches, end-of-year functions, and conferences.', image: serviceImages.corporate || stageEventImage, icon: Building2 },
  { name: 'Custom Event Styling', description: 'Tailored concepts for clients who want a fully bespoke event experience.', image: serviceImages.decor, icon: Stars },
];

const Services = () => (
  <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#fffaf4_100%)]">
    <section className="section-shell pb-10 pt-24 lg:pb-14 lg:pt-28">
      <div className="grid gap-6 overflow-hidden rounded-[2.25rem] bg-slate-900 text-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5 p-6 sm:p-10">
          <p className="eyebrow !text-amber-300">Our services</p>
          <h1 className="max-w-xl text-4xl font-semibold sm:text-5xl">A complete decorations and event styling service for modern celebrations.</h1>
          <p className="max-w-xl text-sm leading-7 text-white/75">
            We help clients plan birthdays, weddings, corporate functions, and bespoke setups with a polished, photo-friendly finish.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/book" className="premium-button-primary bg-white text-slate-900 hover:bg-amber-50">Request Quote</Link>
            <a href={SOCIAL_LINKS.whatsapp('Hello 5A Events, I would like to request a quote for an event decoration service.')} target="_blank" rel="noreferrer" className="premium-button-secondary !border-white/20 !bg-white/10 !text-white hover:!bg-white/20">
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden">
          <img src={serviceImages.decor} alt="Service showcase" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.7))]" />
          <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 text-white backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.28em] text-white/70">Service promise</p>
            <h2 className="mt-2 text-2xl font-semibold">Styled for impact, built for real-world client handover</h2>
          </div>
        </div>
      </div>
    </section>

    <section className="section-shell pb-16 lg:pb-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">What we offer</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Service categories customers can immediately understand</h2>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <article key={service.name} className="glass-card overflow-hidden rounded-[2rem]">
              <img src={service.image} alt={service.name} className="h-52 w-full object-cover" />
              <div className="space-y-4 p-5">
                <div className="flex items-center gap-3 text-amber-600">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-[0.25em]">Service</span>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">{service.name}</h3>
                <p className="text-sm leading-6 text-slate-600">{service.description}</p>
                <Link to="/book" className="premium-button-primary w-full">
                  Request Quote
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  </div>
);

export default Services;
