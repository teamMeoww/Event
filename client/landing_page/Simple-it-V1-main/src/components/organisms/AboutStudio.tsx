'use client';

import React, { useLayoutEffect, useRef } from 'react';

interface AboutStudioProps {
    gsapLoaded: boolean;
}

const AboutStudio: React.FC<AboutStudioProps> = ({ gsapLoaded }) => {
    const studioSectionRef = useRef<HTMLElement>(null);
    const studioPhoneRef = useRef<HTMLDivElement>(null);
    const studioTitleRef = useRef<HTMLDivElement>(null);
    const studioAvatarsRef = useRef<(HTMLDivElement | null)[]>([]);

    const card1Ref = useRef<HTMLDivElement>(null);
    const card2Ref = useRef<HTMLDivElement>(null);
    const card3Ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!gsapLoaded || !window.gsap) return;
        if (typeof window === 'undefined') return;

        const gsap = window.gsap;

        const ctx = gsap.context(() => {
            let mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                if (studioSectionRef.current) {
                    // Initial state
                    gsap.set(studioTitleRef.current, { opacity: 0, x: 40 });
                    gsap.set(studioPhoneRef.current, { opacity: 0, y: 150, scale: 0.9, rotation: 2 });
                    gsap.set([card1Ref.current, card2Ref.current, card3Ref.current], {
                        opacity: 0, scale: 0.5, x: 0, y: 0
                    });
                    gsap.set(studioAvatarsRef.current, { opacity: 0, scale: 0, x: -20 });

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: studioSectionRef.current,
                            start: "top top",
                            end: "+=250%",
                            pin: true,
                            scrub: 1.2,
                            anticipatePin: 1
                        }
                    });

                    // 1. Emerge phone & text
                    tl.to(studioPhoneRef.current, { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1, ease: "power2.out" })
                        .to(studioTitleRef.current, { opacity: 1, x: 0, duration: 1, ease: "power2.out" }, "<0.2")

                        // 2. Fan out floating UI cards from behind the phone
                        .to([card1Ref.current, card2Ref.current, card3Ref.current], { opacity: 1, duration: 0.1 })
                        .to(card1Ref.current, {
                            x: -160, y: -200, rotation: -12, scale: 1, duration: 1.5, ease: "power3.out"
                        }, "<")
                        .to(card2Ref.current, {
                            x: 230, y: -100, rotation: 15, scale: 1, duration: 1.5, ease: "power3.out"
                        }, "<")
                        .to(card3Ref.current, {
                            x: -180, y: 150, rotation: -8, scale: 1, duration: 1.5, ease: "power3.out"
                        }, "<")

                        // 3. Avatars pop in
                        .to(studioAvatarsRef.current, {
                            opacity: 1, scale: 1, x: 0, duration: 1, stagger: 0.1, ease: "back.out(2)"
                        }, "-=1.2");
                }
            });

            mm.add("(max-width: 767px)", () => {
                if (studioSectionRef.current) {
                    gsap.set(studioTitleRef.current, { opacity: 0, y: 20 });
                    gsap.set(studioPhoneRef.current, { opacity: 0, scale: 0.95 });
                    gsap.set(studioAvatarsRef.current, { opacity: 0, y: 20 });

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: studioSectionRef.current,
                            start: "top 75%",
                        }
                    });

                    tl.to(studioTitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
                        .to(studioPhoneRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "-=0.4")
                        .to(studioAvatarsRef.current, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.4");
                }
            });
        }, studioSectionRef);

        return () => ctx.revert();
    }, [gsapLoaded]);

    return (
        <section ref={studioSectionRef} className="text-black bg-[#fcfcfc] w-full h-auto min-h-screen md:h-screen pt-12 pb-24 md:py-0 relative flex items-center justify-center px-4 md:px-0 overflow-hidden z-20">

            {/* 3-Column Grid Container */}
            <div className="w-full max-w-screen h-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 relative z-10 px-6 xl:px-12">

                {/* 1. Left Text Block (Title) */}
                <div ref={studioTitleRef} className="w-full md:w-[30%] flex flex-col justify-center items-start md:items-end text-left md:text-right order-2 md:order-1 relative z-20">
                    <div className="max-w-[380px] lg:max-w-[500px]">
                        <h2 className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl xl:text-7xl font-black tracking-tight text-black leading-[1.05] mb-2">
                            Our studio is a safe space where
                        </h2>
                        <h2 className="text-4xl text-zinc-500 sm:text-5xl md:text-4xl text-zinc-500 lg:text-6xl xl:text-7xl text-zinc-500 font-black tracking-tight leading-[1.05]">
                            startups grow <br /> and <span >shine.</span>
                        </h2>
                    </div>
                </div>

                {/* 2. Center Phone Block */}
                <div className="w-full md:w-[40%] flex items-center justify-center relative h-[60vh] md:h-full order-1 md:order-2 z-10">

                    {/* Floating Decorative Cards */}
                    <div ref={card1Ref} className="absolute z-0 w-40 h-28 bg-white rounded-2xl shadow-xl border border-zinc-200 p-4 flex flex-col gap-3 left-1/2 top-1/2 -ml-20 -mt-14 hidden md:flex">
                        <div className="w-full h-2 bg-zinc-100 rounded-full" />
                        <div className="w-3/4 h-2 bg-zinc-100 rounded-full" />
                        <div className="mt-auto w-full h-6 bg-zinc-200 rounded-lg border border-zinc-300" />
                    </div>

                    <div ref={card2Ref} className="absolute z-0 w-48 h-32 bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-800 p-4 flex flex-col gap-3 left-1/2 top-1/2 -ml-24 -mt-16 hidden md:flex">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                                <span className="w-3 h-3 rounded-full bg-[#ecff33]" />
                            </div>
                            <div className="w-16 h-3 bg-zinc-800 rounded-full" />
                        </div>
                        <div className="w-full h-full bg-zinc-800 rounded-xl" />
                    </div>

                    <div ref={card3Ref} className="absolute z-0 w-32 h-32 bg-white rounded-2xl shadow-xl border border-zinc-200 p-4 flex flex-col justify-between left-1/2 top-1/2 -ml-16 -mt-16 hidden md:flex">
                        <div className="w-6 h-6 rounded-full bg-zinc-800" />
                        <div className="flex flex-col gap-2">
                            <div className="w-full h-1.5 bg-zinc-100 rounded-full" />
                            <div className="w-2/3 h-1.5 bg-zinc-100 rounded-full" />
                        </div>
                    </div>

                    {/* Android Phone Frame */}
                    <div ref={studioPhoneRef} className="relative bg-black rounded-[3rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10 mx-auto w-[240px] sm:w-[280px]">
                        {/* Phone Screen */}
                        <div className="bg-white rounded-[2.5rem] overflow-hidden w-full h-[480px] sm:h-[560px] relative">
                            {/* Top Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black rounded-b-xl w-32 h-5 z-10 flex items-center justify-center gap-2">
                                <div className="w-10 h-1 bg-gray-800 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                            </div>
                            {/* Image Content - Light Mode Mockup */}
                            <div className="w-full h-full bg-zinc-50 p-4 flex flex-col gap-4">
                                <div className="flex justify-between items-center pt-2">
                                    <div className="w-12 h-2.5 bg-zinc-200 rounded animate-pulse"></div>
                                    <div className="flex gap-1">
                                        <div className="w-2.5 h-2.5 bg-zinc-200 rounded animate-pulse"></div>
                                        <div className="w-2.5 h-2.5 bg-zinc-200 rounded animate-pulse"></div>
                                        <div className="w-5 h-2.5 bg-zinc-200 rounded animate-pulse"></div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="w-24 h-5 bg-zinc-200 rounded-lg animate-pulse mb-2"></div>
                                    <div className="w-36 h-3 bg-zinc-100 rounded animate-pulse"></div>
                                </div>

                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-zinc-100 flex gap-3" style={{ animationDelay: `${i * 0.1}s` }}>
                                        <div className="w-12 h-12 bg-zinc-100 rounded-xl animate-pulse"></div>
                                        <div className="flex-1 flex flex-col gap-2 justify-center">
                                            <div className="w-3/4 h-2.5 bg-zinc-200 rounded animate-pulse"></div>
                                            <div className="w-1/2 h-2 bg-zinc-100 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-auto bg-white rounded-t-2xl p-3 flex justify-around items-center shadow-md border-t border-zinc-100">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className={`w-6 h-6 ${i === 1 ? 'bg-zinc-800' : 'bg-zinc-200'} rounded-full animate-pulse`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Right Text Block (Subtext & Avatars) */}
                <div className="w-full md:w-[30%] flex flex-col justify-center items-start md:items-end text-left md:text-right order-3 z-20">
                    <div className="max-w-[380px] lg:max-w-[500px]">
                        <p className="text-xl md:text-2xl text-black font-medium leading-relaxed mb-8">
                            We believe that the best digital experiences are born from true collaboration. Our multi-disciplinary team works in absolute synchrony to transform complex challenges into elegant products.
                        </p>
                        <div className="flex flex-col items-start md:items-end justify-start gap-4">
                            <span className="text-sm md:text-base font-bold uppercase tracking-widest text-black">Core Disciplines</span>
                            <div className="flex flex-wrap justify-start md:justify-end gap-3 w-full max-w-[320px] md:max-w-none">
                                {['Creative Strategy', 'Product Design', 'Full-Stack Dev', 'Cloud Architecture'].map((discipline, i) => (
                                    <div key={i} ref={el => { studioAvatarsRef.current[i] = el; }} className="px-5 py-2.5 rounded-full border border-zinc-200 bg-white text-black font-bold text-xs md:text-sm shadow-sm hover:border-black hover:bg-black hover:text-[#ecff33] transition-colors cursor-pointer">
                                        {discipline}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutStudio;
