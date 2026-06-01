import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, HeartHandshake, PartyPopper, CakeSlice, GlassWater } from 'lucide-react';
import { feedbackAPI } from '../api/axiosClient';
import { Loading } from '../components/common/Loading';
import { showToast } from '../components/common/Toast';
import {
  galleryImages,
  heroBannerImage,
  heroBackdropImage,
  serviceImages,
  weddingImage,
  birthdayEventImage,
  cakeEventImage,
  stageEventImage,
  fallbackEventImage,
} from '../utils/imageAssets';

const serviceCards = [
  {
    title: 'Elegant Weddings',
    description: 'Ceremony styling, reception décor, and premium hospitality details for unforgettable celebrations.',
    image: weddingImage,
    icon: HeartHandshake,
  },
  {
    title: 'Birthday Experiences',
    description: 'Playful, polished birthday setups with cakes, table décor, and custom photo moments.',
    image: birthdayEventImage,
    icon: PartyPopper,
  },
  {
    title: 'Custom Cakes',
    description: 'Signature cakes and dessert tables designed to match the tone, theme, and palette of your event.',
    image: cakeEventImage,
    icon: CakeSlice,
  },
  {
    title: 'Stage & Hall Styling',
    description: 'Statement stage designs, layered lighting, and premium room styling for receptions and launches.',
    image: stageEventImage,
    icon: GlassWater,
  },
];

const Home = () => {
  const [featuredFeedback, setFeaturedFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const response = await feedbackAPI.getPublic('', 1, 3);
        setFeaturedFeedback(response.data.feedbacks || []);
      } catch (error) {
        showToast('Could not load featured testimonials', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadHomepageData();
  }, []);

  if (loading) {
    return <Loading message="Preparing the event showcase..." />;
  }

  return (
    <div className="bg-[linear-gradient(180deg,#fffaf4_0%,#f7f0e5_42%,#fbf7f2_100%)]">
      <section className="relative overflow-hidden pt-20 sm:pt-24 lg:pt-28">
        <div className="absolute inset-0">
          <img src={heroBannerImage} alt="5A Events hero" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.88),rgba(15,23,42,0.38),rgba(180,83,9,0.3))]" />
        </div>

        <div className="section-shell relative grid items-center gap-6 py-10 text-white sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:py-28">
          <div className="max-w-3xl space-y-5 sm:space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] backdrop-blur-xl sm:px-4 sm:text-xs sm:tracking-[0.32em]">
              <Sparkles className="h-4 w-4" /> Premium event hospitality
            </span>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl lg:text-7xl">
              Elegant event design for celebrations that feel unforgettable.
            </h1>
            <p className="max-w-xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7 lg:text-lg">
              From intimate gatherings to full-scale receptions, 5A Events blends visual styling, warm hospitality, and polished guest experiences across every detail.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/gallery" className="premium-button-primary w-full sm:w-auto">
                Explore Gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/book" className="premium-button-secondary w-full !border-white/20 !bg-white/10 !text-white hover:!bg-white/20 sm:w-auto">
                Book Now
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
              {[
                ['Styled Events', '50+'],
                ['Guest Reviews', '300+'],
                ['Cakes & Treats', 'Premium'],
                ['Response Time', '< 24h'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl sm:p-4">
                  <p className="text-xl font-semibold sm:text-2xl">{value}</p>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-white/70 sm:text-xs sm:tracking-[0.22em]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4 lg:justify-self-end">
            <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
              <img src={heroBackdropImage} alt="Elegant event styling" className="h-44 w-full object-cover sm:h-[320px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.slice(0, 4).map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.4rem] border border-white/15 bg-white/10 backdrop-blur-xl">
                  <img src={image} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover sm:h-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16 lg:py-20">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Curated services</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-4xl">Hospitality-first styling for every occasion</h2>
          </div>
          {/* <p className="max-w-xl text-sm leading-6 text-slate-600">
            Existing visual assets are used across the site to keep the experience grounded in real event photography rather than placeholder graphics.
          </p> */}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
          {serviceCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="glass-card overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                <img src={card.image} alt={card.title} className="h-44 w-full object-cover sm:h-52 lg:h-56" />
                <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
                  <div className="flex items-center gap-3 text-amber-600">
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-semibold uppercase tracking-[0.25em]">Signature service</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">{card.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{card.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-shell pb-12 sm:pb-16 lg:pb-20">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="glass-card overflow-hidden rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6">
            <p className="eyebrow">Testimonial preview</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Recent guest feedback</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">A quick preview of public feedback submitted by real guests.</p>

            <div className="mt-6 space-y-4">
              {featuredFeedback.length > 0 ? featuredFeedback.map((feedback) => (
                <article key={feedback._id} className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{feedback.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{feedback.eventId?.name || 'Featured event'}</p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      {'★'.repeat(Math.round(feedback.rating || 0))}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feedback.description}</p>
                </article>
              )) : (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-600">
                  <p>No public testimonials yet. </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
              <img src={serviceImages.decor} alt="Decor and table styling" className="h-48 w-full object-cover sm:h-72" />
              <div className="p-4 sm:p-5">
                <p className="eyebrow">Gallery preview</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">Real event imagery throughout the experience</h3>
              </div>
            </div>
            <div className="grid gap-4">
              {galleryImages.slice(4, 8).map((image, index) => (
                <div key={`${image}-${index}`} className="glass-card overflow-hidden rounded-[1.5rem]">
                  <img src={image} alt={`Gallery ${index + 5}`} className="h-32 w-full object-cover sm:h-36" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-12 sm:pb-16 lg:pb-24">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-900 px-5 py-8 text-white shadow-2xl sm:rounded-[2.25rem] sm:px-10 sm:py-12">
          <div className="absolute inset-0 opacity-25">
            <img src={fallbackEventImage} alt="Event backdrop" className="h-full w-full object-cover" />
          </div>
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="eyebrow !text-amber-300">Next step</p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-4xl">Ready to plan a polished event?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                Explore upcoming event concepts, then submit feedback or request changes with a team that understands event presentation.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link to="/gallery" className="premium-button-primary w-full bg-white text-slate-900 hover:bg-amber-50 sm:w-auto">
                Explore Gallery
              </Link>
              <Link to="/contact" className="premium-button-secondary w-full border-white/20 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
