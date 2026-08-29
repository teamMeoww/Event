'use client'

import React, { useLayoutEffect, useRef, useState } from 'react';
import NavItem from '../molecules/NavItem';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
}

const EBAgencyClone: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gsapLoaded, setGsapLoaded] = useState(true);

  useLayoutEffect(() => {
    if (!gsapLoaded || !window.gsap) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Entrance
      gsap.from(".hero-line", {
        y: 120,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
      });

      // 1b. Hero Subtext Fade In
      gsap.from(".hero-subtext", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      });

      // 2. Scroll Badge Entrance - Slide up from bottom
      gsap.fromTo(".scroll-badge-container",
        {
          y: 150,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.8,
          ease: "power3.out",
        }
      );

      // 3. Rotating Scroll Badge
      gsap.to(".scroll-badge", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "linear",
      });

      // 4. Hero Section Native Pin
      // By using pinSpacing: false, we allow the next sections to slide OVER the hero smoothly like a curtain
      const heroSection = containerRef.current;

      if (heroSection) {
        ScrollTrigger.create({
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
        });
      }

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [gsapLoaded]);

  return (
    <>
      <NavItem />
      <div ref={containerRef} className="bg-[#f8f8f8] text-[#1a1a1a] font-sans selection:bg-purple-200 relative">
        {/* Main Hero Text */}
        <section className="hero-section h-screen flex justify-center items-center px-4 sm:px-6 md:px-10 relative overflow-hidden">
          <div className="max-w-6xl w-full flex flex-col justify-center">
            <h1 className="text-[clamp(2.5rem,9.2vw,12rem)] font-medium flex flex-col leading-tight tracking-tighter mb-3">
              <div className="overflow-hidden h-[1.1em] flex  justify-center"><span className="hero-line inline-block">Event</span></div>
              <div className="overflow-hidden h-[1.1em] flex justify-center"><span className="hero-line inline-block text-gray-300">—App—</span></div>
              <div className="overflow-hidden h-[1.1em] flex justify-center"><span className="hero-line inline-block">GenZ.</span></div>
            </h1>
            <div className="flex justify-center  ">
              <div className="hero-subtext text-[12px] font-bold text-gray-400 uppercase tracking-[0.05em] leading-loose max-w-xs text-center">
                WEB3 TICKETING / VERIFIED REPUTATION / IRL HANGOUTS / PASSPORT CREDENTIALS / AI MATCHMAKING
              </div>
            </div>
          </div>

          {/* Scroll Badge positioned absolute bottom-center, clipped in half */}
          <div className="absolute -bottom-[4rem] md:-bottom-[5.5rem] left-1/2 -translate-x-1/2 z-10 flex justify-center">
            <div className="scroll-badge-container relative w-32 h-32 md:w-44 md:h-44">
              <svg className="scroll-badge w-full h-full" viewBox="0 0 100 100">
                <path id="heroBadge" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                <text className="text-[7.5px] font-black uppercase tracking-[0.3em] fill-gray-900">
                  <textPath xlinkHref="#heroBadge">SCROLL TO SECURE THE BAG • SCROLL TO SECURE THE BAG •</textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                <div className="w-[1px] h-10 md:h-12 bg-black" />
                <div className="w-1.5 h-1.5 rounded-full bg-black mt-2" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EBAgencyClone;