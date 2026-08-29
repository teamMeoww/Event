'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
}

interface Card {
  id: string;
  title: string;
  color: string;
  textColor: string;
  content: string;
  blob: string;
  bulletPoints?: string[];
  desktopContent?: string;
}

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

const ServiceCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const uiMorphRef = useRef<HTMLDivElement>(null);
  const [gsapLoaded, setGsapLoaded] = useState<boolean>(true);

  useLayoutEffect(() => {
    if (!gsapLoaded || !window.gsap) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Mobile-only MatchMedia
      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        // Reveal Showreel Color on mobile scroll
        gsap.to(".showreel-image", {
          "--tw-grayscale": "grayscale(0%)",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".showreel-container",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // 3. Horizontal Cards Scrolling
      const scrollContainer = document.querySelector(".horizontal-scroll-container") as HTMLElement;

      if (scrollContainer) {
        gsap.to(scrollContainer, {
          x: () => -(scrollContainer.scrollWidth - window.innerWidth * 0.8),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            pin: true,
            scrub: 1.5,
            start: "top top",
            end: () => `+=${scrollContainer.scrollWidth + window.innerWidth * 0.2}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [gsapLoaded]);

  const cards: Card[] = [
    {
      id: '01',
      title: 'Main Character Energy',
      color: 'black',
      textColor: '#ffffff',
      blob: 'bg-white/5',
      content: 'We got the squad, the dev skills, and the web3 tools to make your events literally hit different. No cap.',
      desktopContent: 'We pair immaculate vibes with big brain tech to build ecosystems that are built to perform.',
      bulletPoints: ['IRL Events', 'Web3 Verified', 'W Rizz']
    },
    {
      id: '02',
      title: 'From FOMO to JOMO',
      color: 'black',
      textColor: '#ffffff',
      blob: 'bg-white/5',
      content: 'We see you catching FOMO. We fix that by serving the best tech, hacking challenges, and parties straight to your feed.',
      desktopContent: 'We don\'t just find events, we curate the entire aesthetic and track your reputation.',
      bulletPoints: ['AI Matchmaking', 'Reputation Tracking', 'No Gatekeeping']
    },
    {
      id: '03',
      title: 'Securing the Bag',
      color: 'black',
      textColor: '#ffffff',
      blob: 'bg-white/5',
      content: 'We build for the long game. Web3 credentials, digital passports, and proof of attendance so you can flex your stats.',
      desktopContent: 'Flex your verified event stats and passport credentials.',
      bulletPoints: ['Passport Credentials', 'Web3 Rewards', 'Flex Ready']
    }
  ];

  return (
    <div ref={containerRef} className="bg-[#fcfcfc] w-full overflow-hidden block">
      {/* Showreel */}
      <section className="px-4 md:px-10 py-12 md:py-20 bg-white flex flex-col justify-center items-center w-full">
        <div className="showreel-container w-full max-w-lg md:max-w-none aspect-[3/4] md:aspect-auto md:h-[90vh] bg-[#f0f0f0] rounded-[30px] md:rounded-[60px] overflow-hidden relative group cursor-pointer border border-black/5">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-1000 z-10" />
          <div className="showreel-image w-full h-full bg-[url('/event/google-io.webp')] bg-cover bg-center grayscale md:group-hover:grayscale-0 transition-all duration-1000" />
        </div>
      </section>

      {/* Spacer for smooth transition */}
      <div className="h-8 md:h-20 bg-white" />

      {/* Horizontal Cards */}
      <section ref={horizontalSectionRef} className="h-screen flex items-center overflow-hidden bg-white relative">
        {/* Mobile Landscape Filler Background */}
        <div className="absolute inset-0 flex items-center justify-center md:hidden pointer-events-none z-0 overflow-hidden">
          <div className="text-[28vh] font-black text-zinc-100 tracking-tighter whitespace-nowrap -rotate-90 select-none">
            STUDIO
          </div>
        </div>

        <div className="horizontal-scroll-container flex gap-6 md:gap-20 items-center pl-4 md:pl-10 w-max pr-4 md:pr-10 relative z-10">
          <div className="horizontal-scroll-item min-w-[85vw] md:min-w-[35vw] shrink-0 flex flex-col pt-10 md:pt-0">
            <h2 className="text-[12vw] md:text-[6vw] font-black tracking-tighter leading-[1.1] text-zinc-900 pr-4 md:pr-0 pb-6 border-b md:border-b-0 border-zinc-300 mb-6 md:mb-0">
              What About<br />The Vibe<br className="md:hidden" /> Check?
            </h2>

            {/* Mobile-only descriptive filler */}
            <div className="md:hidden flex flex-col gap-4">
              <p className="text-zinc-500 text-lg leading-relaxed max-w-[280px]">
                Swipe horizontally to discover the principles and passions that drive our digital craftsmanship daily.
              </p>
            </div>
          </div>

          {cards.map((card, i) => (
            <div
              key={i}
              style={{ backgroundColor: card.color, color: card.textColor }}
              className="horizontal-card horizontal-scroll-item w-[85vw] md:w-[70vw] max-w-[450px] md:max-w-none h-[60vh] md:h-[75vh] rounded-4xl p-6 sm:p-8 md:p-12 border-l-4 border-[#ecff33] flex flex-col justify-between relative overflow-hidden group shrink-0 shadow-xl md:shadow-none"
            >
              <div className="relative z-10">
                <h3 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight pb-6 md:pb-8 border-b border-zinc-800 mb-6 md:mb-8 leading-[1.05]">
                  {(() => {
                    const words = card.title.split(' ');
                    const lastWord = words.pop();
                    return (
                      <>
                        {words.join(' ')}
                        <span className="hidden md:inline"> </span>
                        <br className="block md:hidden" />
                        <span className="text-[#ecff33]">{lastWord}</span>
                      </>
                    );
                  })()}
                </h3>
                <p className="opacity-80 md:opacity-70 text-lg md:text-[22px] lg:text-[26px] max-w-[270px] md:max-w-2xl lg:max-w-3xl leading-relaxed">{card.content}</p>

                {card.desktopContent && (
                  <p className="hidden md:block opacity-80 md:opacity-70 text-lg md:text-[22px] lg:text-[26px] md:max-w-2xl lg:max-w-3xl leading-relaxed mt-4"><br />{card.desktopContent}</p>
                )}

                {card.bulletPoints && (
                  <ul className="mt-8 md:mt-12 flex flex-col gap-3 md:gap-4">
                    {card.bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-center gap-3 md:gap-4 text-base md:text-xl lg:text-2xl opacity-90 font-medium tracking-tight">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shrink-0 bg-[#ecff33]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="text-[140px] md:text-[180px] font-black opacity-10 md:opacity-10 absolute -bottom-4 md:bottom-4 -right-4 md:right-10 select-none z-0">{card.id}</div>
              <div className={`absolute top-1/2 -right-20 md:right-10 w-64 h-64 md:w-80 md:h-80 ${card.blob} rounded-full blur-[40px] md:blur-[50px] group-hover:scale-125 transition-transform duration-1000 z-0`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServiceCard;
