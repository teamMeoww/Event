'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import TransitionLink from '../atoms/TransitionLink';

const CTA: React.FC = () => {
    const ctaRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            gsap.from('.cta-content', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: 'top 80%',
                },
            });
        }, ctaRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={ctaRef} className="max-w-screen mx-auto px-4 sm:px-8 md:px-20 pb-16 pt-0 md:pb-24 w-full">
            <div className="cta-content bg-[#0A0A0A] text-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-16 md:p-24 text-center space-y-6 sm:space-y-8 relative overflow-hidden group">
                {/* Glow effect matching our new trusted design */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecff33]/5 rounded-full blur-[60px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

                <div className="relative z-10 w-full flex flex-col items-center">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05]">
                        Ready to Secure<br />Your Pass?
                    </h2>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto pt-2">
                        Let&apos;s link up at the next exclusive event. Grab your passport credentials and join the most lit community.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 sm:pt-10 w-full md:w-auto">
                        <TransitionLink href="/contact" className="w-full sm:w-auto">
                            <button className="flex w-full justify-center items-center gap-2 bg-[#ecff33] text-[#18181b] px-10 py-6 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(226,255,0,0.3)] hover:-translate-y-1 transition-all duration-300">
                                <ArrowUpRight className="w-5 h-5" />
                                Claim Pass
                            </button>
                        </TransitionLink>
                        <TransitionLink href="/project" className="w-full sm:w-auto">
                            <button className="flex w-full justify-center items-center gap-2 border-2 border-zinc-700 text-white px-10 py-6 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-300">
                                View Events
                            </button>
                        </TransitionLink>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
