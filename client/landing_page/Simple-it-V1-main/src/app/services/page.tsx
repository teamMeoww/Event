'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Code2,
  Palette,
  Smartphone,
  Layers,
  Globe,
  Target
} from 'lucide-react';
import Footer from '@/components/organisms/Footer';
import NavItem from '@/components/molecules/NavItem';
import TransitionLink from '@/components/atoms/TransitionLink';
import OroyaSequentialScroll from '@/components/organisms/OroyaSequentialScroll';
import CTA from '@/components/molecules/CTA';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const SERVICES: Service[] = [
  {
    id: '01',
    title: 'Event & Auth Services',
    tagline: 'Manage users and events seamlessly.',
    description: 'Core microservices handling user registration, JWT login, comprehensive event creation, and organizer management.',
    icon: <Globe className="w-8 h-8" />,
    features: ['User Management', 'JWT Login', 'Event Creation', 'Organizer Management']
  },
  {
    id: '02',
    title: 'Ticket & Check-In Services',
    tagline: 'Smooth entry and validation.',
    description: 'Dedicated services for ticket creation, secure QR code generation, rapid QR scanning, and robust check-in logic.',
    icon: <Smartphone className="w-8 h-8" />,
    features: ['Ticket Creation', 'QR Generation', 'QR Scanning', 'Check-In Logic']
  },
  {
    id: '03',
    title: 'Event Driven Architecture',
    tagline: 'Scalable and decoupled.',
    description: 'Powered by Apache Kafka, handling asynchronous ticket-events, checkin-events, and credential-events with persistent logs and high throughput.',
    icon: <Layers className="w-8 h-8" />,
    features: ['Apache Kafka', 'Event Streaming', 'Decoupled Systems', 'Replayable Logs']
  },
  {
    id: '04',
    title: 'Blockchain & Credential Services',
    tagline: 'Immutable proof of attendance.',
    description: 'EVM integration via Web3j to issue credentials, interact with smart contracts, and store transaction hashes on-chain.',
    icon: <Code2 className="w-8 h-8" />,
    features: ['Smart Contracts', 'Web3j Integration', 'Issue Credential', 'Store Tx Hash']
  },
  {
    id: '05',
    title: 'Verification & Passport Services',
    tagline: 'Trustless validation.',
    description: 'Public verification APIs, cross-checking with the blockchain, detecting mismatches, and managing attendee passports and reputation history.',
    icon: <Target className="w-8 h-8" />,
    features: ['Public Verification', 'Cross-check DB + Chain', 'Mismatch Detection', 'Reputation/History']
  },
  {
    id: '06',
    title: 'Wallet & Infrastructure',
    tagline: 'Connecting the ecosystem.',
    description: 'Robust backend backed by Spring Boot, MongoDB for operational data, Redis for caching/rate limiting, and seamless Wallet Connect integration.',
    icon: <Palette className="w-8 h-8" />,
    features: ['Spring Boot', 'MongoDB / Redis', 'Wallet Connect', 'Rate Limiting']
  }
];

const Services: React.FC = () => {
  const [gsapLoaded, setGsapLoaded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const servicesGridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!gsapLoaded || !window.gsap) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero Title Animation - Fade and scale
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.2
          }
        );
      }

      // Subtitle Animation - slide up
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.5
          }
        );
      }

      // Hero stats animation
      const heroStats = gsap.utils.toArray('.hero-stat') as HTMLElement[];
      if (heroStats.length > 0) {
        gsap.fromTo(heroStats,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.8
          }
        );
      }

      // Service Cards - Scale and fade reveal
      const serviceCards = gsap.utils.toArray('.service-card') as HTMLElement[];
      if (serviceCards.length > 0) {
        serviceCards.forEach((card: HTMLElement) => {
          gsap.fromTo(card,
            { scale: 0.85, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none"
              }
            }
          );


        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [gsapLoaded]);

  return (
    <div ref={containerRef} className="bg-[#fcfcfc] text-[#1a1a1a] antialiased min-h-screen">
      <NavItem />
      {/* Hero Header */}
      <header className="pt-24 sm:pt-28 md:pt-40 pb-6 sm:pb-12 md:pb-16 px-4 sm:px-6 md:px-12 max-w-screen mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Title and Description */}
          <div>
            {/* Elegant Breadcrumb Navigation */}
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 sm:mb-8 whitespace-nowrap overflow-x-auto scrollbar-hide pr-4">
              <TransitionLink href="/" className="hover:text-zinc-900 transition-colors inline">Home</TransitionLink>
              <span className="mx-2">/</span>
              <span className="text-zinc-900 inline">Services</span>
            </div>

            <h1 ref={titleRef} className="hero-title text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-zinc-900 mb-8">
              Backend Architecture
            </h1>
            <p ref={subtitleRef} className="hero-subtitle text-zinc-600 text-xl md:text-2xl leading-relaxed">
              Our Event App GenZ is powered by a robust, domain-driven microservices architecture, built for scalability, real-time event streaming with Kafka, and immutable blockchain verification.
            </p>
          </div>

          {/* Right: Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="hero-stat bg-black rounded-3xl p-8 text-white">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">9+</div>
              <div className="text-sm font-bold uppercase tracking-wide opacity-80">Microservices</div>
            </div>
            <div className="hero-stat bg-black rounded-3xl p-8 text-white">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">Kafka</div>
              <div className="text-sm font-bold uppercase tracking-wide opacity-80">Event Streaming</div>
            </div>
            <div className="hero-stat bg-[#ecff33] rounded-3xl p-8 text-black">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">Web3</div>
              <div className="text-sm font-bold uppercase tracking-wide opacity-80">Blockchain Ready</div>
            </div>
            <div className="hero-stat bg-black rounded-3xl p-8 text-white">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">100%</div>
              <div className="text-sm font-bold uppercase tracking-wide opacity-80">Scalable</div>
            </div>
          </div>
        </div>
      </header>

      {/* Services Grid - Bento Box Layout */}
      <section ref={servicesGridRef} className="max-w-screen mx-auto px-6 md:px-12 pb-32">
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-zinc-900 mb-4">System Components</h2>
          <p className="text-zinc-600 text-xl max-w-2xl">High Level Design of the Event App GenZ</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 auto-rows-[minmax(280px,auto)]">
          {/* Web Development - Large Featured Card */}
          <div className="service-card md:col-span-6 lg:col-span-8 lg:row-span-2 bg-black text-white rounded-[2rem] p-10 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecff33]/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="text-[#ecff33] font-mono text-sm font-bold mb-4 block">{SERVICES[0].id}</span>
                <h3 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">{SERVICES[0].title}</h3>
                <p className="text-zinc-400 text-lg font-bold mb-4">{SERVICES[0].tagline}</p>
                <p className="text-zinc-400 text-base leading-relaxed max-w-lg mb-8">{SERVICES[0].description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SERVICES[0].features.map((feature, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">{feature}</span>
                ))}
              </div>
            </div>
          </div>

          {/* UI/UX Design */}
          <div className="service-card md:col-span-3 lg:col-span-4 bg-[#ecff33] text-black rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold opacity-60 mb-3 block">{SERVICES[1].id}</span>
                <h3 className="text-3xl font-black mb-2 tracking-tight">{SERVICES[1].title}</h3>
                <p className="text-black/60 font-bold text-sm mb-3">{SERVICES[1].tagline}</p>
                <p className="text-black/70 text-sm leading-relaxed">{SERVICES[1].description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-6">
                {SERVICES[1].features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-black/10 rounded-full text-xs font-medium">{feature}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Apps */}
          <div className="service-card bg-black md:col-span-3 lg:col-span-4 rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="text-[#ecff33] font-mono text-xs font-bold mb-3 block">{SERVICES[2].id}</span>
                <h3 className="text-3xl font-black mb-2 text-white tracking-tight">{SERVICES[2].title}</h3>
                <p className="text-zinc-500 font-bold text-sm mb-3">{SERVICES[2].tagline}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{SERVICES[2].description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-6">
                {SERVICES[2].features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium text-zinc-300">{feature}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Digital Strategy */}
          <div className="service-card md:col-span-3 lg:col-span-4 bg-black text-white rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="text-[#ecff33] font-mono text-xs font-bold mb-3 block">{SERVICES[3].id}</span>
                <h3 className="text-3xl font-black mb-2 tracking-tight">{SERVICES[3].title}</h3>
                <p className="text-zinc-500 font-bold text-sm mb-3">{SERVICES[3].tagline}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{SERVICES[3].description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-6">
                {SERVICES[3].features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium text-zinc-300">{feature}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Identity */}
          <div className="service-card bg-[#ecff33] md:col-span-3 lg:col-span-4 rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold opacity-60 mb-3 block">{SERVICES[4].id}</span>
                <h3 className="text-3xl font-black mb-2 text-zinc-900 tracking-tight">{SERVICES[4].title}</h3>
                <p className="text-black/60 font-bold text-sm mb-3">{SERVICES[4].tagline}</p>
                <p className="text-black/70 text-sm leading-relaxed">{SERVICES[4].description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-6">
                {SERVICES[4].features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-black/10 rounded-full text-xs font-medium">{feature}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Web Design */}
          <div className="service-card md:col-span-6 lg:col-span-4 bg-black text-white rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="text-[#ecff33] font-mono text-xs font-bold mb-3 block">{SERVICES[5].id}</span>
                <h3 className="text-3xl font-black mb-2 tracking-tight">{SERVICES[5].title}</h3>
                <p className="text-zinc-500 font-bold text-sm mb-3">{SERVICES[5].tagline}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{SERVICES[5].description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-6">
                {SERVICES[5].features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium text-zinc-300">{feature}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Oroya Approach — Sequential Scroll Section */}
      <OroyaSequentialScroll />

      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Services;

