'use client';

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';

const CustomScrollbar: React.FC = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap) {
            setGsapLoaded(true);
        } else {
            const checkGsap = setInterval(() => {
                if (window.gsap) {
                    setGsapLoaded(true);
                    clearInterval(checkGsap);
                }
            }, 100);
            return () => clearInterval(checkGsap);
        }
    }, []);

    useLayoutEffect(() => {
        if (!gsapLoaded || !window.gsap) return;

        const gsap = window.gsap;

        const updateScroll = () => {
            if (!thumbRef.current || !trackRef.current) return;

            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

            const trackHeight = trackRef.current.clientHeight;
            const thumbHeight = thumbRef.current.clientHeight;
            const maxMove = trackHeight - thumbHeight;

            gsap.to(thumbRef.current, {
                y: progress * maxMove,
                duration: 0.15,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        window.addEventListener('scroll', updateScroll, { passive: true });
        window.addEventListener('resize', updateScroll);

        // Setup MutationObserver to watch for body height changes (like accordions / expansions)
        const observer = new MutationObserver(updateScroll);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });

        // Initial call
        updateScroll();

        return () => {
            window.removeEventListener('scroll', updateScroll);
            window.removeEventListener('resize', updateScroll);
            observer.disconnect();
        };
    }, [gsapLoaded]);

    return (
        <div className="fixed top-1/2 right-2 md:right-4 -translate-y-1/2 z-[9999] h-[35vh] min-h-[200px] flex justify-center w-6 mix-blend-difference pointer-events-none hidden sm:flex">
            {/* The Track Line - Very thin line */}
            <div ref={trackRef} className="absolute top-0 bottom-0 w-[1px] bg-white opacity-40"></div>

            {/* The Thumb - Pill shape */}
            <div
                ref={thumbRef}
                className="absolute top-0 w-2 h-16 bg-white rounded-full"
            ></div>
        </div>
    );
};

export default CustomScrollbar;
