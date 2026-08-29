'use client';

import React from 'react';
import TransitionLink from '@/components/atoms/TransitionLink';

const AboutHero: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row justify-between pt-24 sm:pt-28 md:pt-40 pb-6 sm:pb-12 md:pb-16 px-4 sm:px-6 md:px-12 gap-4 lg:gap-8">
            <div className="flex flex-col">
                {/* Elegant Breadcrumb Navigation */}
                <div className="text-[10px] sm:text-xs px-5 font-bold uppercase tracking-widest text-zinc-400 mb-6 sm:mb-8 whitespace-nowrap overflow-x-auto scrollbar-hide pr-4">
                    <TransitionLink href="/" className="hover:text-zinc-900 transition-colors inline">Home</TransitionLink>
                    <span className="mx-2">/</span>
                    <span className="text-zinc-900 inline">About</span>
                </div>

                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] px-5 items-center lg:items-center font-black flex flex-col leading-none tracking-tight text-zinc-900">
                    <div className="overflow-hidden h-[1.1em] flex "><span className="hero-line inline-block text-zinc-900">Event</span></div>
                    <div className="overflow-hidden h-[1.1em] flex "><span className="hero-line inline-block text-zinc-400">—App—</span></div>
                    <div className="overflow-hidden h-[1.1em] flex "><span className="hero-line inline-block text-zinc-900">GenZ.</span></div>
                </h1>
            </div>
            <p className='text-lg md:text-xl italic px-5 pt-4 lg:pt-12 pb-5 font-medium leading-relaxed tracking-tight text-zinc-600 max-w-2xl text-center lg:text-left'>
                " Event App GenZ is built different — we serve immaculate vibes and big brain tech. We operate as a squad of devs, web3 natives, and party planners who understand the assignment. Before we build, we check the vibes. Before we design, we secure the bag. No cap, we transform boring tech into lit IRL experiences. "


                <br/><br/><br/>Designed to Dominate.
            </p>

            <p className='text-lg md:text-xl italic px-5 pt-4 lg:pt-12 pb-5 font-medium leading-relaxed tracking-tight text-zinc-600 max-w-2xl text-left lg:text-left'>
                Our work is not driven by trends, but by architecture and foresight. We integrate creativity with technical rigor to engineer digital ecosystems that perform under pressure, adapt with growth, and evolve with purpose. Every layer is deliberate. Every interaction considered. Because simplicity, when constructed with intelligence, becomes powerful and power, when refined, becomes lasting impact.
            </p>
        </div>
    );
};

export default AboutHero;
