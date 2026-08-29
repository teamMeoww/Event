'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { LucideChevronDown } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "What does your typical project timeline look like?",
        answer: "Every project is unique, but our typical engagements range from 6 to 12 weeks. We begin with a 1-2 week discovery phase, followed by iterative design and development sprints. We'll provide a detailed timeline during our initial scoping."
    },
    {
        question: "How do you handle project management and communication?",
        answer: "We believe in radical transparency. Process includes weekly check-ins, a dedicated shared Slack channel, and an active Notion or Linear board so you can track progress, view deliverables, and provide feedback in real-time."
    },
    {
        question: "What is your pricing structure? Fixed or hourly?",
        answer: "We offer both flexible arrangements depending on the project scope. For clearly defined scopes, we prefer milestone-based fixed pricing. For continuous product development and staff augmentation, we operate on a dedicated retainer or hourly basis."
    },
    {
        question: "Do you offer post-launch support and maintenance?",
        answer: "Absolutely. Launching is just the beginning. We offer ongoing support, maintenance, and optimization packages to ensure your product scales securely and remains flawless as your user base grows."
    },
    {
        question: "How much involvement is expected from our team?",
        answer: "We prefer deep collaboration. Plan for 2-3 hours of sync time per week for feedback and approvals. However, we handle all the heavy lifting in design and engineering so you can stay focused on running your business."
    },
    {
        question: "Can you work with our existing codebase or brand guidelines?",
        answer: "Yes. Our team is highly adaptable. We routinely step into existing codebases to refactor, optimize, or build on top of them. We also seamlessly adopt and evolve existing brand guidelines to fit modern digital landscapes."
    },
    {
        question: "What technology stack do you primarily use?",
        answer: "We are framework-agnostic but lean heavily into Next.js, React, Node.js, and TypeScript for modern web applications. We also rely on stable backends like Postgres and flexible cloud infrastructure via AWS and Vercel."
    },
    {
        question: "How do we get started with a new project?",
        answer: "It starts with a conversation. Reach out via our contact page to schedule an introductory call. We'll discuss your goals, technical constraints, and timeline, then follow up with a formal proposal and statement of work."
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
