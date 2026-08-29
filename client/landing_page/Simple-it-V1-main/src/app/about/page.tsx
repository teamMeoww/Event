'use client';

import React, { useLayoutEffect, useState } from 'react';
import NavItem from '@/components/molecules/NavItem';
import ExpansionSpacer from '@/components/organisms/ExpansionSpacer';
import Footer from '@/components/organisms/Footer';

// Modular Sections
import AboutHero from '@/components/organisms/AboutHero';
import AboutServices from '@/components/organisms/AboutServices';
import AboutStudio from '@/components/organisms/AboutStudio';
import AboutFAQ from '@/components/organisms/AboutFAQ';
import CTA from '@/components/molecules/CTA';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
}

const About: React.FC = () => {
  const [gsapLoaded, setGsapLoaded] = useState(true);

  return (
    <main className="bg-[#fcfcfc] text-[#1a1a1a] antialiased min-h-screen relative overflow-hidden">
      <NavItem />

      <AboutHero />
      <AboutServices gsapLoaded={gsapLoaded} />
      <AboutStudio gsapLoaded={gsapLoaded} />
      <ExpansionSpacer gsapLoaded={gsapLoaded} />
      <AboutFAQ gsapLoaded={gsapLoaded} />

      <CTA />
      <Footer />
    </main>
  );
};

export default About;
