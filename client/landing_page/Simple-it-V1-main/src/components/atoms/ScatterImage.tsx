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

const ScatterImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  initialRotate?: number;
}> = ({ src, alt, className = '', speed = 1, initialRotate = 0 }) => {
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { scale: 0, rotation: initialRotate - 45, opacity: 0 },
      { scale: 1, rotation: initialRotate, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)', delay: Math.random() * 0.5 }
    );

    gsap.to(imageRef.current, {
      y: -200 * speed,
      rotation: initialRotate + 15,
      scrollTrigger: {
        trigger: imageRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });

    const element = imageRef.current;
    const onMouseEnter = () => gsap.to(element, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    const onMouseLeave = () => gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' });

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [speed, initialRotate]);

  return (
    <div ref={imageRef} className={`absolute shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-white p-1 sm:p-1.5 md:p-2 will-change-transform ${className}`}>
      <img src={src} alt={alt} className="object-cover w-full h-full hover:grayscale-0 transition-all duration-500" />
    </div>
  );
};
export default ScatterImage;