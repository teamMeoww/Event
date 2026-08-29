'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Calendar,
  Layers,
  Eye,
  Code2,
  Search as SearchIcon,
  Rocket,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
}

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface DeviceStyle {
  width: string;
  height: string;
  borderRadius: string;
}



const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "01",
    title: "Planning",
    description: "At the start of each project, we work with our customers to build a solid project plan. The initial Scope document can come from the client or a combined process of phone calls and in-person meetings.",
    icon: <Calendar className="w-8 h-8" />,
  },
  {
    id: "02",
    title: "Wireframing",
    description: "Once the project plan and scope have been finalized, our wireframing team takes over to determine the placement of all objects on each page of the application, whether it is a consumer mobile app or a backend business application.",
    icon: <Layers className="w-8 h-8" />,
  },
  {
    id: "03",
    title: "Design",
    description: "After the wireframes for all pages have been finalized, our design team takes over to create the final appearance and functionality of the application. This is an exciting stage of the project where you can see the entire application come to life.",
    icon: <Eye className="w-8 h-8" />,
  },
  {
    id: "04",
    title: "Code",
    description: "With the wireframes and designs finalized, we begin coding the application to make it functional. As an Agile development shop, we break down the project into baskets of features called sprints. This approach allows our customers to regularly review the progress.",
    icon: <Code2 className="w-8 h-8" />,
  },
  {
    id: "05",
    title: "Testing",
    description: "The testing process for mobile and software applications is a crucial step in ensuring that the product is functional, reliable, and user-friendly. Typically, the process involves several stages, where various techniques and tools are employed.",
    icon: <SearchIcon className="w-8 h-8" />,
  },
  {
    id: "06",
    title: "Deployment",
    description: "After the application is completed, approved by our internal QA, project management and the client — we are ready to deploy the code to its final destination. Hosting options vary from client-owned servers to web or cloud hosting.",
    icon: <Rocket className="w-8 h-8" />,
  }
];

const HERO_WORDS: string[] = ["Mobile", "Business", "Web", "Software"];

const DEVICE_STYLES: Record<number, DeviceStyle> = {
  0: { width: '180px', height: '360px', borderRadius: '32px' }, // Mobile
  1: { width: '280px', height: '380px', borderRadius: '24px' }, // Business (Tablet)
  2: { width: '420px', height: '280px', borderRadius: '16px' }, // Web (Laptop)
  3: { width: '340px', height: '340px', borderRadius: '20px' }, // Software (App)
};

const Morph: React.FC = () => {
  const [gsapLoaded, setGsapLoaded] = useState<boolean>(true);
  const [activeHeroIdx, setActiveHeroIdx] = useState<number>(0);
  const deviceRef = useRef<HTMLDivElement | null>(null);

  // Hero word rotation
  useLayoutEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % HERO_WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Device morph via GSAP
  useLayoutEffect(() => {
    if (!gsapLoaded || !window.gsap || !deviceRef.current) return;

    const gsap = window.gsap;
    const styles = DEVICE_STYLES[activeHeroIdx] || DEVICE_STYLES[0];

    gsap.to(deviceRef.current, {
      width: styles.width,
      height: styles.height,
      borderRadius: styles.borderRadius,
      duration: 0.8,
      ease: "power3.inOut",
    });
  }, [activeHeroIdx, gsapLoaded]);

  // GSAP animations — pin RIGHT side, scroll LEFT side
  useLayoutEffect(() => {
    if (!gsapLoaded || !window.gsap || !window.ScrollTrigger) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Pin the LEFT side (title + device) while right scrollable content moves
      ScrollTrigger.create({
        trigger: ".morph-container",
        start: "top top",
        endTrigger: ".step-trigger-5",
        end: "bottom bottom",
        pin: ".morph-left-side",
        pinSpacing: false,
        pinReparent: false,
      });

      // Animate each step
      PROCESS_STEPS.forEach((_, i) => {
        const stepElement = `.step-trigger-${i}`;
        const iconContainer = `.icon-container-${i}`;

        gsap.fromTo(
          iconContainer,
          {
            scale: 1,
            borderColor: "rgba(63,63,70,0.3)",
            backgroundColor: "rgba(250,250,250,1)"
          },
          {
            scale: 1.05,
            borderColor: "rgba(24,24,27,1)",
            backgroundColor: "rgba(24,24,27,1)",
            duration: 0.01,
            scrollTrigger: {
              trigger: stepElement,
              start: "top center",
              end: "bottom center",
              toggleActions: "play reverse play reverse",
            }
          }
        );

        // Icon color change
        gsap.fromTo(
          `${iconContainer} svg`,
          { color: "#18181b" },
          {
            color: "#ffffff",
            duration: 0.01,
            scrollTrigger: {
              trigger: stepElement,
              start: "top center",
              end: "bottom center",
              toggleActions: "play reverse play reverse",
            }
          }
        );

        gsap.fromTo(
          `.step-text-${i}`,
          { opacity: 0.3 },
          {
            opacity: 1,
            duration: 0.01,
            scrollTrigger: {
              trigger: stepElement,
              start: "top center",
              end: "bottom center",
              toggleActions: "play reverse play reverse",
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [gsapLoaded]);

  return (
    <>
      {/* DESKTOP VERSION (Animated Morph) */}
      <section className="w-screen relative bg-[#fcfcfc] pt-0 mt-0 hidden lg:block">
        <div className="morph-container px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row gap-6">

          {/* LEFT Side: Pinned heading + device */}
          <div className="morph-left-side lg:w-1/2 h-screen flex flex-col justify-start items-start lg:pr-12 pt-[18vh]">
            <div className="w-full">
              {/* Label */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-zinc-300" />
                <span className="text-xs lg:text-[1vw] font-black uppercase tracking-[0.4em] text-zinc-400">
                  Our Process
                </span>
              </div>

              {/* Title + Device on same row */}
              <div className="flex items-center gap-8 lg:gap-10">
                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 leading-[0.95] flex-shrink-0">
                  The <br />
                  <span className="text-[#ecff33] inline-block transition-all duration-500 min-w-[5ch] bg-zinc-900 px-3 py-1 rounded-lg">
                    {HERO_WORDS[activeHeroIdx]}
                  </span>
                  <br />
                  Application <br />
                  Developers.
                </h1>

                {/* Morphing Device — fixed-size slot, device morphs inside without affecting layout */}
                <div className="hidden lg:block w-[320px] h-[400px] flex-shrink-0 relative">
                  <div className="absolute inset-0 flex justify-center items-center">
                    <div
                      ref={deviceRef}
                      className="bg-white shadow-xl border border-zinc-800 relative overflow-hidden flex flex-col p-6 gap-4"
                      style={DEVICE_STYLES[0]}
                    >
                      <div className="w-1/2 h-2 bg-zinc-100 rounded-full animate-pulse" />
                      <div className="flex-1 space-y-4">
                        <div className="w-full h-12 bg-zinc-100 rounded-xl animate-pulse" />
                        <div className="w-full h-12 bg-zinc-100 rounded-xl animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-full h-12 bg-zinc-100 rounded-xl animate-pulse" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-zinc-200 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-zinc-500 text-base md:text-lg max-w-md leading-relaxed mt-6">
                Whatever your unique idea or needs, we&apos;ve got the tools and know-how to build your custom solution from discovery to deployment.
              </p>
            </div>
          </div>

          {/* RIGHT Side: Scrollable Steps */}
          <div className="lg:w-1/2 py-12">
            <div className="space-y-[18vh]">
              {/* Small spacer */}
              <div className="h-[30vh]" />

              {PROCESS_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`step-trigger-${index} relative flex items-start gap-6`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`icon-container-${index} w-20 h-20 rounded-2xl border-2 flex items-center justify-center relative z-10 bg-[#fafafa] text-zinc-900 border-zinc-300/30 transition-all`}
                    >
                      {step.icon}
                    </div>
                  </div>

                  {/* Text */}
                  <div className={`step-text-${index} flex-1 space-y-4 pt-1 opacity-30 transition-opacity`}>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 font-mono">{step.id}</span>
                      <div className="h-px flex-1 bg-zinc-200" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">{step.title}</h2>
                    <p className="text-zinc-500 text-base leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* MOBILE FALLBACK VERSION (No Morphing Device, simple clean list) */}
      <section className="w-screen relative bg-[#fcfcfc] py-20 px-4 sm:px-6 block lg:hidden">
        <div className="max-w-screen mx-auto">
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-zinc-300" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">
              Our Process
            </span>
          </div>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 leading-[0.95] mb-6">
            The <br />
            <span className="text-[#ecff33] inline-block bg-zinc-900 px-3 py-1 rounded-lg mt-2 mb-1">
              {HERO_WORDS[activeHeroIdx]}
            </span>
            <br />
            Application <br />
            Developers.
          </h2>

          <p className="text-zinc-500 text-base leading-relaxed mb-16">
            Whatever your unique idea or needs, we've got the tools and know-how to build your custom solution from discovery to deployment.
          </p>

          {/* Simple Steps List */}
          <div className="space-y-12">
            {PROCESS_STEPS.map((step) => (
              <div key={step.id} className="flex flex-col gap-4 relative">
                {/* Header row */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-900 text-white flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 font-mono">{step.id}</span>
                    <div className="h-px flex-1 bg-zinc-200" />
                  </div>
                </div>
                {/* Content */}
                <div className="pl-4 border-l-2 border-zinc-100 ml-7 mt-2">
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-3">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Morph;
