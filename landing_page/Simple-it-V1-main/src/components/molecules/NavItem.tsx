'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import TransitionLink from '@/components/atoms/TransitionLink';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/project', label: 'Works' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

const NavItem = () => {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<any>(null);
  const [gsapLoaded, setGsapLoaded] = useState(true);

  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let hideTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;

      clearTimeout(hideTimeout);

      if (currentScrollY <= 80) {
        setShowNav(true);
        lastScrollY = currentScrollY;
      } else {
        if (diff > 5) {
          setShowNav(false);
          lastScrollY = currentScrollY;
        } else if (diff < -5) {
          setShowNav(true);
          lastScrollY = currentScrollY;
        }

        hideTimeout = setTimeout(() => {
          if (window.scrollY > 80) {
            setShowNav(false);
          }
        }, 2500);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(hideTimeout);
    };
  }, []);

  // Lock scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // GSAP animation for mobile drawer to avoid Tailwind transition clashes
  useEffect(() => {
    if (!gsapLoaded || !window.gsap || !drawerRef.current) return;
    const gsap = window.gsap;

    gsap.set(drawerRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      pointerEvents: "none"
    });

    tlRef.current = gsap.timeline({ paused: true });

    tlRef.current.to(drawerRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.7,
      ease: "power4.inOut"
    })
      .fromTo(".mobile-menu-item",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(".mobile-menu-footer",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        "-=0.3"
      );

    return () => {
      tlRef.current?.kill();
    };
  }, [gsapLoaded]);

  useEffect(() => {
    if (!tlRef.current) return;
    const gsap = window.gsap;

    if (open) {
      gsap?.set(drawerRef.current, { pointerEvents: "auto" });
      tlRef.current.play();
    } else {
      tlRef.current.reverse().then(() => {
        gsap?.set(drawerRef.current, { pointerEvents: "none" });
      });
      // Fallback
      setTimeout(() => {
        if (!open && drawerRef.current) {
          gsap?.set(drawerRef.current, { pointerEvents: "none" });
        }
      }, 1000);
    }
  }, [open]);

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <nav ref={navRef} className={`fixed left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-6 md:py-8 mix-blend-difference text-white transition-[top] duration-300 ease-out ${showNav ? 'top-0' : '-top-[150px]'}`}>
        {/* Logo */}
        <div className="text-xl md:text-2xl font-black tracking-tighter italic">Event App GenZ.</div>

        {/* Desktop links */}
        <div className="hidden lg:flex gap-10 xl:gap-12 text-[10px] font-bold uppercase tracking-[0.2em]">
          {NAV_LINKS.map(l => (
            <TransitionLink key={l.href} href={l.href} className="hover:opacity-40 transition-opacity">
              {l.label}
            </TransitionLink>
          ))}
        </div>

        {/* Right side — always visible */}
        <div className="flex items-center gap-4 md:gap-6">
          <TransitionLink
            href="/book"
            className="bg-white text-black px-3 sm:px-5 md:px-8 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center whitespace-nowrap"
          >
            Let's Talk!
          </TransitionLink>

          {/* Hamburger — visible on < lg */}
          <button
            className="lg:hidden flex items-center gap-2 group cursor-pointer"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className="text-[9px] font-bold uppercase hidden sm:block">menu</span>
            <div className="w-5 h-5 flex flex-col justify-center gap-[5px]">
              <div className="h-[2px] w-full bg-white rounded-full" />
              <div className="h-[2px] w-1/2 bg-white rounded-full self-end" />
            </div>
          </button>


        </div>
      </nav>

      {/* ── Mobile fullscreen drawer ─────────────────────────────────────────── */}
      <div
        ref={drawerRef}
        className="fixed inset-0 z-[60] bg-[#050505] flex flex-col justify-between px-6 sm:px-10 pt-8 sm:pt-12 pb-10 sm:pb-14"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          pointerEvents: "none"
        }}
      >
        {/* Top row */}
        <div className="flex justify-between items-center mobile-menu-footer opacity-0 mt-6 md:mt-0">
          <span className="text-white text-xl sm:text-2xl font-black tracking-tighter italic">Event App GenZ.</span>
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-zinc-700/50 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors bg-white/5 backdrop-blur-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-4 sm:gap-6 mt-8 sm:mt-12 flex-1 justify-center">
          {NAV_LINKS.map((l, i) => (
            <TransitionLink
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="mobile-menu-item group flex items-end justify-between border-b border-zinc-800/50 pb-4 sm:pb-6 opacity-0"
            >
              <span className="text-[2.5rem] sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-[#eaeaea] group-hover:text-[#ecff33] transition-colors duration-300">
                {l.label}
              </span>
              <span className="text-zinc-500 text-xs sm:text-sm font-bold tracking-widest mb-2 sm:mb-3">
                0{i + 1}
              </span>
            </TransitionLink>
          ))}
        </nav>

        {/* Bottom row */}
        <div className="flex items-center justify-between mobile-menu-footer opacity-0 mt-8">
          <TransitionLink href="/book" onClick={() => setOpen(false)}>
            <span className="inline-flex items-center justify-center bg-[#ecff33] text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform">
              Let's Talk!
            </span>
          </TransitionLink>
          <div className="flex flex-col items-end gap-1">
            <span className="text-zinc-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
              Socials
            </span>
            <div className="flex gap-3 mt-1">
              <a href="#" className="text-white text-xs hover:text-[#ecff33] transition-colors">TW</a>
              <a href="#" className="text-white text-xs hover:text-[#ecff33] transition-colors">IN</a>
              <a href="#" className="text-white text-xs hover:text-[#ecff33] transition-colors">IG</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavItem;
