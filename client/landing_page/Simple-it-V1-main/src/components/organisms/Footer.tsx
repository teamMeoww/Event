"use client";

import { useLayoutEffect, useRef } from "react";
import { Plus } from "lucide-react";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    let ctx: any;
    let timer: NodeJS.Timeout;

    // Function to initialize animations
    const initAnimations = () => {
      // Check if footer section exists in DOM
      if (!footerRef.current) return;

      // Use GSAP from window (CDN) or import
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;

      if (!gsap || !ScrollTrigger) return;

      ctx = gsap.context(() => {
        // Set initial CSS properties for performance
        gsap.set(".footer-marquee", {
          willChange: "transform"
        });

        gsap.set(".footer-section a", {
          position: "relative"
        });

        gsap.set(".footer-heading-line span", {
          display: "inline-block",
          willChange: "transform, opacity"
        });

        // FOOTER ANIMATIONS
        // Cities Text Reveal
        gsap.from(".footer-heading-line span", {
          y: 100,
          opacity: 0,
          stagger: 0.2,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            toggleActions: "play none none reverse"
          }
        });

        // Footer Links Stagger
        gsap.from(".footer-link-group", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });

        // Giant Marquee Scroll
        gsap.to(".footer-marquee", {
          xPercent: -20,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });

        // Grid Plus Signs Animation
        gsap.from(".grid-plus", {
          opacity: 0,
          scale: 0,
          stagger: {
            amount: 1,
            grid: "auto",
            from: "center"
          },
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        });

        // Refresh ScrollTrigger
        ScrollTrigger.refresh();
      });
    };

    // Delay to ensure DOM is ready and GSAP is available
    timer = setTimeout(() => {
      initAnimations();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <>
      {/* FOOTER SECTION: Exactly as per Screencast */}
      <section ref={footerRef} className="footer-section border-t-2 bg-black rounded-2xl sm:rounded-3xl text-white pt-10 sm:pt-16 md:pt-20 relative overflow-hidden">
        {/* Dynamic Plus Grid */}
        <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 pointer-events-none p-4 sm:p-10 gap-6 sm:gap-10 opacity-20">
          {[...Array(108)].map((_, i) => (
            <div key={i} className="flex justify-center items-center">
              <Plus className="grid-plus w-3 h-3 sm:w-4 sm:h-4 text-zinc-500" />
            </div>
          ))}
        </div>

        <div className="container max-w-full px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 sm:gap-12 md:gap-0">
            {/* Left: Contact Info */}
            <div className="space-y-8 sm:space-y-12 max-w-full">
              {/* Heading with Reveal Animation */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none overflow-hidden">
                <div className="footer-heading-line h-fit overflow-hidden py-0.5 sm:py-1"><span className="block">4 Cities,</span></div>
                <div className="footer-heading-line h-fit overflow-hidden py-0.5 sm:py-1"><span className="block">2 Studios,</span></div>
                <div className="footer-heading-line h-fit overflow-hidden py-0.5 sm:py-1"><span className="block">1 DEL HQ.</span></div>
              </h2>
            </div>

            {/* Right: Links */}
            <div className="ml-auto max-w-full">
              <div className="grid grid-cols-2 gap-4 sm:gap-8 md:gap-12 text-[10px] sm:text-xs md:text-sm tracking-widest uppercase font-bold text-zinc-400">
                <div className="footer-link-group space-y-4 sm:space-y-6">
                  <p className="text-white">Explore a new project</p>
                  <a href="#" className="block hover:text-white transition-colors underline decoration-zinc-700 underline-offset-8 break-all sm:break-normal">hello@eventappgenz.xyz</a>

                  <div className="pt-4 sm:pt-6">
                    <p className="text-white">Want to work with us?</p>
                    <a href="#" className="block hover:text-white transition-colors underline decoration-zinc-700 underline-offset-8">Explore Careers</a>
                  </div>
                </div>

                <div className="footer-link-group space-y-4 sm:space-y-6">
                  <p className="text-white">Get insights that matter</p>
                  <a href="#" className="block hover:text-white transition-colors underline decoration-zinc-700 underline-offset-8">Subscribe to our newsletter</a>

                  <div className="pt-4 sm:pt-6">
                    <p className="text-white">Legal</p>
                    <a href="#" className="block hover:text-white transition-colors underline decoration-zinc-700 underline-offset-8">Privacy Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Row */}
          <div className="footer-link-group mt-8 sm:mt-12 md:mt-20 flex flex-wrap gap-4 sm:gap-6 md:gap-10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">X</a>
          </div>
        </div>

        {/* The Massive "NewWorld" Marquee */}
        <div className="footer-marquee-container mt-10 sm:mt-16 md:mt-30 select-none pointer-events-none">
          <div className="footer-marquee flex whitespace-nowrap tracking-tighter leading-[0.7]">
            <span className="text-[12vw] sm:text-[15vw] md:text-[22vw] font-black pr-4 sm:pr-12 md:pr-20 text-white/5">Si. STUDIO</span>
            <span className="text-[12vw] sm:text-[15vw] md:text-[22vw] font-black pr-4 sm:pr-12 md:pr-20 text-white/5">Si. STUDIO</span>
            <span className="text-[12vw] sm:text-[15vw] md:text-[22vw] font-black pr-4 sm:pr-12 md:pr-20 text-white/5">Si. STUDIO</span>
          </div>
        </div>
      </section>
    </>
  );
}
