'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { LucideMousePointer2 } from 'lucide-react';

interface ExpansionSpacerProps {
    gsapLoaded: boolean;
}

const ExpansionSpacer: React.FC<ExpansionSpacerProps> = ({ gsapLoaded }) => {
    const uiSectionRef = useRef<HTMLElement>(null);
    const uiMainImgRef = useRef<HTMLDivElement>(null);
    const uiCursorRefs = useRef<(HTMLDivElement | null)[]>([]);
    const uiLabelRef = useRef<HTMLDivElement>(null);

    // Collaboration Text Refs
    const textTopRef = useRef<HTMLDivElement>(null);
    const textBottomRef = useRef<HTMLDivElement>(null);
    const textLeftRef = useRef<HTMLDivElement>(null);
    const textRightRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!gsapLoaded || !window.gsap) return;
        if (typeof window === 'undefined') return;

        const gsap = window.gsap;

        const ctx = gsap.context(() => {
            let mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                // Set initial states
                gsap.set(uiMainImgRef.current, {
                    scale: 0.5,
                    borderRadius: "200px"
                });

                gsap.set(uiCursorRefs.current, {
                    opacity: 0,
                    x: -100,
                    y: 100
                });

                gsap.set(uiLabelRef.current, {
                    opacity: 0,
                    y: 20
                });

                // Set text initial states
                gsap.set(textTopRef.current, { xPercent: -50, yPercent: -50, y: "-25vh", opacity: 1 });
                gsap.set(textBottomRef.current, { xPercent: -50, yPercent: -50, y: "25vh", opacity: 1 });
                gsap.set(textLeftRef.current, { xPercent: -50, yPercent: -50, x: "-28vw", rotation: -90, opacity: 1 });
                gsap.set(textRightRef.current, { xPercent: -50, yPercent: -50, x: "28vw", rotation: 90, opacity: 1 });

                // Create timeline
                const uiTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: uiSectionRef.current,
                        start: "top top",
                        end: "+=150%",
                        pin: true,
                        scrub: 2,
                        anticipatePin: 1,
                        onUpdate: (self: any) => {
                            // When scroll animation reaches the end (progress = 1)
                            if (self.progress === 1 && !self.hasTriggeredPointers) {
                                self.hasTriggeredPointers = true;

                                // Start random pointer movements
                                uiCursorRefs.current.forEach((cursor, idx) => {
                                    if (!cursor) return;
                                    const randomMove = () => {
                                        const randomX = gsap.utils.random(-80, 80);
                                        const randomY = gsap.utils.random(-60, 60);
                                        const randomDuration = gsap.utils.random(2.5, 4.5);

                                        gsap.to(cursor, {
                                            x: randomX,
                                            y: randomY,
                                            duration: randomDuration,
                                            ease: "power2.out",
                                            onComplete: randomMove
                                        });
                                    };
                                    // Stagger the start of each cursor's movement
                                    gsap.delayedCall(idx * 0.2, randomMove);
                                });
                            }
                        }
                    }
                });

                // Add animations
                uiTimeline
                    .to(uiMainImgRef.current, {
                        scale: 1,
                        borderRadius: "40px",
                        duration: 2,
                        ease: "power2.inOut"
                    }, "0")
                    .to(textTopRef.current, { y: "-50vh", opacity: 0, duration: 2, ease: "power2.inOut" }, "0")
                    .to(textBottomRef.current, { y: "50vh", opacity: 0, duration: 2, ease: "power2.inOut" }, "0")
                    .to(textLeftRef.current, { x: "-50vw", opacity: 0, duration: 2, ease: "power2.inOut" }, "0")
                    .to(textRightRef.current, { x: "50vw", opacity: 0, duration: 2, ease: "power2.inOut" }, "0")
                    .to(uiCursorRefs.current, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        stagger: 0.2,
                        duration: 1,
                        ease: "power2.out"
                    }, "-=1")
                    .to(uiLabelRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out"
                    }, "-=0.5")
                    .call(() => {
                        // Start random pointer movements after animation completes
                        uiCursorRefs.current.forEach((cursor, idx) => {
                            if (!cursor) return;
                            const randomMove = () => {
                                const randomX = gsap.utils.random(-80, 80);
                                const randomY = gsap.utils.random(-60, 60);
                                const randomDuration = gsap.utils.random(2.5, 4.5);

                                gsap.to(cursor, {
                                    x: randomX,
                                    y: randomY,
                                    duration: randomDuration,
                                    ease: "power2.out",
                                    onComplete: randomMove
                                });
                            };
                            // Stagger the start of each cursor's movement
                            gsap.delayedCall(idx * 0.2, randomMove);
                        });
                    });
            });
        }, uiSectionRef);

        return () => ctx.revert();
    }, [gsapLoaded]);

    return (
        <section ref={uiSectionRef} className="hidden md:flex h-screen bg-[#fcfcfc] relative flex-col items-center justify-center overflow-hidden">
            {/* Collaborative Text Lines */}
            <div ref={textTopRef} className="absolute top-1/2 left-1/2 text-black font-bold uppercase tracking-[0.3em] text-sm md:text-lg whitespace-nowrap z-0">
                End-to-End Continuous Collaboration
            </div>
            <div ref={textBottomRef} className="absolute top-1/2 left-1/2 text-black font-bold uppercase tracking-[0.3em] text-sm md:text-lg whitespace-nowrap z-0">
                Frictionless Feedback Loops
            </div>


            <div ref={uiMainImgRef} className="w-[90vw] h-[80vh] bg-[#121212] shadow-2xl relative z-10 overflow-hidden flex items-center justify-center">
                {/* Dashboard UI Mock */}
                <div className="w-full h-full p-12 flex flex-col gap-8 opacity-80">
                    <div className="flex gap-4">
                        <div className="w-32 h-3 bg-white/10 rounded-full" />
                        <div className="w-20 h-3 bg-white/10 rounded-full ml-auto" />
                    </div>
                    <div className="grid grid-cols-4 gap-8 flex-1">
                        <div className="col-span-1 bg-white/5 rounded-2xl p-6 flex flex-col gap-4">
                            <div className="w-full h-24 bg-purple-500/20 rounded-xl" />
                            <div className="w-full h-3 bg-white/10 rounded-full" />
                            <div className="w-2/3 h-3 bg-white/10 rounded-full" />
                        </div>
                        <div className="col-span-2 bg-white/5 rounded-2xl p-6 relative">
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=2000')] bg-cover opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-4xl">Today Tasks</span>
                            </div>
                        </div>
                        <div className="col-span-1 bg-white/5 rounded-2xl p-6 flex flex-col justify-end">
                            <div className="w-full h-3 bg-zinc-500/30 rounded-full" />
                        </div>
                    </div>
                </div>
                {/* Floating Elements */}
                <div ref={(el) => { uiCursorRefs.current[0] = el; }} className="absolute top-1/4 left-1/4 z-30 flex items-center gap-2 bg-zinc-800 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg border border-[#ecff33]/50">
                    <LucideMousePointer2 size={12} fill="white" /> Matthew
                </div>
                <div ref={(el) => { uiCursorRefs.current[1] = el; }} className="absolute bottom-1/3 right-1/4 z-30 flex items-center gap-2 bg-zinc-800 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg border border-[#ecff33]/80">
                    <LucideMousePointer2 size={12} fill="white" /> Kristin
                </div>
                <div ref={(el) => { uiCursorRefs.current[2] = el; }} className="absolute top-1/2 right-1/3 z-30 flex items-center gap-2 bg-zinc-800 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg border border-[#ecff33]/30">
                    <LucideMousePointer2 size={12} fill="white" /> Sarah
                </div>
            </div>
            <div ref={uiLabelRef} className="absolute bottom-5 bg-white border border-black/5 px-10 py-4 rounded-full z-40 text-xs font-bold uppercase tracking-widest">
                Holistic UI Designs
            </div>
        </section>
    );
};

export default ExpansionSpacer;
