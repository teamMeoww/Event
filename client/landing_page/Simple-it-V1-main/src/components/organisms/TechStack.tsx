'use client';

import React, { useLayoutEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Tech {
    name: string;
    desc: string;
    when: string;
}

const TECH_DATA: { label: string; items: Tech[] }[] = [
    {
        label: 'Backend',
        items: [
            { name: 'Node.js', desc: 'Event-driven runtime for fast, scalable server-side apps.', when: 'Real-time APIs, microservices, I/O-heavy workloads' },
            { name: 'TypeScript', desc: 'Typed JavaScript for safer, more maintainable code.', when: 'Every project — it\'s our default language' },
            { name: '.NET', desc: 'Enterprise-grade framework for robust APIs.', when: 'Enterprise clients, Windows ecosystems, high-security apps' },
            { name: 'Python', desc: 'Versatile language for AI/ML and rapid prototyping.', when: 'Data pipelines, machine learning, automation scripts' },
            { name: 'Java', desc: 'Battle-tested platform for large-scale systems.', when: 'Banking, fintech, legacy system integrations' },
        ],
    },
    {
        label: 'Frontend',
        items: [
            { name: 'React', desc: 'Component-based library for interactive UIs.', when: 'SPAs, dashboards, complex interactive interfaces' },
            { name: 'Next.js', desc: 'Full-stack React framework with SSR.', when: 'SEO-critical sites, marketing pages, e-commerce' },
            { name: 'Angular', desc: 'Opinionated framework for enterprise SPAs.', when: 'Large teams, enterprise dashboards, form-heavy apps' },
            { name: 'Vue.js', desc: 'Progressive framework for performant UIs.', when: 'Lightweight apps, widget-based UIs, quick iterations' },
            { name: 'Tailwind CSS', desc: 'Utility-first CSS for rapid styling.', when: 'Every frontend project — our default styling approach' },
        ],
    },
    {
        label: 'Mobile',
        items: [
            { name: 'Swift', desc: 'Apple\'s language for native iOS apps.', when: 'iOS-only apps needing peak performance' },
            { name: 'Kotlin', desc: 'Modern language for Android development.', when: 'Android-first apps, Google ecosystem integrations' },
            { name: 'Flutter', desc: 'Cross-platform toolkit from one codebase.', when: 'Budget-conscious cross-platform with custom UI' },
            { name: 'React Native', desc: 'Native mobile apps using React.', when: 'Teams already using React, code-sharing with web' },
        ],
    },
    {
        label: 'Cloud & DevOps',
        items: [
            { name: 'AWS', desc: 'Leading cloud for scalable infrastructure.', when: 'Complex backends, enterprise-scale deployments' },
            { name: 'Docker', desc: 'Containers for consistent deployments.', when: 'Every project — ensures environment consistency' },
            { name: 'Vercel', desc: 'Edge hosting optimized for Next.js.', when: 'Frontend deployments, JAMstack, preview builds' },
            { name: 'GitHub Actions', desc: 'CI/CD integrated into our workflow.', when: 'Automated testing, deployments, code quality checks' },
        ],
    },
    {
        label: 'Database',
        items: [
            { name: 'PostgreSQL', desc: 'Advanced relational DB for complex queries.', when: 'Structured data, reporting, transactional systems' },
            { name: 'MongoDB', desc: 'Flexible NoSQL for unstructured data.', when: 'Content management, IoT, rapidly evolving schemas' },
            { name: 'Redis', desc: 'In-memory store for caching and real-time.', when: 'Session management, leaderboards, pub/sub messaging' },
            { name: 'Firebase', desc: 'Google\'s real-time backend-as-a-service.', when: 'Prototypes, real-time sync, auth-heavy mobile apps' },
        ],
    },
    {
        label: 'Animation & 3D',
        items: [
            { name: 'GSAP', desc: 'Professional animation library for smooth motion.', when: 'Landing pages, scroll experiences, immersive sites' },
            { name: 'Three.js', desc: '3D graphics engine for WebGL experiences.', when: '3D product showcases, interactive visualizations' },
            { name: 'Framer Motion', desc: 'Declarative animations for React components.', when: 'UI transitions, page animations, micro-interactions' },
            { name: 'Lottie', desc: 'Lightweight vector animations from After Effects.', when: 'Icon animations, onboarding flows, loading states' },
        ],
    },
];

/* ── Single expandable card ──────────────────────────────────────────────── */
function TechCard({ tech, className = '' }: { tech: Tech; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        const card = cardRef.current;
        const content = contentRef.current;
        if (!card || !content) return;

        const nameEl = card.querySelector('.tc-name') as HTMLElement;
        const arrowEl = card.querySelector('.tc-arrow') as HTMLElement;

        gsap.killTweensOf(content);
        gsap.killTweensOf(card);
        if (nameEl) gsap.killTweensOf(nameEl);
        if (arrowEl) gsap.killTweensOf(arrowEl);

        if (!isOpen) {
            gsap.set(content, { display: 'block' });
            const h = content.scrollHeight;
            gsap.to(content, { height: h, opacity: 1, duration: 0.35, ease: 'power3.out' });
            gsap.to(card, { backgroundColor: '#000000', duration: 0.3, ease: 'power2.out' });
            if (nameEl) gsap.to(nameEl, { color: '#ffffff', duration: 0.25 });
            if (arrowEl) gsap.to(arrowEl, { rotation: 90, color: '#ecff33', duration: 0.3, ease: 'power2.out' });
            setIsOpen(true);
        } else {
            gsap.to(content, {
                height: 0, opacity: 0, duration: 0.25, ease: 'power2.in',
                onComplete: () => { gsap.set(content, { display: 'none' }); },
            });
            gsap.to(card, { backgroundColor: '#ffffff', duration: 0.3, ease: 'power2.out' });
            if (nameEl) gsap.to(nameEl, { color: '#18181b', duration: 0.25 });
            if (arrowEl) gsap.to(arrowEl, { rotation: 0, color: '#18181b', duration: 0.25, ease: 'power2.in' });
            setIsOpen(false);
        }
    }, [isOpen]);

    const handleEnter = useCallback(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
        if (!isOpen) toggleOpen();
    }, [isOpen, toggleOpen]);

    const handleLeave = useCallback(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
        if (isOpen) toggleOpen();
    }, [isOpen, toggleOpen]);

    const handleClick = useCallback(() => {
        if (typeof window !== 'undefined' && !window.matchMedia('(hover: none)').matches) return;
        toggleOpen();
    }, [toggleOpen]);

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            onClick={handleClick}
            className={`ts-pill rounded-xl sm:rounded-2xl border border-zinc-200 px-4 py-4 sm:px-6 sm:py-5 cursor-default select-none bg-white transition-shadow duration-300 hover:shadow-lg ${className}`}
        >
            <div className="flex items-center justify-between">
                <span className="tc-name text-sm sm:text-lg font-bold tracking-tight text-zinc-900">
                    {tech.name}
                </span>
                <span className="tc-arrow text-zinc-900 text-lg transition-colors duration-200">▸</span>
            </div>

            {/* Expandable content — hidden by default */}
            <div
                ref={contentRef}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0, display: 'none' }}
            >
                <p className="text-sm leading-relaxed text-zinc-300 mt-3">
                    {tech.desc}
                </p>
                <p className="text-[13px] leading-snug text-zinc-400 mt-3 pt-3 border-t border-zinc-600">
                    <span className="font-bold text-[#ecff33] uppercase tracking-wider text-xs">When we use it  </span>
                    — {tech.when}
                </p>
            </div>
        </div>
    );
}

/* ── Philosophy card ─────────────────────────────────────────────────────── */
function PhilosophyCard() {
    return (
        <div className="ts-row col-span-2 bg-black rounded-2xl p-6 sm:p-8 md:p-10 border-l-4 border-[#ecff33] flex flex-col justify-between h-full">
            <div>
                <span className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500 block mb-5">
                    Our Approach
                </span>
                <p className="text-2xl md:text-3xl font-black text-white leading-snug tracking-tight">
                    We don&apos;t pick favorites.
                    <br />
                    <span className="text-[#ecff33]">We pick what works.</span>
                </p>
            </div>

            <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-zinc-700">
                <div className="flex items-start gap-3">
                    <p className="text-sm text-zinc-400"><span className="text-white font-bold">Performance first</span> — every tech choice is benchmarked, not assumed.</p>
                </div>
                <div className="flex items-start gap-3">
                    <p className="text-sm text-zinc-400"><span className="text-white font-bold">Built to scale</span> — architecture that grows with your business.</p>
                </div>
                <div className="flex items-start gap-3">
                    <p className="text-sm text-zinc-400"><span className="text-white font-bold">Future-proof</span> — we stay ahead so your product never falls behind.</p>
                </div>
            </div>

            <p className="text-zinc-600 text-xs mt-auto pt-6 uppercase tracking-widest font-bold">
                Security · Scalability · Speed — baked into every line of code.
            </p>
        </div>
    );
}

/* ── Main section ────────────────────────────────────────────────────────── */
export default function TechStack() {
    const sectionRef = useRef<HTMLElement>(null);
    const [showAllMobile, setShowAllMobile] = useState(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Heading reveal
            gsap.from('.ts-heading', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
            });

            // Stagger each category column
            gsap.utils.toArray<HTMLElement>('.ts-row').forEach((row, i) => {
                gsap.from(row, {
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 90%',
                    },
                    delay: i * 0.08,
                });
            });

            // Stagger individual cards
            gsap.utils.toArray<HTMLElement>('.ts-pill').forEach((pill, i) => {
                gsap.from(pill, {
                    scale: 0.92,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: pill,
                        start: 'top 95%',
                    },
                    delay: i * 0.02,
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="max-w-screen mx-auto px-4 sm:px-6 md:px-12 pt-12 pb-0 md:py-20 bg-[#fcfcfc]"
        >
            {/* Header */}
            <div className="ts-heading mb-10 md:mb-14">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-10 bg-zinc-300" />
                    <span className="text-xs lg:text-[1vw] font-black uppercase tracking-[0.4em] text-zinc-400">
                        Technology
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 leading-[0.95] mb-4">
                    Tools we work with.
                </h2>
                <p className="text-zinc-500 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
                    We pick the right tool for the job — no dogma, just results.
                </p>
            </div>

            {/* Category columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                {TECH_DATA.map((group) => (
                    <div key={group.label} className="ts-row">
                        {/* Category label */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
                                {group.label}
                            </span>
                            <div className="h-px flex-1 bg-zinc-200" />
                        </div>

                        {/* Cards */}
                        <div className="flex flex-col gap-2">
                            {group.items.map((tech, idx) => {
                                const isHiddenMobile = !showAllMobile && idx > 1;
                                return (
                                    <TechCard
                                        key={tech.name}
                                        tech={tech}
                                        className={isHiddenMobile ? 'hidden sm:block' : 'block'}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Philosophy card */}
                <PhilosophyCard />
            </div>

            {/* Mobile View Toggle Button */}
            <div className="mt-8 flex justify-center sm:hidden">
                <button
                    onClick={() => setShowAllMobile(!showAllMobile)}
                    className="px-8 py-3 rounded-full bg-zinc-900 text-white font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors shadow-xl"
                >
                    {showAllMobile ? 'View Less Tools' : 'View More Tools'}
                </button>
            </div>

            {/* Bottom accent line */}
            <div className="mt-12 md:mt-16 hidden sm:flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-300">
                    And many more
                </span>
                <div className="h-px flex-1 bg-zinc-200" />
            </div>
        </section>
    );
}
