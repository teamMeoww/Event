'use client';

import React, { useLayoutEffect, useRef } from 'react';

interface ExpansionSpacerProps {
    gsapLoaded: boolean;
}

const ExpansionSpacer: React.FC<ExpansionSpacerProps> = ({ gsapLoaded }) => {
    const uiSectionRef = useRef<HTMLElement>(null);
    const uiMainImgRef = useRef<HTMLDivElement>(null);

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
                        anticipatePin: 1
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
                    .to(textRightRef.current, { x: "50vw", opacity: 0, duration: 2, ease: "power2.inOut" }, "0");
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


            <div ref={uiMainImgRef} className="w-[90vw] h-[80vh] shadow-2xl relative z-10 overflow-hidden flex items-center justify-center">
                <img src="https://media.licdn.com/dms/image/v2/D5622AQHL_hjNk5DMsQ/feedshare-image-high-res/B56ZrbTmgfMMAU-/0/1764615941188?e=1789603200&v=beta&t=vyVhsboseHf9ikayJQQOJgdf70J3Lm_PRXWO5l2wAZY" alt="App interface" className="w-full h-full object-cover" />
            </div>
        </section>
    );
};

export default ExpansionSpacer;
