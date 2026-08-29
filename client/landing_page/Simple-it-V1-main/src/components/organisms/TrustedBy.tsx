'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/atoms/TransitionLink';


gsap.registerPlugin(ScrollTrigger);

const StudioFullPage: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Reveal with ScrollTrigger
      gsap.from(".hero-line", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        }
      });

      // Simple fade up for the new sections
      gsap.from(".feature-block", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 80%",
        }
      });
      // 3. Pin section at the top temporarily
      ScrollTrigger.create({
        trigger: mainRef.current,
        start: "top top",
        end: "+=200", // Controls how long the section stays pinned (Lower = faster release)
        pin: true,
        anticipatePin: 1,
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="bg-[#0A0A0A] text-white pt-12 pb-8 md:pt-20 md:pb-12 w-full overflow-hidden">
      {/* SECTION 1: HERO */}
      <section className="px-4 md:px-10 max-w-screen mx-auto flex flex-col mb-12 md:mb-16 pb-10 md:pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start lg:items-end gap-10">
          <h1 className="font-black leading-[0.9] tracking-tighter uppercase w-full lg:w-[80%] pr-2">
            <div className="overflow-hidden"><div className="hero-line text-[clamp(3rem,8.5vw,8rem)]">We make</div></div>
            <div className="overflow-hidden"><div className="hero-line text-[clamp(3rem,8.5vw,8rem)] text-zinc-500">events</div></div>
            <div className="overflow-hidden"><div className="hero-line text-[clamp(3rem,8.5vw,8rem)] whitespace-nowrap">unforgettable.</div></div>
          </h1>
          <div className="overflow-hidden w-full md:w-1/3">
            <p className="hero-line text-zinc-400 text-lg md:text-2xl leading-relaxed pb-3">
              We’ve always been recognized for throwing the most exclusive hackathons, parties, and web3 summits. We’re reshaping how Gen Z connects.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: PARTNERS MARQUEE */}
      <section className="partners-section w-full border-y border-transparent py-2 md:py-6 bg-white mb-12 md:mb-40 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex overflow-hidden group">
          <div className="flex shrink-0 animate-marquee whitespace-nowrap min-w-full justify-around items-center gap-12 md:gap-24 pr-12 md:pr-24">
            {['CryptoInd', 'AI Delhi', 'Web3 Global', 'Spaze Connect', 'HackerHouse', 'DesignX'].map((logo, i) => (
              <span key={`logo1-${i}`} className="text-2xl md:text-5xl font-black text-black uppercase hover:text-zinc-500 transition-colors duration-300 cursor-default">
                {logo}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 animate-marquee whitespace-nowrap min-w-full justify-around items-center gap-12 md:gap-24 pr-12 md:pr-24" aria-hidden="true">
            {['CryptoInd', 'AI Delhi', 'Web3 Global', 'Spaze Connect', 'HackerHouse', 'DesignX'].map((logo, i) => (
              <span key={`logo2-${i}`} className="text-2xl md:text-5xl font-black text-black uppercase hover:text-zinc-500 transition-colors duration-300 cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY CHOOSE US & HOW WE ARE DIFFERENT */}
      <section className="features-section px-4 md:px-10 max-w-screen mx-auto pb-12 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">

          {/* A Human Approach */}
          <div className="feature-block flex flex-col gap-6 md:gap-8 group">
            <div className="h-[2px] w-full bg-[#ecff33] relative overflow-hidden rounded-full">
              <div className="h-full w-0 bg-white group-hover:w-full transition-all duration-1000 ease-out" />
            </div>
            <div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">The Vibe Check</h3>
              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
                We believe an event is nothing without immaculate vibes. We take time to curate the best communities, speakers, and after-parties. Every meetup is intentional. Every hackathon is considered. The result is an experience that feels authentic, hype, and built for Gen Z.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-12 mt-4 pt-8 border-t border-zinc-900">
              <div className="flex flex-col gap-2 md:gap-3">
                <h4 className="text-white text-base md:text-2xl font-medium leading-tight">Web3 Passports</h4>
                <p className="text-zinc-500 text-xs md:text-base leading-relaxed">We use decentralized identities to prove you were there. Flex your attendance stats.</p>
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <h4 className="text-white text-base md:text-2xl font-medium leading-tight">AI Matchmaking</h4>
                <p className="text-zinc-500 text-xs md:text-base leading-relaxed">No awkward networking. Our AI matches you with the exact people you need to meet.</p>
              </div>
            </div>
          </div>

          {/* Nurturing Talent */}
          <div className="feature-block flex flex-col gap-6 md:gap-8 group border-t border-zinc-900 lg:border-none pt-8 md:pt-12 lg:pt-0">
            <div className="block h-[2px] w-full bg-[#ecff33] relative overflow-hidden rounded-full">
              <div className="h-full w-0 bg-white group-hover:w-full transition-all duration-1000 ease-out" />
            </div>
            <div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">No Gatekeeping</h3>
              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
                We're more than a ticketing app; we actively invest in the community. Whether you're a 10x dev or a Web3 enthusiast, our events are designed to help you connect and grow.
                <br /><br />It’s not just about throwing parties — it’s about building a network.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 p-8 md:p-10 rounded-[2rem] mt-2 flex flex-col gap-6 hover:border-zinc-700 transition-colors duration-500 relative overflow-hidden">
              <div className="relative z-10 w-full">
                <h4 className="text-2xl md:text-3xl font-medium text-white mb-4 tracking-tight">Hacker Grants</h4>
                <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
                  We open doors for passionate devs. Get funded to build your next big idea, work alongside seasoned founders, and launch your product at our next summit.
                </p>
                <div className="flex mt-8">
                  <TransitionLink href="/incubator" className="w-[80%]">
                    <button className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full font-bold text-sm md:text-base hover:bg-[#ecff33] hover:-translate-y-1 active:scale-95 transition-all duration-300 w-full sm:w-auto group">
                      Apply for Grant
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </TransitionLink>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default StudioFullPage;