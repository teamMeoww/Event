'use client';

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import NavItem from '@/components/molecules/NavItem';
import Footer from '@/components/organisms/Footer';
import TransitionLink from '@/components/atoms/TransitionLink';
import { Rocket, Bell, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function IncubatorRegistrationPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const formContainerRef = useRef<HTMLDivElement>(null);
    const [isInputOpen, setIsInputOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
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

            gsap.fromTo(".card-anim",
                { scale: 0.95, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: 0.4
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!formContainerRef.current) return;
        const ctx = gsap.context(() => {
            if (isInputOpen) {
                gsap.to(".initial-btn", { width: 0, opacity: 0, duration: 0.3, ease: "power2.inOut", display: "none" });
                gsap.fromTo(".input-form",
                    { width: 0, opacity: 0, display: "none" },
                    { width: "100%", opacity: 1, display: "flex", duration: 0.5, ease: "power3.out", delay: 0.1 }
                );
            }
        }, formContainerRef);
        return () => ctx.revert();
    }, [isInputOpen]);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="bg-[#fcfcfc] min-h-screen flex flex-col" ref={containerRef}>
            <NavItem />

            <main className="flex-1 max-w-screen mx-auto w-full px-4 sm:px-6 md:px-12 pt-28 pb-20 md:pb-32 flex flex-col">
                <div className="w-full mb-8 lg:mb-16">
                    {/* Elegant Breadcrumb Navigation */}
                    <div className="anim-stagger opacity-0 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 sm:mb-8 whitespace-nowrap overflow-x-auto scrollbar-hide pr-4">
                        <TransitionLink href="/" className="hover:text-zinc-900 transition-colors inline">Home</TransitionLink>
                        <span className="mx-2">/</span>
                        <span className="text-zinc-900 inline">Student Incubator</span>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 w-full max-w-7xl mx-auto min-h-[60vh]">
                    {/* Header Section */}
                    <div className="text-center mb-12 flex flex-col items-center">
                        <h1 className="anim-stagger text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 leading-tight mb-6 max-w-4xl">
                            Propel Your Ideas <br />
                            <span className="text-zinc-400">Into Reality.</span>
                        </h1>
                    </div>

                    {/* Coming Soon Card */}
                    <div className="card-anim opacity-0 w-full max-w-3xl bg-black border border-zinc-800 rounded-3xl p-8 sm:p-12 md:p-16 text-center shadow-2xl relative overflow-hidden group">
                        {/* Subtle aesthetic gradient glow behind content */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ecff33]/10 blur-[100px] rounded-full group-hover:bg-white/20 transition-colors duration-700 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="inline-flex items-center justify-center gap-2 bg-zinc-900/80 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                                <span className="w-2 h-2 rounded-full bg-[#ecff33] animate-pulse"></span>
                                Incoming Transmission
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                Registration details <br className="hidden md:block" /> will be out soon.
                            </h2>

                            <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
                                We are putting the final touches on the Student Incubator program. Prepare your pitches and stay tuned for the official launch.
                            </p>

                            <div className="w-full max-w-sm flex justify-center" ref={formContainerRef}>
                                {status === 'success' ? (
                                    <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest shadow-lg">
                                        <CheckCircle2 className="w-5 h-5 text-[#ecff33]" />
                                        Successfully Subscribed!
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsInputOpen(true)}
                                            className="initial-btn flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#ecff33] hover:scale-105 transition-transform duration-300 shadow-lg shrink-0 whitespace-nowrap"
                                        >
                                            <Bell className="w-4 h-4" />
                                            Notify Me
                                        </button>

                                        <form onSubmit={handleSubscribe} className="input-form hidden items-center w-full relative">
                                            <input
                                                type="email"
                                                required
                                                placeholder="Enter your email address..."
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#ecff33] text-white px-6 py-4 pr-16 rounded-full text-sm outline-none transition-colors duration-300"
                                                disabled={status === 'loading'}
                                            />
                                            <button
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="absolute right-2 top-2 bottom-2 bg-white text-black px-4 rounded-full hover:bg-[#ecff33] transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
                                            >
                                                {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Okay"}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
