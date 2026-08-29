'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Lenis with wrapper
    const lenis = new Lenis({
      duration: 2.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.55,
      // @ts-ignore
      smoothTouch: false,
      // @ts-ignore
      touchMultiplier: 1.5,
      // @ts-ignore
      infinite: false,
      wrapper: window,
      content: document.documentElement,
    });

    // Store lenis instance globally for access in other components
    (window as any).lenis = lenis;

    // Request animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger if available
    if (typeof window !== 'undefined' && (window as any).ScrollTrigger) {
      lenis.on('scroll', (window as any).ScrollTrigger.update);
      (window as any).gsap?.ticker.add((time: number) => {
        lenis.raf(time * 1000);
      });
      (window as any).gsap?.ticker.lagSmoothing(0);
    }

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  // Scroll to top on pathname change
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
