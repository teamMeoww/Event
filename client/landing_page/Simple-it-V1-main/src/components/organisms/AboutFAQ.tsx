'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { LucideChevronDown } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "What is Event App GenZ?",
        answer: "We are a next-generation event platform built specifically for GenZ. We combine Web3 ticketing, AI matchmaking, and on-chain reputation to create seamless, bot-free, and highly curated IRL hangouts."
    },
    {
        question: "How does Web3 Ticketing work?",
        answer: "Every ticket is minted as an NFT on the blockchain. This means you truly own your ticket, can transfer it securely without getting scammed, and can use it to access token-gated experiences."
    },
    {
        question: "What is the Verified Reputation system?",
        answer: "Your reputation is built based on your event attendance, community participation, and positive interactions. It helps maintain high-quality communities and ensures you get matched with people who share your vibe."
    },
    {
        question: "How does AI Matchmaking help me?",
        answer: "Our AI analyzes your interests, past events, and verified reputation to suggest events you'll love and introduce you to potential friends or collaborators before you even arrive at the venue."
    },
    {
        question: "What are Passport Credentials?",
        answer: "Your Passport is your decentralized identity. It securely holds your tickets, event POAPs (Proof of Attendance Protocols), and reputation scores, all controlled by you."
    },
    {
        question: "Do I need to know about crypto to use this?",
        answer: "Not at all! While we use blockchain technology under the hood to ensure security and ownership, our app is designed to feel just like any other modern social application. No complex wallets required to get started."
    },
    {
        question: "How do I host my own event?",
        answer: "Anyone can become an organizer. Simply create an event, set your ticketing rules (including any reputation or token requirements), and our platform will help you reach the right audience."
    },
    {
        question: "Is my data safe and private?",
        answer: "Absolutely. We utilize Zero-Knowledge proofs and decentralized storage principles, meaning you control what data you share and who you share it with, unlike traditional Web2 platforms."
    }
];

interface AboutFAQProps {
    gsapLoaded?: boolean;
}

const AboutFAQ: React.FC<AboutFAQProps> = ({ gsapLoaded }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const sectionRef = useRef<HTMLElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        if (!gsapLoaded || !window.gsap) return;
        const gsap = window.gsap;

        const ctx = gsap.context(() => {
            gsap.from(itemsRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });

            gsap.from(".faq-header", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [gsapLoaded]);

    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section ref={sectionRef} className="w-full bg-[#fcfcfc] pt-0 pb-12 md:py-16 px-6 lg:px-12 relative z-20">
            <div className="max-w-screen mx-auto flex flex-col lg:flex-row gap-8 lg:gap-24">

                {/* Left Side: Header */}
                <div className="w-full lg:w-[35%] faq-header sticky top-32 self-start">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-6">
                        Frequently <br />
                        <span className="text-zinc-400">Asked</span> <br />
                        Questions.
                    </h2>
                    <p className="text-zinc-500 text-lg md:text-xl max-w-sm leading-relaxed">
                        Everything you need to know about how we work, our processes, and what to expect when partnering with us.
                    </p>
                </div>

                {/* Right Side: Accordion Items */}
                <div className="w-full lg:w-[65%] flex flex-col border-t border-zinc-200 mt-8 lg:mt-0">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                ref={el => { itemsRef.current[index] = el; }}
                                className="border-b border-zinc-200 group"
                            >
                                <button
                                    onClick={() => toggleOpen(index)}
                                    className="w-full py-5 md:py-10 flex items-center justify-between text-left focus:outline-none gap-4"
                                >
                                    <h3 className={`text-lg md:text-2xl lg:text-3xl font-bold pr-4 md:pr-8 tracking-tight transition-colors duration-300 ${isOpen ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-900'}`}>
                                        {faq.question}
                                    </h3>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0 ${isOpen ? 'bg-zinc-900 border-zinc-900 text-white rotate-180 shadow-md' : 'bg-transparent border-zinc-300 text-zinc-400 group-hover:border-zinc-900 group-hover:text-zinc-900'}`}>
                                        <LucideChevronDown className="w-6 h-6" />
                                    </div>
                                </button>

                                <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] pb-6 md:pb-10 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <p className="text-base md:text-xl text-zinc-500 leading-relaxed pr-4 md:pr-24 font-medium">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default AboutFAQ;
