'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
    { title: 'PROXIMITY', desc: 'Each project ideally begins with a face-to-face meeting that is friendly and productive.' },
    { title: 'ADAPTABILITY', desc: 'We clearly formalize your needs in a detailed and flexible proposal, which you freely approve.' },
    { title: 'CREATIVITY', desc: 'Our team is committed to working alongside you with creativity and enthusiasm at each stage.' },
    { title: 'RESPONSIBILITY', desc: 'Short supply chains, limited printing, green hosting: we optimize resources for each project.' },
];

/*
 * Timeline anatomy (per panel slot = PS units)
 *
 *  S  = slide duration (track moves to next panel)
 *  D  = dwell duration (panel sits still, split+reveal plays)
 *  PS = S + D = one panel slot
 *
 *  Panel 0 (already centred, no incoming slide):
 *   [0 → D]: dwell  ← split+reveal happens here
 *   [D → D+S]: track slides  → panel 0 exits, panel 1 enters
 *
 *  Panel i>0:
 *   [s_i → s_i+S]: track slides (panel arrives)
 *   [s_i+S → s_i+S+D]: dwell  ← split+reveal here
 *   [s_i+S+D → s_i+PS+S]: next slide  (if not last)
 *
 *  Where s_i = D + (i-1)*(S+D) + S = i*S + i*D - S + S ... simplify:
 *  Actually: s_0 = 0, s_i = s_{i-1} + PS = i * PS  where PS = S + D
 *
 *  But panel 0 slot is [0, D+S] = PS, same as others. Consistent!
 */

const S = 0.25;   // slide duration (units of master timeline)
const D = 1.50;   // dwell duration
const PS = S + D;  // 1.75 per panel

/* Sub-animation offsets (relative to each panel's dwell start) */
const T_SPLIT_OPEN = 0.12;   // split opens
const T_CONTENT_IN = 0.30;   // content fades in
const T_CONTENT_OUT = 0.90;   // content fades out
const T_SPLIT_CLOSE = 1.10;   // split closes

const SPLIT_DUR = 0.18;
const C_DUR = 0.14;

/* ─── Panel ────────────────────────────────────────────────────────────────── */
const SplitPanel = ({ title, desc, index }: { title: string; desc: string; index: number }) => (
    <div className="oroya-panel flex-shrink-0 w-screen h-screen bg-[#fcfcfc] relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
            <div
                className="split-top text-[10vw] sm:text-[8vw] font-black uppercase leading-none tracking-tighter text-zinc-900 whitespace-nowrap"
                style={{ clipPath: 'inset(0% 0% 49% 0%)' }}
            >
                {title}
            </div>
            <div
                className="split-bottom text-[10vw] sm:text-[8vw] font-black uppercase leading-none tracking-tighter text-zinc-900 whitespace-nowrap absolute"
                style={{ clipPath: 'inset(49% 0% 0% 0%)' }}
            >
                {title}
            </div>
        </div>

        <div className="content-reveal absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6 sm:px-10" style={{ opacity: 0 }}>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-zinc-600 leading-snug max-w-xl">
                {desc}
            </p>
        </div>

        <span className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 text-[10px] lg:text-[1vw] font-bold tracking-[0.35em] text-zinc-300">
            {String(index + 1).padStart(2, '0')} / {String(PANELS.length).padStart(2, '0')}
        </span>
    </div>
);

/* ─── Main ─────────────────────────────────────────────────────────────────── */
export default function OroyaSequentialScroll() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const track = trackRef.current;
        if (!wrapper || !track) return;

        const panels = Array.from(track.querySelectorAll<HTMLElement>('.oroya-panel'));
        const n = panels.length;

        /* ─ Initial state ──────────────────────────────────────────────────────── */
        gsap.set(track, { x: 0 });
        panels.forEach(panel => {
            gsap.set(panel.querySelector('.split-top'), { yPercent: 0 });
            gsap.set(panel.querySelector('.split-bottom'), { yPercent: 0 });
            gsap.set(panel.querySelector('.content-reveal'), { opacity: 0, y: 20 });
        });

        /* ─ Total timeline length ──────────────────────────────────────────────── */
        // Panel 0: dwell D, then slide S → panel 1, ...
        // Last panel just needs its dwell.
        // Total = D + (n-1)*PS + 0.20 padding
        const totalUnits = D + (n - 1) * PS + 0.20;

        /* ─ Master timeline ────────────────────────────────────────────────────── */
        const ctx = gsap.context(() => {
            const master = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top top',
                    end: () => `+=${totalUnits * window.innerHeight * 1.2}`,
                    pin: true,
                    pinSpacing: true,
                    scrub: 2,
                    invalidateOnRefresh: true,
                },
            });

            panels.forEach((panel, i) => {
                const top = panel.querySelector('.split-top');
                const bottom = panel.querySelector('.split-bottom');
                const content = panel.querySelector('.content-reveal');

                /*  For panel 0: slot starts at 0, dwell starts at 0 (no incoming slide)
                 *  For panel i>0: slot starts at s_i = D + (i-1)*PS + S = D + i*S + (i-1)*D
                 *
                 *  Simplified: dwell-start for panel i:
                 *    panel 0 → ds = 0
                 *    panel i>0 → ds = i * PS - (PS - D) + (PS - D) = i * PS... let me recalc.
                 *
                 *  Panel 0 dwell: [0, D]
                 *  Track slide 0→1: [D, D+S]
                 *  Panel 1 dwell: [D+S, D+S+D] = [PS, PS+D]
                 *  Track slide 1→2: [PS+D, PS+D+S] = [PS+D, 2*PS]
                 *  Panel 2 dwell: [2*PS, 2*PS+D]
                 *  ...
                 *  Panel i dwell start: ds_i = i > 0 ? i * PS : 0  (where PS = S+D)
                 *  Wait…
                 *  ds_0 = 0
                 *  ds_1 = D + S = PS             ✓ (after slide 0→1)
                 *  ds_2 = D + S + D + S = 2*PS   ✓
                 *  ds_i = i * PS                 ✓
                 *
                 *  But panel 0's slot is [0, D] (no leading S), and panels i>0 have DS=[i*PS-S, i*PS].
                 *  So for the sub-animations, dwell start = i * PS for all panels (including 0 whose PS offset gives 0).
                 */

                const ds = i * PS;   // dwell start time in master timeline

                // Increase split distance on mobile (sm breakpoint is 640px)
                const isMobile = window.innerWidth < 768;
                const splitDist = isMobile ? 125 : 38;

                /* Split open */
                master.to(top, { yPercent: -splitDist, duration: SPLIT_DUR, ease: 'power2.inOut' }, ds + T_SPLIT_OPEN);
                master.to(bottom, { yPercent: splitDist, duration: SPLIT_DUR, ease: 'power2.inOut' }, ds + T_SPLIT_OPEN);

                /* Content in */
                master.to(content, { opacity: 1, y: 0, duration: C_DUR, ease: 'power2.out' }, ds + T_CONTENT_IN);

                /* Content out */
                master.to(content, { opacity: 0, y: -16, duration: C_DUR, ease: 'power2.in' }, ds + T_CONTENT_OUT);

                /* Split close */
                master.to(top, { yPercent: 0, duration: SPLIT_DUR, ease: 'power2.inOut' }, ds + T_SPLIT_CLOSE);
                master.to(bottom, { yPercent: 0, duration: SPLIT_DUR, ease: 'power2.inOut' }, ds + T_SPLIT_CLOSE);

                /* Track slide to reveal next panel  (slide starts at ds + D = ds + 1.0) */
                if (i < n - 1) {
                    master.to(track, {
                        x: -(i + 1) * window.innerWidth,
                        duration: S,
                        ease: 'power2.inOut',
                    }, ds + D);
                }
            });

        }, wrapper);

        return () => ctx.revert();
    }, []);

    return (
        <div className="bg-[#fcfcfc]">
            <div className="px-6 md:px-12 pt-16 pb-2 flex items-center gap-4">
                <div className="h-px w-10 bg-zinc-300" />
                <span className="text-xs lg:text-[1vw] font-black uppercase tracking-[0.4em] text-zinc-400">Our Approach</span>
            </div>

            {/* Pinned outer — clips the horizontal track */}
            <div ref={wrapperRef} className="overflow-hidden h-screen">
                {/* Flex track — panels side by side, only first is visible initially */}
                <div
                    ref={trackRef}
                    className="flex h-full"
                    style={{ width: `${PANELS.length * 100}vw` }}
                >
                    {PANELS.map((p, i) => (
                        <SplitPanel key={i} title={p.title} desc={p.desc} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}