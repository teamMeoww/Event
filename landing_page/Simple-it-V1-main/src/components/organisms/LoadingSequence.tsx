'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LoadingSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);

    const phrase = 'Event App GenZ';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

    // Always show on every page load / refresh

    useEffect(() => {
        if (!visible) return;

        // Lock scroll while loader is active
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = '';
                    setVisible(false);
                },
            });

            // ── 1. Text Scramble ──────────────────────────────────────────────────
            let iteration = 0;
            const scrambleInterval = setInterval(() => {
                if (!textRef.current) return;
                textRef.current.innerText = phrase
                    .split('')
                    .map((letter, index) => {
                        if (letter === ' ') return ' ';
                        if (index < iteration) return phrase[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration >= phrase.length) clearInterval(scrambleInterval);
                iteration += 1 / 1.5;
            }, 20);

            // ── 2. SVG Rings draw in (Fake Progress to 85%) ───────────────────────
            tl.to('.loader-ring', {
                strokeDashoffset: 0,
                opacity: 0.6,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
            }, 0);

            tl.fromTo('.loader-progress-bar',
                { scaleX: 0, transformOrigin: 'left center' },
                {
                    scaleX: 0.85,
                    duration: 0.8,
                    ease: 'power2.out',
                },
                0
            );

            tl.fromTo('.loader-progress-container',
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                },
                0
            );

            // ── 3. THE OUTRO (Fires strictly based on timeline) ────
            tl.to('.loader-progress-bar', { scaleX: 1, duration: 0.2, ease: 'power1.inOut' });

            tl.to(textRef.current, {
                opacity: 0,
                y: -24,
                duration: 0.3,
                ease: 'power2.in',
            }, "-=0.1");

            tl.to('.loader-progress-container', {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
            }, "<");

            tl.to('.loader-ring', {
                scale: 1.4,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.in',
                transformOrigin: 'center center',
            }, "-=0.2");

            tl.to(overlayRef.current, {
                yPercent: -100,
                duration: 0.8,
                ease: 'expo.inOut',
            }, "-=0.2");

        }, containerRef);

        return () => {
            ctx.revert();
            document.body.style.overflow = '';
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <div ref={containerRef}>
            {/* Full-screen overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
            >
                {/* Scramble text — centered in overlay */}
                <div className="relative z-10 flex flex-col items-center gap-4 px-8">
                    <h1
                        ref={textRef}
                        className="text-lg sm:text-2xl md:text-3xl font-black tracking-[0.1em] sm:tracking-[0.15em] uppercase text-white whitespace-nowrap"
                    >
                        {phrase}
                    </h1>
                    {/* Thin progress line */}
                    <div className="loader-progress-container w-32 sm:w-40 md:w-48 h-[1px] bg-zinc-800 overflow-hidden rounded-full mt-2">
                        <div
                            ref={progressRef}
                            className="loader-progress-bar h-full bg-white rounded-full"
                            style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
                        />
                    </div>
                </div>

                {/* SVG rings — pinned to bottom, half below screen = semicircle */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
                    <svg
                        className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px]"
                        viewBox="0 0 600 600"
                    >
                        {[80, 120, 170, 225, 285].map((r, i) => {
                            const circ = Math.round(2 * Math.PI * r);
                            return (
                                <circle
                                    key={i}
                                    className="loader-ring"
                                    cx="300"
                                    cy="300"
                                    r={r}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth={i === 0 ? 1.2 : 0.5}
                                    strokeDasharray={circ}
                                    strokeDashoffset={circ}
                                    style={{ opacity: 0 }}
                                />
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}
