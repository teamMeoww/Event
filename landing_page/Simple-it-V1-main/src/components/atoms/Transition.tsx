'use client';

import { useEffect, useRef } from 'react';
import { useTransition } from '@/contexts/TransitionContext';
import gsap from 'gsap';

export default function Transition({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLHeadingElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const { isTransitioning, targetLabel, completeTransition } = useTransition();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!overlayRef.current || !labelRef.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const overlay = overlayRef.current;
    const label = labelRef.current;
    const progress = progressRef.current;

    const isMobile = window.innerWidth < 768;

    // Handle incoming transition (page leaving)
    if (isTransitioning) {
      const tl = gsap.timeline();

      tl.set(overlay, { display: 'flex', yPercent: -100 })
        .set(label, { opacity: 0, y: 28, skewX: 8 })
        .set(progress, { scaleX: 0, transformOrigin: 'left center', opacity: 1 })

        .to(overlay, { yPercent: 0, duration: 0.5, ease: 'expo.inOut' })

        .addLabel("startLoad")
        .to(label, { opacity: 1, y: 0, skewX: 0, duration: 0.25, ease: 'power3.out' }, "startLoad-=0.1")
        .to(progress, { scaleX: 0.85, duration: 0.8, ease: 'power2.out' }, "startLoad-=0.1");
    }
    // Handle outgoing transition (new page is loaded and ready)
    else {
      // Small timeout to allow the new page's JS to initialize completely
      setTimeout(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            // Reset state entirely only after fully animated out
            if (targetLabel !== '') completeTransition();
          }
        });

        tl.to(progress, { scaleX: 1, duration: 0.25, ease: 'power1.inOut' })
          .to(label, { opacity: 0, y: -20, skewX: -6, duration: 0.2, ease: 'power2.in' }, "<0.1")
          .to(progress, { opacity: 0, duration: 0.2, ease: 'power1.in' }, "<")

          .to(overlay, { yPercent: -100, duration: 0.5, ease: 'expo.inOut' }, "-=0.1")

          .set(overlay, { display: 'none' });

      }, 100);
    }

    return () => gsap.killTweensOf([overlay, label, progress]);
  }, [isTransitioning, completeTransition, targetLabel]);

  return (
    <>
      {/* Curtain overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] hidden flex-col items-center justify-center bg-[#0a0a0a]"
        style={{ willChange: 'transform' }}
      >
        <div className="relative z-10 flex flex-col items-center">
          {/* Page label */}
          <h2
            ref={labelRef}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-[0.08em] sm:tracking-[0.1em] whitespace-nowrap text-white opacity-0 mb-5"
          >
            {targetLabel}
          </h2>

          {/* Progress bar */}
          <div className="w-32 sm:w-40 md:w-48 h-[1px] bg-zinc-800 overflow-hidden rounded-full">
            <div
              ref={progressRef}
              className="h-full bg-white rounded-full"
              style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
            />
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
