'use client';

import { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ArrowUpRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import NavItem from '@/components/molecules/NavItem';
import Footer from '@/components/organisms/Footer';
import TransitionLink from '@/components/atoms/TransitionLink';
import CTA from '@/components/molecules/CTA';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

// Project data
const PROJECTS = [
  {
    id: 1,
    title: 'Web3 Hacker House',
    category: 'A week-long immersive co-living and building experience for top developers.',
    shortDesc: 'Immersive builder experience.',
    tags: ['HACKATHON', 'WEB3', 'IRL'],
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
    client: 'DevDAO',
    duration: '7 Days',
    date: 'Dec 2023',
    website: '#',
    challenge: 'Bringing together the brightest minds in Web3 to collaborate, build, and innovate in a high-energy environment. The goal was to foster deep connections and rapid prototyping.',
    solution: 'We curated a fully-equipped hacker house with high-speed internet, dedicated workspaces, and daily mentorship sessions. Developers co-lived and built next-gen protocols, culminating in a demo day with top VCs.',
    objectives: [
      'Foster deep collaboration among developers',
      'Accelerate Web3 protocol prototyping',
      'Provide direct access to mentorship and funding'
    ],
    targetAudience: 'Top-tier blockchain developers, founders, and Web3 enthusiasts looking to build and scale new projects.',
    keyFeatures: [
      { title: '24/7 Co-working Space', details: 'A fully stocked workspace designed for flow state, complete with ergonomic setups and endless coffee.' },
      { title: 'Mentorship Office Hours', details: 'Daily 1-on-1 sessions with industry leaders, cryptographers, and successful founders.' },
      { title: 'Demo Day Pitch', details: 'The grand finale where teams pitched their 7-day builds to a panel of top-tier venture capitalists.' }
    ],
    deliverables: ['Sponsorships', 'Venue Logistics', 'Developer Onboarding', 'Demo Day Production'],
    stats: [
      { category: 'Attendees', tech: '150+' },
      { category: 'Projects Built', tech: '32' },
      { category: 'Funding Raised', tech: '$2.5M' },
      { category: 'Hours Coded', tech: '10,000+' }
    ],
    images: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 2,
    title: 'GenZ Tech Summit',
    category: 'The largest gathering of young founders and technologists.',
    shortDesc: 'Connecting the next generation of builders.',
    tags: ['CONFERENCE', 'NETWORKING', 'TECH'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    client: 'Tech Youth',
    duration: '2 Days',
    date: 'March 2026',
    website: '#',
    challenge: 'Young founders often lack a dedicated platform to showcase their ideas and connect with like-minded peers and investors on a large scale.',
    solution: 'A massive two-day summit featuring keynote speeches from GenZ unicorn founders, interactive workshops, and a massive networking mixer powered by our AI matchmaking.',
    objectives: [
      'Inspire the next wave of young entrepreneurs',
      'Facilitate meaningful networking via AI',
      'Showcase cutting-edge tech built by GenZ'
    ],
    targetAudience: 'Students, young professionals, and early-stage founders under 25 looking for inspiration and connections.',
    keyFeatures: [
      { title: 'Keynote Stages', details: 'Multiple stages featuring talks on AI, Web3, creator economy, and sustainable tech.' },
      { title: 'AI Matchmaking Lounges', details: 'Dedicated zones where attendees met their algorithmically matched peers for high-value networking.' },
      { title: 'Startup Alley', details: 'An exhibition floor showcasing 50+ early-stage startups founded by students.' }
    ],
    deliverables: ['Stage Design', 'Ticketing & Access', 'AI Matchmaking Engine', 'Speaker Management'],
    stats: [
      { category: 'Total Visitors', tech: '5,000+' },
      { category: 'Speakers', tech: '45' },
      { category: 'Matches Made', tech: '12,000' },
      { category: 'Startups Exhibited', tech: '50' }
    ],
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1558403194-611308249d50?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 3,
    title: 'Neon Nights Party',
    category: 'An exclusive token-gated warehouse party with live DJ sets.',
    shortDesc: 'Exclusive Web3 nightlife experience.',
    tags: ['PARTY', 'MUSIC', 'EXCLUSIVE'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
    client: 'Nightlife Collective',
    duration: '1 Night',
    date: 'March 2024',
    website: '#',
    challenge: 'Creating a highly exclusive, secure, and memorable nightlife experience where entry and VIP access are entirely governed by on-chain assets.',
    solution: 'A futuristic warehouse party featuring top electronic DJs. Entry was strictly token-gated, requiring attendees to hold a specific NFT or have a minimum on-chain reputation score.',
    objectives: [
      'Demonstrate the utility of NFT ticketing',
      'Create a premium, immersive audiovisual experience',
      'Ensure a secure, bot-free guestlist'
    ],
    targetAudience: 'Web3 natives, NFT collectors, and electronic music fans seeking exclusive, high-energy IRL experiences.',
    keyFeatures: [
      { title: 'Token-Gated Entry', details: 'Seamless NFC wristbands paired with user wallets to verify NFT ownership at the door in seconds.' },
      { title: 'Immersive Audiovisuals', details: 'State-of-the-art projection mapping and laser systems synchronized with the DJ sets.' },
      { title: 'VIP Token Lounges', details: 'Exclusive areas accessible only to holders of ultra-rare community tokens.' }
    ],
    deliverables: ['Venue Transformation', 'Token-Gating Tech', 'Artist Booking', 'Audiovisual Production'],
    stats: [
      { category: 'Attendees', tech: '800' },
      { category: 'Tickets Minted', tech: '1,000' },
      { category: 'Artists', tech: '5' },
      { category: 'Vibes', tech: 'Immaculate' }
    ],
    images: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 4,
    title: 'AI Builders Workshop',
    category: 'Hands-on sessions on building LLM agents and AI apps.',
    shortDesc: 'Learn to build the future with AI.',
    tags: ['WORKSHOP', 'AI', 'LEARNING'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
    client: 'AI Builders',
    duration: '1 Day',
    date: 'March 2024',
    website: '#',
    challenge: 'Providing hands-on, deeply technical education on emerging AI frameworks to a diverse group of developers in a short timeframe.',
    solution: 'An intensive, full-day workshop led by core contributors to popular open-source AI tools. Attendees built and deployed their own autonomous agents by the end of the day.',
    objectives: [
      'Upskill developers in LLM integration',
      'Provide hands-on building experience',
      'Foster a community of AI engineers'
    ],
    targetAudience: 'Software engineers, data scientists, and technical founders eager to integrate generative AI into their products.',
    keyFeatures: [
      { title: 'Live Coding Sessions', details: 'Real-time walkthroughs of building RAG pipelines and autonomous agents.' },
      { title: 'Breakout Pods', details: 'Small group sessions for personalized debugging and architectural advice.' },
      { title: 'Deployment Challenge', details: 'A mini-hackathon at the end where attendees competed to deploy the most creative AI app.' }
    ],
    deliverables: ['Curriculum Design', 'Technical Environment Setup', 'Instructor Sourcing', 'Catering'],
    stats: [
      { category: 'Participants', tech: '200' },
      { category: 'Agents Deployed', tech: '185' },
      { category: 'Instructors', tech: '8' },
      { category: 'Lines of Code', tech: '50k+' }
    ],
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200'
    ]
  }
];

function DeliverableCard({ item, className = '' }: { item: string; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card || !content) return;

    const nameEl = card.querySelector('.tc-name') as HTMLElement;
    const arrowEl = card.querySelector('.tc-arrow') as HTMLElement;

    gsap.killTweensOf(content);
    gsap.killTweensOf(card);
    if (nameEl) gsap.killTweensOf(nameEl);
    if (arrowEl) gsap.killTweensOf(arrowEl);

    gsap.set(content, { display: 'block' });
    const h = content.scrollHeight;
    gsap.to(content, { height: h, opacity: 1, duration: 0.35, ease: 'power3.out' });

    gsap.to(card, { backgroundColor: '#18181b', duration: 0.3, ease: 'power2.out' });
    if (nameEl) gsap.to(nameEl, { color: '#ffffff', duration: 0.25 });
    if (arrowEl) gsap.to(arrowEl, { rotation: 90, color: '#ecff33', duration: 0.3, ease: 'power2.out' });
  }, []);

  const handleLeave = useCallback(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card || !content) return;

    const nameEl = card.querySelector('.tc-name') as HTMLElement;
    const arrowEl = card.querySelector('.tc-arrow') as HTMLElement;

    gsap.killTweensOf(content);
    gsap.killTweensOf(card);
    if (nameEl) gsap.killTweensOf(nameEl);
    if (arrowEl) gsap.killTweensOf(arrowEl);

    gsap.to(content, {
      height: 0, opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => { gsap.set(content, { display: 'none' }); },
    });

    gsap.to(card, { backgroundColor: '#ffffff', duration: 0.3, ease: 'power2.out' });
    if (nameEl) gsap.to(nameEl, { color: '#18181b', duration: 0.25 });
    if (arrowEl) gsap.to(arrowEl, { rotation: 0, color: '#18181b', duration: 0.25, ease: 'power2.in' });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`ts-pill rounded-2xl border border-zinc-200 px-6 py-5 cursor-default select-none bg-white transition-shadow duration-300 hover:shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="tc-name text-lg font-bold tracking-tight text-black">
          {item}
        </span>
        <span className="tc-arrow text-black text-lg transition-colors duration-200">▸</span>
      </div>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0, display: 'none' }}
      >
        <p className="text-[13px] leading-snug text-zinc-400 mt-3 pt-3 border-t border-zinc-600">
          <span className="font-bold text-[#ecff33] uppercase tracking-wider text-xs">Event Asset  </span>
          — Essential component successfully executed.
        </p>
      </div>
    </div>
  );
}

function FeatureItem({ feature }: { feature: any }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    const content = contentRef.current;
    const arrow = itemRef.current?.querySelector('.feat-arrow');
    const title = itemRef.current?.querySelector('.feat-title');

    if (!content) return;

    if (!isOpen) {
      gsap.set(content, { display: 'block' });
      const h = content.scrollHeight;
      gsap.to(content, { height: h, opacity: 1, duration: 0.7, ease: 'power4.out' });
      if (arrow) {
        gsap.to(arrow, { rotation: 45, backgroundColor: '#ffffff', borderColor: '#ffffff', color: '#18181b', duration: 0.6, ease: 'power3.out' });
      }
      if (title) {
        gsap.to(title, { color: '#ecff33', duration: 0.4 }); // text-[#ecff33]
      }
      setIsOpen(true);
    } else {
      gsap.to(content, {
        height: 0, opacity: 0, duration: 0.6, ease: 'power3.out',
        onComplete: () => { gsap.set(content, { display: 'none' }); }
      });
      if (arrow) {
        gsap.to(arrow, { rotation: 0, backgroundColor: 'transparent', borderColor: '#3f3f46', color: '#a1a1aa', duration: 0.6, ease: 'power3.out' });
      }
      if (title) {
        gsap.to(title, { color: '#ffffff', duration: 0.4 }); // text-white
      }
      setIsOpen(false);
    }
  };

  return (
    <div ref={itemRef} className="py-4 sm:py-6 bg-black transition-colors hover:bg-zinc-900 px-4 -mx-4 sm:mx-0 sm:px-4 rounded-xl">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between text-left group gap-4"
      >
        <span className="feat-title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white transition-colors group-hover:text-[#ecff33]">
          {feature.title || feature}
        </span>
        <div className="feat-arrow flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-zinc-700 text-zinc-400 flex items-center justify-center transition-colors group-hover:border-white group-hover:text-white">
          <Plus className="w-5 h-5 sm:w-8 sm:h-8" />
        </div>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0, display: 'none' }}
      >
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed max-w-4xl font-medium pt-4 sm:pt-8 pb-2">
          {feature.details || feature}
        </p>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gsapLoaded, setGsapLoaded] = useState(false);


  const projectId = parseInt(params.id as string);
  const project = PROJECTS.find(p => p.id === projectId);

  const nextImage = () => {
    if (project) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  useLayoutEffect(() => {
    setGsapLoaded(true);
  }, []);

  useLayoutEffect(() => {
    if (!gsapLoaded || !project) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.2
      });

      gsap.from('.hero-meta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.5
      });

      gsap.utils.toArray('.fade-in-section').forEach((section: any) => {
        gsap.from(section, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [gsapLoaded, project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-black text-black mb-6">Event Not Found</h1>
          <TransitionLink href="/project">
            <button className="text-2xl font-bold flex items-center gap-3 mx-auto hover:opacity-60 transition-opacity">
              <ArrowLeft /> Back to Events
            </button>
          </TransitionLink>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-[#fcfcfc] text-[#1a1a1a] antialiased">
      <NavItem />

      {/* Hero Section */}
      <section className="pt-20 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 pb-6 sm:pb-10 max-w-screen mx-auto">
        {/* Elegant Breadcrumb & Back Navigation */}
        <div className="flex flex-nowrap items-center gap-3 sm:gap-4 mb-4 sm:mb-8 hero-meta ml-0 w-full overflow-hidden max-w-full">
          <div className="shrink-0 flex-none">
            <TransitionLink href="/project">
              <button className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-zinc-200 hover:border-black hover:bg-black text-zinc-500 hover:text-white transition-all group shadow-sm bg-white shrink-0">
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </button>
            </TransitionLink>
          </div>
          <div className="flex flex-nowrap items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 min-w-0 w-full pr-4">
            <div className="shrink-0 whitespace-nowrap">
              <TransitionLink href="/" className="hover:text-black transition-colors">Home</TransitionLink>
            </div>
            <span className="mx-2 shrink-0">/</span>
            <div className="shrink-0 whitespace-nowrap">
              <TransitionLink href="/project" className="hover:text-black transition-colors">Events</TransitionLink>
            </div>
            <span className="mx-2 shrink-0">/</span>
            <span className="text-black truncate w-full block min-w-0">{project.title}</span>
          </div>
        </div>

        <div className="mb-0 mt-3 sm:mt-6">
          <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-black tracking-tighter leading-[0.85] mb-2 sm:mb-6 hero-title uppercase">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-zinc-600 max-w-4xl leading-relaxed sm:leading-tight hero-meta mt-2 sm:mt-4 mb-6 sm:mb-10">
            {project.category}
          </p>
        </div>

        {/* Project Meta Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="hero-meta">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Organizer</div>
            <p className="text-base sm:text-lg md:text-xl font-bold text-black">{project.client}</p>
          </div>
          <div className="hero-meta">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Duration</div>
            <p className="text-base sm:text-lg md:text-xl font-bold text-black">{project.duration}</p>
          </div>
          <div className="hero-meta">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Date</div>
            <p className="text-base sm:text-lg md:text-xl font-bold text-black">{project.date}</p>
          </div>
          <div className="hero-meta">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Website</div>
            <a href={project.website} target="_blank" rel="noopener noreferrer" className="text-base sm:text-lg md:text-xl font-bold text-black hover:text-[#ecff33] transition-colors underline">
              Visit Site
            </a>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-12 hero-meta">
          {project.tags.map(tag => (
            <span key={tag} className="text-[9px] font-black tracking-widest border-2 border-black px-4 py-2 rounded-full uppercase">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Full-Width Image Slider Banner */}
      <section className={`relative w-full bg-black overflow-hidden fade-in-section ${(project as any).isMobileApp ? 'h-[50vh] sm:h-[70vh] md:h-[85vh] lg:h-[100vh]' : 'sm:h-[70vh] md:h-[85vh] lg:h-[100vh]'
        }`}>
        {/* Invisible spacer image to force dynamic height on mobile for websites */}
        {!(project as any).isMobileApp && (
          <Image src={project.images[0]} alt="" width={1200} height={800} className="w-full h-auto invisible sm:hidden" aria-hidden="true" />
        )}
        <div className={`w-full ${(project as any).isMobileApp ? 'relative h-full' : 'absolute inset-0 sm:relative sm:inset-auto sm:h-full'}`}>
          {project.images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              {(project as any).isMobileApp ? (
                <>
                  <Image
                    src={img}
                    fill
                    sizes="100vw"
                    className="object-cover opacity-30 scale-[1.15] blur-3xl saturate-150"
                    alt=""
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-4 sm:gap-8 md:gap-16 p-6 sm:p-8 md:p-12 lg:p-16">
                    <div className="relative max-h-full w-[45%] lg:w-auto h-full aspect-[9/19]">
                      <Image
                        src={img}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-contain drop-shadow-2xl rounded-2xl md:rounded-[2rem]"
                        alt={`${project.title} - Image ${index + 1}`}
                      />
                    </div>
                    <div className="relative max-h-full w-[45%] lg:w-auto h-full aspect-[9/19]">
                      <Image
                        src={project.images[(index + 1) % project.images.length]}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-contain drop-shadow-2xl rounded-2xl md:rounded-[2rem]"
                        alt={`${project.title} - Image ${(index + 1) % project.images.length + 1}`}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <Image
                  src={img}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  alt={`${project.title} - Image ${index + 1}`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-3 sm:left-6 md:left-12 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-xl z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="text-black w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" strokeWidth={3} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-3 sm:right-6 md:right-12 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-xl z-10"
          aria-label="Next image"
        >
          <ChevronRight className="text-black w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" strokeWidth={3} />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-1.5 sm:px-6 sm:py-3 rounded-full z-10">
          <span className="text-white font-bold text-xs sm:text-sm tracking-widest sm:tracking-normal">
            {currentImageIndex + 1} / {project.images.length}
          </span>
        </div>

        {/* Dots Indicator */}
        <div className="hidden sm:flex absolute bottom-20 left-1/2 -translate-x-1/2 gap-2 z-10">
          {project.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Project Overview */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-10 md:py-16 bg-white fade-in-section">
        <div className="max-w-screen mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-8 md:mb-16 leading-none text-black">
            Event Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 lg:gap-12 mb-16 lg:mb-20">
            {/* The Challenge */}
            <div className="flex flex-col items-start border-t-2 border-black pt-6 sm:pt-12">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-zinc-400 mb-4 sm:mb-6">The Concept</h3>
              <p className="text-base sm:text-lg md:text-xl text-black leading-relaxed font-medium">
                {project.challenge}
              </p>
            </div>

            {/* Our Solution */}
            <div className="flex flex-col items-start border-t-2 border-black pt-6 sm:pt-12">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-zinc-400 mb-4 sm:mb-6">The Experience</h3>
              <p className="text-base sm:text-lg md:text-xl text-black leading-relaxed font-medium">
                {project.solution}
              </p>
            </div>

            {/* Target Audience */}
            <div className="flex flex-col items-start border-t-2 border-black pt-6 sm:pt-12">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-zinc-400 mb-4 sm:mb-6">Target Audience</h3>
              <p className="text-base sm:text-lg md:text-xl text-black leading-relaxed font-medium">
                {project.targetAudience}
              </p>
            </div>
          </div>

          {/* Key Features Dropdown Menu */}
          <div className="mb-8 lg:mb-12 mt-10 sm:mt-16 bg-black p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl -mx-4 sm:mx-0 shadow-2xl">
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mb-8 sm:mb-12">Event Highlights</h3>
            <div className="flex flex-col divide-y-2 divide-zinc-800 border-t-2 border-b-2 border-zinc-800">
              {project.keyFeatures.map((feature: any, i: number) => (
                <FeatureItem key={i} feature={feature} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 pt-0 pb-10 md:pt-0 md:pb-16 bg-white fade-in-section">
        <div className="max-w-screen mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-none text-black">
              Event Statistics
            </h2>
            <p className="text-base sm:text-lg md:text-2xl text-zinc-500 max-w-xl font-medium leading-relaxed">
              The metrics and impact generated by this experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-stretch">
            {/* Left Column - Tech Visual Card */}
            <div className="lg:col-span-5 flex flex-col h-full space-y-6">
              <div className="relative flex-1 rounded-3xl overflow-hidden bg-black p-6 sm:p-10 md:p-12 shadow-2xl flex flex-col justify-between">

                <div className="relative z-10">
                  <div className="inline-block bg-[#ecff33] text-black px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-black text-[10px] md:text-xs uppercase tracking-widest mb-6 md:mb-8">
                    Impact
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight">
                    Metrics that Matter
                  </h3>
                  <p className="text-base md:text-lg text-zinc-400 leading-relaxed mb-8 md:mb-10">
                    A look at the numbers behind the event.
                  </p>

                  <div className="space-y-3 md:space-y-4 mb-2 md:mb-4">
                    {['High Engagement', 'Verified Attendees', 'Unmatched Energy'].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 md:gap-4 bg-white/5 p-3 md:p-4 rounded-xl border border-white/10">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#ecff33] rounded-full"></div>
                        <span className="text-white font-bold text-sm md:text-base">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Tech Stack List */}
            <div className="lg:col-span-7 flex flex-col h-full">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 h-full">
                {(project as any).stats.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col justify-center p-5 sm:p-6 md:p-8 bg-white rounded-2xl md:rounded-3xl border-2 border-zinc-200 hover:border-black hover:shadow-xl transition-all group"
                  >
                    <div className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 md:mb-3 group-hover:text-[#ecff33] transition-colors">
                      {item.category}
                    </div>
                    <div className="text-lg sm:text-xl md:text-3xl font-black text-black tracking-tight">
                      {item.tech}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-32 pt-10 sm:pt-12 md:pt-16 border-t border-zinc-200">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase mb-6 md:mb-8 text-black">Deliverables</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {project.deliverables.map((item, i) => (
                <DeliverableCard key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}

      <CTA />

      <Footer />
    </div>
  );
}
