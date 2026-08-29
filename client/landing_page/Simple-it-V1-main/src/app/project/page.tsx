'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import NavItem from '@/components/molecules/NavItem';
import TransitionLink from '@/components/atoms/TransitionLink';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/organisms/Footer';
import CTA from '@/components/molecules/CTA';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

// Expose GSAP to window for Footer component
if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

interface Project {
  id: number;
  title: string;
  category: string;
  tags: string[];
  image: string;
  gridClass: string;
  client: string;
  duration: string;
  date: string;
  detailImage?: string;
  isPortrait?: boolean;
  filterCategories: FilterCategory[];
}

type FilterCategory = 'All' | 'App Design' | 'Web design' | 'Branding' | 'Development' | 'Support';

const FILTERS: FilterCategory[] = ['All', 'App Design', 'Web design', 'Branding', 'Development', 'Support'];

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'RISC',
    category: 'UI/UX Design & Development for RISC Platform.',
    tags: ['DESIGN', 'DEVELOPMENT', 'SUPPORT'],
    image: '/RISC/COVER PAGE/Screenshot_20260303_002342_cropped_processed_by_imagy.png',
    gridClass: 'md:col-span-6',
    client: 'RISC',
    duration: '4 Months',
    date: 'Dec 2023',
    filterCategories: ['Web design', 'Development', 'Support']
  },
  {
    id: 2,
    title: 'Campus Buddy',
    category: 'Offline-First Mobile App for Activity & Focus Management.',
    tags: ['MOBILE APP', 'DEVELOPMENT', 'UI/UX'],
    image: '/CAMPUS BUDDY/COVER PAGE/Screenshot_20260302-224557_CollegeBuddy~3.png',
    gridClass: 'md:col-span-6',
    client: 'Campus Buddy',
    duration: 'Ongoing',
    date: 'March 2026',
    isPortrait: true,
    filterCategories: ['App Design', 'Development', 'Support']
  },
  {
    id: 3,
    title: 'Broken Shell',
    category: 'An innovative arch-based terminal interface acting as a web OS.',
    tags: ['AESTHETIC', 'WEB3', 'DEVELOPMENT'],
    image: '/BrokennShell/COVER PAGE/Screenshot_20260304_130412_cropped_processed_by_imagy (2).png',
    gridClass: 'md:col-span-6',
    client: 'Broken Shell',
    duration: 'Ongoing',
    date: 'March 2024',
    filterCategories: ['Web design', 'Development', 'Branding']
  },
  {
    id: 4,
    title: 'WOC',
    category: 'UI/UX Design & Custom Code development of WOC website.',
    tags: ['DEVELOPMENT', 'WEB DESIGN'],
    image: '/WOC/COVER PAGE/Screenshot_20260303_002732_cropped_processed_by_imagy (1).png',
    gridClass: 'md:col-span-6',
    client: 'WOC',
    duration: '5 Months',
    date: 'March 2024',
    filterCategories: ['Web design', 'Development']
  },
];

const Page: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const titleRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<SVGPathElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Title Animation
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });

      // Highlight underline animation
      if (highlightRef.current) {
        gsap.fromTo(
          highlightRef.current,
          { strokeDasharray: 1000, strokeDashoffset: 1000 },
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut",
            delay: 0.5
          }
        );
      }

      // Filter menu animation
      gsap.from(filterRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.6
      });

      // Projects grid stagger animation
      gsap.from(".project-card", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.8
      });
    });

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    // Re-animate project cards when filter changes
    if (gridRef.current) {
      gsap.from(".project-card", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      });
    }
  }, [activeFilter]);

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(project => project.filterCategories.includes(activeFilter));

  return (
    <>
      <div className="bg-[#fcfcfc] text-[#1a1a1a] antialiased min-h-screen">
        <NavItem />

        {/* Hero Header */}
        <header className="pt-24 sm:pt-28 md:pt-40 pb-6 sm:pb-12 md:pb-16 px-4 sm:px-6 md:px-12 max-w-screen mx-auto">
          <div ref={titleRef}>
            {/* Elegant Breadcrumb Navigation */}
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 sm:mb-8 whitespace-nowrap overflow-x-auto scrollbar-hide pr-4">
              <TransitionLink href="/" className="hover:text-zinc-900 transition-colors inline">Home</TransitionLink>
              <span className="mx-2">/</span>
              <span className="text-zinc-900 inline">Work</span>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-0 gap-4 sm:gap-6 lg:gap-8">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tight leading-none text-zinc-900">
                <span className="relative inline-block">
                  <span className="relative z-10">Projects</span>
                  {/* Lime Underline SVG */}
                  <svg className="absolute top-[65%] sm:top-[75%] left-0 w-full h-10 sm:h-16 overflow-visible z-0" viewBox="0 0 600 40" preserveAspectRatio="none">
                    <path
                      ref={highlightRef}
                      d="M10 25 Q 150 10, 300 20 T 590 25"
                      fill="none"
                      stroke="#ecff33"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl font-medium max-w-md leading-relaxed lg:pb-4">
                Every project we deliver is a reflection of our commitment to quality, designed to inspire and drive success.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-screen mx-auto px-4 sm:px-6 md:px-12 pb-20 sm:pb-40">

          {/* Scrollable Mobile Filter Menu */}
          <div className="relative mb-10 md:mb-16 border-b border-zinc-200">
            <div
              ref={filterRef}
              className="flex items-center gap-6 pb-6 overflow-x-auto scrollbar-hide whitespace-nowrap snap-x snap-mandatory pr-8 md:pr-0 md:flex-wrap"
            >
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-base sm:text-lg md:text-xl font-bold tracking-tight transition-colors uppercase snap-start flex-shrink-0 ${activeFilter === filter
                    ? 'text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Fade out edge for mobile scroll */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fcfcfc] to-transparent pointer-events-none md:hidden"></div>
          </div>

          {/* Projects Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {filteredProjects.map((project, i) => (
              <TransitionLink key={i} href={`/project/${project.id}`} transitionLabel={project.title} className={`${project.gridClass} project-card group cursor-pointer`}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-zinc-100 mb-6 shadow-sm">
                  <Image
                    src={project.image}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="absolute inset-0 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    alt={project.title}
                  />
                  <div className="absolute top-6 right-6 w-12 h-12 bg-[#ecff33] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                    <ArrowUpRight size={24} className="text-black" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
                    {project.title}
                  </h3>
                  <p className="text-zinc-500 text-base leading-relaxed">
                    {project.category}
                  </p>
                  <div className="flex gap-2 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold tracking-widest border border-zinc-200 px-3 py-1.5 rounded-full text-zinc-400 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TransitionLink>
            ))}
          </div>
        </main>

        <CTA />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Page;
