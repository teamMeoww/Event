'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Globe, Menu, X, ArrowUpRight, Star, Smile } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Types ---
interface ScrollState {
  scrollY: number;
  direction: 'up' | 'down';
}

// --- Custom Hooks ---
const useScroll = (): ScrollState => {
  const [scroll, setScroll] = useState<ScrollState>({ scrollY: 0, direction: 'up' });
  const lastScroll = useRef(0);

  useLayoutEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const direction = currentScroll > lastScroll.current ? 'down' : 'up';
      setScroll({ scrollY: currentScroll, direction });
      lastScroll.current = currentScroll;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scroll;
};


const Marquee: React.FC<{ text: string; direction?: 'left' | 'right'; speed?: number }> = ({
  text,
  direction = 'left',
  speed = 20
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!marqueeRef.current) return;

    const marqueeContent = marqueeRef.current.querySelector('.marquee-content');
    if (!marqueeContent) return;

    const distance = direction === 'left' ? '-50%' : '0%';
    const start = direction === 'left' ? '0%' : '-50%';

    gsap.fromTo(
      marqueeContent,
      { x: start },
      { x: distance, duration: speed, ease: 'none', repeat: -1 }
    );
  }, [direction, speed]);

  return (
    <div ref={marqueeRef} className="relative flex overflow-x-hidden bg-[#FFFFF] border-y-2 border-black py-1 sm:py-2">
      <div className="marquee-content whitespace-nowrap flex gap-2 sm:gap-3 md:gap-4 items-center">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase tracking-tighter flex items-center gap-2 sm:gap-3 md:gap-4 text-black">
            {text} <Star className="fill-black w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </span>
        ))}
      </div>
    </div>
  );
};
export default Marquee;