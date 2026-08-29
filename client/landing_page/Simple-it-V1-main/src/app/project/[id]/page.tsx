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
    title: 'RISC',
    category: 'UI/UX Design & Development for RISC Platform.',
    shortDesc: 'Comprehensive digital transformation for RISC.',
    tags: ['DESIGN', 'DEVELOPMENT', 'SUPPORT'],
    image: '/RISC/Screenshot_20260303_002342.png',
    client: 'RISC',
    duration: '4 Months',
    date: 'Dec 2023',
    website: '#',
    challenge: 'The client needed a complete digital overhaul to establish their presence in a highly competitive market. Their legacy systems were convoluted, making it difficult for users to navigate and for administrators to manage content efficiently.',
    solution: 'We developed a responsive platform with custom animations, an intuitive UI, and a streamlined backend. The new architecture is highly modular, ensuring seamless updates and a drastic reduction in page load speeds across all devices.',
    objectives: [
      'Create a visually stunning digital presence',
      'Build a cohesive platform for all users',
      'Implement seamless content management',
      'Optimize for fast loading times'
    ],
    targetAudience: 'Users seeking a streamlined digital experience, prioritizing usability and modern aesthetics. This includes tech-savvy professionals and everyday consumers looking for rapid access to information.',
    keyFeatures: [
      { title: 'Custom animation library', details: 'A bespoke animation library built using GSAP, tailored specifically for the brand to ensure ultra-smooth, lightweight visual transitions.' },
      { title: 'Integrated system management', details: 'A centralized dashboard allowing administrators to oversee everything from analytics to user permissions without leaving the platform.' },
      { title: 'Modern responsive design', details: 'A fully fluid layout system that automatically adapts to any screen size, providing a perfect viewing experience from ultra-wide monitors to small mobile screens.' },
      { title: 'Content management system', details: 'A custom, headless CMS integration giving editors real-time preview capabilities and dynamic content modeling.' },
      { title: 'Next level user interactivity', details: 'Micro-interactions on hover and click states that provide immediate tactile feedback, significantly improving the overall UX.' }
    ],
    deliverables: ['Website Design & Development', 'Custom UI/UX', 'SEO Optimization', 'Analytics Setup', '3 Months Support'],
    results: [
      { metric: '350%', label: 'Increase in traffic' },
      { metric: '180%', label: 'User engagement' },
      { metric: '95%', label: 'Client satisfaction' }
    ],
    technologies: [
      { category: 'Frontend', tech: 'React' },
      { category: 'Framework', tech: 'Next.js' },
      { category: 'Styling', tech: 'Tailwind CSS' },
      { category: 'Animation', tech: 'GSAP' },
      { category: 'Backend', tech: 'Node.js' }
    ],
    images: [
      '/RISC/Screenshot_20260303_002342.png',
      '/RISC/Screenshot_20260303_002448.png',
      '/RISC/Screenshot_20260303_002519.png',
      '/RISC/Screenshot_20260303_002550.png',
      '/RISC/Screenshot_20260303_002628.png',
      '/RISC/Screenshot_20260303_002651.png'
    ]
  },
  {
    id: 2,
    title: 'Campus Buddy',
    category: 'Offline-First Mobile App for Activity & Focus Management.',
    shortDesc: 'A powerful mobile toolkit for students combining focus management, finance tracking, and a secure vault.',
    tags: ['MOBILE APP', 'DEVELOPMENT', 'UI/UX'],
    image: '/CAMPUS BUDDY/Screenshot_20260302-224546_CollegeBuddy~2.png',
    client: 'Campus Buddy',
    duration: 'Ongoing',
    date: 'March 2026',
    website: '#',
    challenge: 'Students struggle with focus, task management, and keeping track of their daily expenses while dealing with overwhelming digital distractions. Balancing academic obligations with social life creates a chaotic digital footprint that decreases productivity.',
    solution: 'We built an offline-first mobile application featuring a robust Dead Man’s Switch for distraction monitoring, a hard lockdown Kiosk Mode, finance manager, and a stealth vault. This creates a unified sanctuary that forces accountability and fosters deep work.',
    objectives: [
      'Provide strict distraction management through Kiosk and Dead Man’s Switch mode',
      'Create an offline-first architecture with background sync',
      'Integrate daily schedule management and financial tracking',
      'Implement an encrypted stealth vault for private media'
    ],
    targetAudience: 'Students, researchers, and young professionals who demand rigorous focus management and integrated tools. The app is designed for highly motivated individuals who want a proactive approach to limit their screen time and manage expenses efficiently.',
    keyFeatures: [
      { title: 'Awake/Sleep toggles with Dead Man’s Switch', details: 'A sophisticated focus watchdog. If you fail to check in within your designated focus window, the app enforces a lockout or triggers an alert, ensuring you do not fall prey to digital wandering.' },
      { title: 'Kiosk Mode (Hard Focus Lockdown)', details: 'Completely restricts the device to a single screen, disabling standard navigation buttons and notifications until the focus session is successfully completed, forcing you to concentrate.' },
      { title: 'Dual Task Modes (Weekday/Holiday)', details: 'Automatically swaps out your schedule and available features based on the day of the week, allowing strict regimens during the week and relaxed interfaces on the weekends.' },
      { title: 'Intelligent Notification Ecosystem', details: 'Intercepts incoming messages, stores them in a separate silent bundle, and even allows for offline automated replies to let your contacts know you are deeply focused.' },
      { title: 'Built-in Finance Manager', details: 'Instead of switching between multiple finance apps, track your daily cafeteria expenses, bus fares, and planned future payments entirely offline with robust categorization.' },
      { title: 'Encrypted Stealth Vault', details: 'A hidden, 256-bit encrypted storage space designed to look exactly like a fully functional music player. It only unlocks your private media and documents via a secret gesture sequence.' }
    ],
    deliverables: ['Mobile App', 'Local Database Architecture', 'Web Dashboard Control Center', 'Background Sync Engine', 'Encryption Module'],
    results: [
      { metric: '100%', label: 'Offline capability' },
      { metric: '0', label: 'Distractions during Kiosk Mode' },
      { metric: '256-bit', label: 'Vault Encryption' }
    ],
    technologies: [
      { category: 'Frontend', tech: 'React Native' },
      { category: 'Local DB', tech: 'WatermelonDB' },
      { category: 'Backend', tech: 'PostgreSQL / Node.js' },
      { category: 'State', tech: 'Redux/Zustand' },
      { category: 'Security', tech: 'Crypto-JS' },
      { category: 'Sync', tech: 'WebSockets' }
    ],
    images: [
      '/CAMPUS BUDDY/Screenshot_20260302-224546_CollegeBuddy~2.png',
      '/CAMPUS BUDDY/Screenshot_20260302-224553_CollegeBuddy~2.png',
      '/CAMPUS BUDDY/Screenshot_20260302-224557_CollegeBuddy~2.png',
      '/CAMPUS BUDDY/Screenshot_20260302-224618_CollegeBuddy~2.png',
      '/CAMPUS BUDDY/Screenshot_20260302-224751_CollegeBuddy~2.png',
      '/CAMPUS BUDDY/Screenshot_20260302-224803_CollegeBuddy~2.png'
    ],
    isMobileApp: true
  },
  {
    id: 3,
    title: 'Broken Shell',
    category: 'An innovative arch-based terminal interface acting as a web OS.',
    shortDesc: 'Complete web OS via terminal interface.',
    tags: ['AESTHETIC', 'WEB3', 'DEVELOPMENT'],
    image: '/BrokennShell/Screenshot_20260304_130807.png',
    client: 'Broken Shell',
    duration: 'Ongoing',
    date: 'March 2024',
    website: '#',
    challenge: 'The client needed a highly engaging, flagship-level platform that mimics a full Linux-based operating system in the browser to establish their Web3 presence. Standard layouts wouldn\'t provide the deep technological vibe they were aiming for.',
    solution: 'We engineered an arch-based terminal website where users control the environment via Linux commands. Upon logging in with an ID and password, users can access admin-assigned projects, integrating Web3 features and all social media channels into a cohesive OS-like experience.',
    objectives: [
      'Create an immersive arch-based terminal UX',
      'Implement an OS-level application manager',
      'Integrate Telegram & other social ecosystems naturally',
      'Achieve a flagship, cyberpunk-esque visual standard'
    ],
    targetAudience: 'Developers, tech enthusiasts, and Web3 investors who appreciate low-level computing interfaces, gamified interactions, and uncompromising digital aesthetics.',
    keyFeatures: [
      { title: 'Arch-Based Terminal Engine', details: 'A fully custom command-line parser that interprets standard Linux commands like ls, cd, cat alongside custom application triggers, making the entire website feel like a real OS.' },
      { title: 'Secure Login & Project Assignment', details: 'A secure authentication layer verifying users via ID and passing them into a personalized space where admins can dynamically assign and revoke access to specific projects.' },
      { title: 'Social & Web3 Integration', details: 'Deep connection to Telegram bots and seamless integration with Web3 wallets and smart contracts, allowing direct interaction from the terminal interface.' },
      { title: 'Flagship Aesthetic & Shaders', details: 'Heavily stylized cathode-ray tube (CRT) effects, pixel-perfect brutalist typography, and WebGL background elements creating an unmistakable identity.' }
    ],
    deliverables: ['Web Application', 'Terminal UI Engine', 'Auth Infrastructure', 'Web3 Integrations', 'Social Automations'],
    results: [
      { metric: '100%', label: 'Terminal immersion' },
      { metric: '4x', label: 'Average session time' },
      { metric: 'Multi-chain', label: 'Web3 Ready' }
    ],
    technologies: [
      { category: 'Frontend', tech: 'Next.js' },
      { category: 'Visuals', tech: 'Three.js / WebGL' },
      { category: 'Backend', tech: 'Node.js' },
      { category: 'Web3', tech: 'Ethers.js / Wagmi' },
      { category: 'Terminal', tech: 'Xterm.js / Custom Engine' },
      { category: 'Auth', tech: 'JWT / Custom OAuth' }
    ],
    images: [
      '/BrokennShell/Screenshot_20260304_130412.png',
      '/BrokennShell/Screenshot_20260304_130500.png',
      '/BrokennShell/Screenshot_20260304_130606.png',
      '/BrokennShell/Screenshot_20260304_130739.png',
      '/BrokennShell/Screenshot_20260304_130807.png'
    ]
  },
  {
    id: 4,
    title: 'WOC',
    category: 'UI/UX Design & Custom Code development of WOC website.',
    shortDesc: 'Premium digital experience for WOC.',
    tags: ['DEVELOPMENT', 'WEB DESIGN'],
    image: '/WOC/Screenshot_20260303_002732.png',
    client: 'WOC',
    duration: '5 Months',
    date: 'March 2024',
    website: '#',
    challenge: 'WOC required a highly premium, modern platform to present their vision online. Standard templates failed to capture their avant-garde identity, leading to a disconnect between their physical branding and their online presence.',
    solution: 'We engineered a visually striking, highly interactive website focused on conveying maximum brand value rapidly. By utilizing advanced WebGL components and buttery-smooth scrolling, the website acts as an immersive digital showroom.',
    objectives: [
      'Create an online experience that matches premium quality',
      'Implement an intuitive layout system',
      'Establish brand authority',
      'Increase average engagement value'
    ],
    targetAudience: 'Discerning users, potential investors, and luxury consumers who expect flawlessness and high-end design sensibilities. These users are heavily influenced by visual storytelling and seamless, app-like web experiences.',
    keyFeatures: [
      { title: 'Interactive storytelling', details: 'A scroll-driven narrative that guides the user through the brand’s history, gradually revealing information to maintain a sense of mystery.' },
      { title: 'Comprehensive layout system', details: 'A grid-defying modular layout that brings editorial, magazine-style brutalism directly into the web space while ensuring accessibility.' },
      { title: 'Fluid animations', details: 'Physics-based page transitions and spring animations that make every click, hover, and swipe feel weighty and deeply satisfying.' },
      { title: 'High performance', details: 'Despite heavy media use, strategic lazy-loading and edge-caching ensure the site achieves perfect Lighthouse scores across the globe.' },
      { title: 'Fully responsive UI', details: 'Custom breakpoints guaranteeing the premium aesthetic is preserved flawlessly whether viewed on a 4K display or a compact smartphone.' }
    ],
    deliverables: ['E-commerce Website', 'Content Strategy', 'UI Systems', 'Web Components'],
    results: [
      { metric: '520%', label: 'Online growth' },
      { metric: '85%', label: 'User satisfaction' },
      { metric: '3.2x', label: 'Average engagement duration' }
    ],
    technologies: [
      { category: 'Framework', tech: 'Next.js' },
      { category: 'Animation', tech: 'Framer Motion' },
      { category: 'Styling', tech: 'Tailwind CSS' }
    ],
    images: [
      '/WOC/Screenshot_20260303_002732.png',
      '/WOC/Screenshot_20260303_002814.png',
      '/WOC/Screenshot_20260303_002856.png',
      '/WOC/Screenshot_20260303_002929.png'
    ]
  },
  {
    id: 5,
    title: 'E-Commerce Marketing Landing Page',
    category: 'UI/UX Design for E-commerce Marketing Landing Page.',
    shortDesc: 'High-converting landing page for digital marketing agency',
    tags: ['SUPPORT', 'WEB DESIGN'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    client: 'E-Comm Pro',
    duration: '1 Month',
    date: 'April 2024',
    website: 'https://ecommpro.com',
    challenge: 'The agency suffered from poor return on ad spend (ROAS) because their landing page was failing to convert cold traffic. Visitors were overwhelmed by walls of text and lacked an immediate understanding of the core value proposition.',
    solution: 'We architected a high-velocity, conversion-focused landing page featuring a strict messaging hierarchy. By implementing dynamic social proof widgets and perfectly positioned CTAs derived from heatmap analytics, we dramatically optimized the funnel.',
    objectives: [
      'Achieve 5%+ conversion rate from paid traffic',
      'Reduce cost per acquisition by 40%',
      'A/B test different messaging approaches',
      'Create scalable template for future campaigns'
    ],
    targetAudience: 'Ambitious e-commerce business owners and marketing executives actively seeking agency partnerships to scale their revenue. These decision-makers have limited time and demand immediate proof of ROI.',
    keyFeatures: [
      { title: 'Above-the-fold video testimonial', details: 'Instantly builds trust by showcasing high-production-value interviews with successful clients immediately upon page load.' },
      { title: 'Interactive ROI calculator', details: 'A dynamic sliding tool that allows prospects to input their current metrics and instantly visualize their projected growth with the agency.' },
      { title: 'Strategic CTA placement', details: 'Call-to-action buttons positioned aggressively yet elegantly at exact drop-off points determined by extensive scroll depth analysis.' },
      { title: 'Trust signals and client logos', details: 'An animated marquee banner featuring recognizable industry brands to establish immediate authority by association.' },
      { title: 'Mobile-optimized forms', details: 'A frictionless, floating multi-step lead capture form that takes less than 15 seconds to complete on a mobile device.' },
      { title: 'Exit-intent popup', details: 'A smart overlay that triggers precisely when mouse velocity indicates departure, offering an exclusive downloadable resource' }
    ],
    deliverables: ['Landing Page Design', 'A/B Testing Setup', 'Analytics Integration', 'Conversion Optimization', 'Copy Writing', 'Ad Creative Suggestions'],
    results: [
      { metric: '680%', label: 'Conversion rate increase' },
      { metric: '45%', label: 'Reduction in CPA' },
      { metric: '8.2%', label: 'Final conversion rate' }
    ],
    technologies: [
      { category: 'Markup', tech: 'HTML5' },
      { category: 'Styling', tech: 'CSS3' },
      { category: 'Language', tech: 'JavaScript' },
      { category: 'Analytics', tech: 'Google Analytics' },
      { category: 'User Insights', tech: 'Hotjar' },
      { category: 'Optimization', tech: 'A/B Testing' }
    ],
    images: [
      'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c2fd?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1600'
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
          <span className="font-bold text-[#ecff33] uppercase tracking-wider text-xs">Delivered element  </span>
          — Important project component successfully launched.
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
          <h1 className="text-6xl font-black text-black mb-6">Project Not Found</h1>
          <TransitionLink href="/project">
            <button className="text-2xl font-bold flex items-center gap-3 mx-auto hover:opacity-60 transition-opacity">
              <ArrowLeft /> Back to Projects
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
              <TransitionLink href="/project" className="hover:text-black transition-colors">Work</TransitionLink>
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
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Client</div>
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
            Project Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 lg:gap-12 mb-16 lg:mb-20">
            {/* The Challenge */}
            <div className="flex flex-col items-start border-t-2 border-black pt-6 sm:pt-12">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-zinc-400 mb-4 sm:mb-6">The Challenge</h3>
              <p className="text-base sm:text-lg md:text-xl text-black leading-relaxed font-medium">
                {project.challenge}
              </p>
            </div>

            {/* Our Solution */}
            <div className="flex flex-col items-start border-t-2 border-black pt-6 sm:pt-12">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-zinc-400 mb-4 sm:mb-6">Our Solution</h3>
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
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mb-8 sm:mb-12">Feature Analysis</h3>
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
              The Tools Behind the Work
            </h2>
            <p className="text-base sm:text-lg md:text-2xl text-zinc-500 max-w-xl font-medium leading-relaxed">
              The foundational technologies and architecture that power this solution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-stretch">
            {/* Left Column - Tech Visual Card */}
            <div className="lg:col-span-5 flex flex-col h-full space-y-6">
              <div className="relative flex-1 rounded-3xl overflow-hidden bg-black p-6 sm:p-10 md:p-12 shadow-2xl flex flex-col justify-between">

                <div className="relative z-10">
                  <div className="inline-block bg-[#ecff33] text-black px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-black text-[10px] md:text-xs uppercase tracking-widest mb-6 md:mb-8">
                    Architecture
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight">
                    Modern & Scalable Foundation
                  </h3>
                  <p className="text-base md:text-lg text-zinc-400 leading-relaxed mb-8 md:mb-10">
                    Engineered for performance, reliability, and unparalleled user experience.
                  </p>

                  <div className="space-y-3 md:space-y-4 mb-2 md:mb-4">
                    {['High Performance', 'Robust Security', 'Scalable Systems'].map((feat, i) => (
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
                {project.technologies.map((item, i) => (
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
