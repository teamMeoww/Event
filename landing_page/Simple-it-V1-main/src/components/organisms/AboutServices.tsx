'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { Fingerprint, MonitorSmartphone, Target, Layers, Sparkles } from 'lucide-react';

interface Service {
    title: string;
    desc: string;
    height: string;
    position: string;
    icon: React.ReactNode;
}

interface AboutServicesProps {
    gsapLoaded: boolean;
}

const services: Service[] = [
    {
        title: "Brand Architecture",
        desc: "We engineer definitive brand systems. By aligning core identity with market positioning, we ensure your brand projects absolute authority.",
        height: "h-[480px]",
        position: "md:mt-6",
        icon: (
            <Fingerprint className="w-24 h-24 text-white icon-svg" strokeWidth={1} />
        )
    },
    {
        title: "High-Performance Web",
        desc: "Uncompromising design meets technical superiority. We build fluid, performant platforms engineered to convert audiences into loyalists.",
        height: "h-[500px]",
        position: "md:-mt-4",
        icon: (
            <MonitorSmartphone className="w-24 h-24 text-white icon-svg" strokeWidth={1} />
        )
    },
    {
        title: "Strategic Intelligence",
        desc: "A brand without a blueprint is just noise. We conduct rigorous research and synthesize narratives that command market attention.",
        height: "h-[460px]",
        position: "md:mt-20",
        icon: (
            <Target className="w-24 h-24 text-white icon-svg" strokeWidth={1} />
        )
    },
    {
        title: "Digital Systems",
        desc: "Frictionless digital experiences. We architect responsive, intuitive environments driven by sophisticated micro-interactions.",
        height: "h-[490px]",
        position: "md:mt-2",
        icon: (
            <Sparkles className="w-24 h-24 text-white icon-svg" strokeWidth={1} />
        )
    },
    {
        title: "Systemic Identity Structure",
        desc: "Visual presence must be absolute. We forge cohesive design systems that protect your brand's integrity across every medium.",
        height: "h-[470px]",
        position: "md:mt-14",
        icon: (
            <Layers className="w-24 h-24 text-white icon-svg" strokeWidth={1} />
        )
    }
];

const AboutServices: React.FC<AboutServicesProps> = ({ gsapLoaded }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<SVGPathElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const iconsRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        if (!gsapLoaded || !window.gsap) return;
        if (typeof window === 'undefined') return;

        const gsap = window.gsap;

        const ctx = gsap.context(() => {
            let mm = gsap.matchMedia();

            // 1. Title Highlight Animation (Drawing effect)
            gsap.fromTo(highlightRef.current,
                { strokeDasharray: 1000, strokeDashoffset: 1000 },
                {
                    strokeDashoffset: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: "top 80%",
                    }
                }
            );

            mm.add("(min-width: 768px)", () => {
                // 2. Main Scroll Sequence for Desktop
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 100vh",
                        end: "+=200%", // Scroll distance
                        scrub: 1.2,
                        pin: true,
                        anticipatePin: 1,
                    }
                });

                // Scale title down slightly as we scroll
                tl.to(titleRef.current, {
                    scale: 0.85,
                    y: -70,
                    opacity: 0.4,
                    duration: 1
                });

                // Animate cards sliding in from bottom
                tl.to(cardsRef.current, {
                    y: -100, // Move them up into view
                    stagger: 0.2,
                    duration: 2,
                    ease: "power2.out"
                }, "<0.2");
            });

            mm.add("(max-width: 767px)", () => {
                // Mobile Sequence - No pinning, natural scroll fade-in
                gsap.fromTo(cardsRef.current,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: titleRef.current,
                            start: "bottom 80%"
                        }
                    }
                );
            });

            // Removed continuous icon animation loops
        }, sectionRef);

        return () => ctx.revert();
    }, [gsapLoaded]);

    return (
        <section ref={sectionRef} className="relative min-h-[100vh] md:h-[90vh] w-full flex flex-col items-center justify-start pt-12 lg:pt-16 px-6 md:px-12">
            {/* Animated Title */}
            <div ref={titleRef} className="text-center z-10 mb-8 md:mb-12">
                <h2 className="text-[12vw] md:text-[8vw] font-black leading-[0.9] tracking-tight text-zinc-900">
                    What we’re <br />
                    <span className="relative inline-block">
                        really good at
                        {/* Lime Underline SVG */}
                        <svg className="absolute -bottom-2 -left-2 w-[110%] h-8 -z-10 overflow-visible" viewBox="0 0 400 30">
                            <path
                                ref={highlightRef}
                                d="M5 20 Q 100 5, 200 15 T 395 20"
                                fill="none"
                                stroke="#ecff33"
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                </h2>
            </div>

            {/* Cards Grid */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 w-full items-start md:h-[50vh] pb-12 md:pb-0">
                {services.map((item, idx) => (
                    <div
                        key={idx}
                        ref={el => { cardsRef.current[idx] = el; }}
                        className={`flex-1 bg-black p-6 md:p-10 border-l-4 border-[#ecff33] flex flex-col justify-between min-h-[280px] md:h-auto ${item.position} shadow-xl transform md:translate-y-[80vh] translate-y-0 rounded-2xl opacity-0 md:opacity-100`}
                    >
                        <div>
                            <h3 className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight pb-4 md:pb-6 border-b border-zinc-800 mb-4">
                                {item.title}
                            </h3>
                        </div>

                        <div className="flex items-center justify-center py-4">
                            <div ref={el => { iconsRef.current[idx] = el; }}>
                                {item.icon}
                            </div>
                        </div>

                        <div className="mt-auto pt-12 md:pt-16">
                            <p className="text-gray-400 text-base md:text-lg leading-snug">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutServices;
