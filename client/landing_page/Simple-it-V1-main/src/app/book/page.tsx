'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, ArrowRight, Calendar, Clock, Video, Mail, FileText, Zap } from 'lucide-react';
import NavItem from '@/components/molecules/NavItem';
import Footer from '@/components/organisms/Footer';
import TransitionLink from '@/components/atoms/TransitionLink';

export default function BookSelectionPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {

        const ctx = gsap.context(() => {
            // Simple fade and slide up for heading/subtext
            gsap.fromTo(".anim-stagger",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    delay: 0.1
                }
            );

            // Simple fade and slide up for cards
            gsap.fromTo(".card-anim",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out",
                    delay: 0.3
                }
            );

            // Subtle fade up for inner content
            gsap.fromTo(".card-inner-anim",
                { y: 15, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: "power2.out",
                    delay: 0.5
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="bg-[#fcfcfc] min-h-screen flex flex-col" ref={containerRef}>
            <NavItem />

            <main className="flex-1 max-w-screen mx-auto w-full px-4 sm:px-6 md:px-12 pt-28 pb-20 md:pb-32">
                <div className="mb-16">
                    {/* Elegant Breadcrumb Navigation */}
                    <div className="anim-stagger opacity-0 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 sm:mb-8 whitespace-nowrap overflow-x-auto scrollbar-hide pr-4">
                        <TransitionLink href="/" className="hover:text-zinc-900 transition-colors inline">Home</TransitionLink>
                        <span className="mx-2">/</span>
                        <span className="text-zinc-900 inline">Book</span>
                    </div>

                    <div className="flex items-center gap-6 mb-6 overflow-hidden">
                        <h1 className="anim-stagger opacity-0 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-zinc-900 leading-tight">
                            Let&apos;s get talking.
                        </h1>
                    </div>
                    <p className="anim-stagger opacity-0 text-xl text-zinc-500 max-w-2xl font-medium leading-relaxed">
                        How would you like to connect? Choose an option below that works best for your schedule.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Calendar Box */}
                    <div className="card-anim opacity-0 group relative bg-black border border-zinc-800 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 lg:p-14 overflow-hidden cursor-pointer hover:border-[#ecff33]/40 transition-all duration-500">
                        <div className="relative z-10 flex flex-col h-full justify-between gap-8 md:gap-12">
                            <div>
                                <div className="card-inner-anim opacity-0 w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 text-white border border-zinc-800 group-hover:text-[#ecff33] group-hover:border-[#ecff33]/30 transition-colors duration-500">
                                    <Calendar className="w-8 h-8" />
                                </div>
                                <h3 className="card-inner-anim opacity-0 text-3xl md:text-4xl font-bold text-white mb-4">Book a Calendar Slot</h3>
                                <p className="card-inner-anim opacity-0 text-zinc-400 text-lg leading-relaxed max-w-sm mb-8">
                                    Find a dedicated block on our schedule for a deep-dive discovery call to talk about your project scope.
                                </p>

                                <div className="card-inner-anim opacity-0 flex flex-col gap-4">
                                    <div className="flex items-center gap-3 text-zinc-300">
                                        <Clock className="w-5 h-5 text-zinc-500" />
                                        <span className="text-base font-medium">30 Min Strategy Session</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-300">
                                        <Video className="w-5 h-5 text-zinc-500" />
                                        <span className="text-base font-medium">Google Meet / Zoom</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-inner-anim opacity-0 pt-4">
                                <TransitionLink href="/book/calendar">
                                    <div className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg w-fit group-hover:translate-x-2 transition-transform cursor-pointer">
                                        Open Calendar
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </TransitionLink>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Box */}
                    <div className="card-anim opacity-0 group relative bg-white border border-zinc-200 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 lg:p-14 overflow-hidden cursor-pointer hover:border-blue-500/30 hover:shadow-xl transition-all duration-500">
                        <div className="relative z-10 flex flex-col h-full justify-between gap-8 md:gap-12">
                            <div>
                                <div className="card-inner-anim opacity-0 w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-8 text-black border border-zinc-200 group-hover:text-blue-500 group-hover:border-blue-500/20 transition-colors duration-500">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h3 className="card-inner-anim opacity-0 text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900">Send an Inquiry</h3>
                                <p className="card-inner-anim opacity-0 text-zinc-500 text-lg leading-relaxed max-w-sm mb-8">
                                    Have project details ready? Fill out our extensive contact form to get a quote and timeline immediately.
                                </p>

                                <div className="card-inner-anim opacity-0 flex flex-col gap-4">
                                    <div className="flex items-center gap-3 text-zinc-700">
                                        <FileText className="w-5 h-5 text-zinc-400" />
                                        <span className="text-base font-medium">Comprehensive Quote</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-700">
                                        <Zap className="w-5 h-5 text-zinc-400" />
                                        <span className="text-base font-medium">24h Response Time</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-inner-anim opacity-0 pt-4">
                                <TransitionLink href="/contact">
                                    <div className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-lg w-fit group-hover:translate-x-2 transition-transform cursor-pointer">
                                        Go to Contact Form
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </TransitionLink>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
