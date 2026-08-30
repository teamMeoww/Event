'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Instagram,
  Linkedin
} from 'lucide-react';
import Footer from '@/components/organisms/Footer';
import styles from './contact.module.css';
import NavItem from '@/components/molecules/NavItem';
import SuccessPopup from '@/components/molecules/SuccessPopup';
import TransitionLink from '@/components/atoms/TransitionLink';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
}

const Contact: React.FC = () => {
  const [gsapLoaded, setGsapLoaded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!gsapLoaded) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Title Animation
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });

      // Form Container Animation (animate entire form at once)
      gsap.from(".form-container", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 70%",
        }
      });

      // Sidebar content reveal
      gsap.from(".sidebar-content", {
        x: -30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
      });
    });

    return () => ctx.revert();
  }, [gsapLoaded]);

  return (
    <div className="bg-[#111111] text-zinc-100 antialiased min-h-screen">
      <NavItem />

      {/* Hero Header */}
      <header className="pt-24 sm:pt-28 md:pt-40 pb-6 sm:pb-12 md:pb-16 px-4 sm:px-6 md:px-12 max-w-screen mx-auto">
        <div ref={titleRef}>
          {/* Elegant Breadcrumb Navigation */}
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 sm:mb-8 whitespace-nowrap overflow-x-auto scrollbar-hide pr-4">
            <TransitionLink href="/" className="hover:text-white transition-colors inline">Home</TransitionLink>
            <span className="mx-2">/</span>
            <span className="text-white inline">Contact</span>
          </div>
          <h1
            className="text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[10rem] font-black tracking-tight lg:leading-none text-white"
          >
            Let&apos;s Connect
          </h1>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-screen mx-auto px-5 sm:px-6 md:px-12 pb-20 sm:pb-40">

        {/* Mobile: Sidebar info card on top */}
        <div className="block lg:hidden mb-8 sidebar-content">
          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-[1.5rem] p-6 sm:p-8 space-y-6">
            <p className="text-zinc-500 text-base sm:text-lg font-medium">
              Ready to host your next big event? Let's talk scale.
            </p>
            <TransitionLink href="/book">
              <button className="flex items-center rounded-full gap-2 bg-white px-6 py-4 font-bold text-base hover:shadow-xl hover:-translate-y-1 transition-all text-zinc-900">
                <ArrowUpRight className="w-5 h-5" />
                Book a Call
              </button>
            </TransitionLink>
            <div className="flex gap-5 pt-2">
              <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Left Column: Sticky Sidebar — hidden on mobile (shown above instead) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-12 sidebar-content">
            <div className="space-y-6">
              <p className="text-zinc-500 text-xl font-medium max-w-[250px]">
                Ready to host your next big event? Let's talk scale.
              </p>
              <TransitionLink href="/book">
                <button className="flex items-center rounded-full gap-2 bg-white px-8 py-5 font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all text-zinc-900">
                  <ArrowUpRight className="w-5 h-5" />
                  Book a Call
                </button>
              </TransitionLink>
            </div>

            <div className="flex flex-col gap-4 text-zinc-400 font-bold uppercase tracking-widest text-sm">
              <a href="#" className="hover:text-zinc-900 transition-colors flex items-center gap-2 group">
                Instagram <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="hover:text-zinc-900 transition-colors flex items-center gap-2 group">
                LinkedIn <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </aside>

          {/* Right Column: Quote Form */}
          <div ref={formRef} className="lg:col-span-9 space-y-8 sm:space-y-12">
            <div className="form-container bg-[#1a1a1a] border border-zinc-800 rounded-[1.5rem] sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-sm space-y-8 sm:space-y-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Partner with us
              </h2>

              <form className="space-y-6 sm:space-y-8" onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    name: `${formData.get('name')} ${formData.get('surname')}`,
                    email: formData.get('email'),
                    subject: formData.get('services') + ' - ' + formData.get('investment'),
                    message: `Phone: ${formData.get('phone')} \nCompany: ${formData.get('company')} \nDesign Preference: ${formData.get('designs')} \n\nDetails:\n${formData.get('details')}`,
                  };

                  const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  });

                  if (res.ok) {
                    setIsSuccess(true);
                    (e.target as HTMLFormElement).reset();
                  } else {
                    alert("Failed to send message. Please try again.");
                  }
                } catch (err) {
                  console.error(err);
                  alert("An error occurred during submission.");
                } finally {
                  setIsSubmitting(false);
                }
              }}>
                {/* Name and Surname Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className={`${styles.formField} space-y-2`}>
                    <label className="text-zinc-400 text-xs sm:text-sm font-medium">Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Name *"
                      className="w-full bg-[#222222] border border-zinc-800 rounded-lg text-zinc-200 py-3 sm:py-4 px-3 sm:px-4 focus:border-zinc-500 outline-none transition-colors placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:text-zinc-400"
                    />
                  </div>
                  <div className={`${styles.formField} space-y-2`}>
                    <label className="text-zinc-400 text-xs sm:text-sm font-medium">Surname *</label>
                    <input
                      type="text"
                      name="surname"
                      required
                      placeholder="Surname *"
                      className="w-full bg-[#222222] border border-zinc-800 rounded-lg text-zinc-200 py-3 sm:py-4 px-3 sm:px-4 focus:border-zinc-500 outline-none transition-colors placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                {/* Email and Contact Number Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className={`${styles.formField} space-y-2`}>
                    <label className="text-zinc-400 text-xs sm:text-sm font-medium">E-mail *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="E-mail *"
                      className="w-full bg-[#222222] border border-zinc-800 rounded-lg text-zinc-200 py-3 sm:py-4 px-3 sm:px-4 focus:border-zinc-500 outline-none transition-colors placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:text-zinc-400"
                    />
                  </div>
                  <div className={`${styles.formField} space-y-2`}>
                    <label className="text-zinc-400 text-xs sm:text-sm font-medium">Contact Number *</label>
                    <div className="w-full bg-[#222222] border border-zinc-800 rounded-lg text-zinc-200 flex items-center focus-within:border-zinc-900 transition-colors">
                      <span className="py-3 sm:py-4 pl-3 sm:pl-4 pr-2 text-zinc-200 font-medium flex items-center gap-1 text-sm sm:text-base whitespace-nowrap">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="9876543210"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className="flex-1 bg-transparent py-3 sm:py-4 pr-3 sm:pr-4 outline-none placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                </div>

                <div className={`${styles.formField} space-y-2`}>
                  <label className="text-zinc-400 text-xs sm:text-sm font-medium">Organization / Event Name</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Organization / Event Name"
                    className="w-full bg-[#222222] border border-zinc-800 rounded-lg text-zinc-200 py-3 sm:py-4 px-3 sm:px-4 focus:border-zinc-500 outline-none transition-colors placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:text-zinc-400"
                  />
                </div>

                {/* Custom Styled Dropdowns */}
                <div className={`${styles.formField} space-y-2`}>
                  <label className="text-zinc-400 text-xs sm:text-sm font-medium">Event Type *</label>
                  <select name="services" required className="w-full bg-[#222222] border border-zinc-800 rounded-lg text-zinc-200 py-3 sm:py-4 px-3 sm:px-4 text-zinc-200 focus:border-zinc-500 outline-none transition-colors appearance-none cursor-pointer text-sm sm:text-base">
                    <option value="">Event Type *</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="conference">Conference / Summit</option>
                    <option value="workshop">Workshop</option>
                    <option value="meetup">Meetup</option>
                    <option value="party">Party / Social</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={`${styles.formField} space-y-2`}>
                  <label className="text-zinc-400 text-xs sm:text-sm font-medium">Expected Attendees *</label>
                  <select name="designs" required className="w-full bg-[#222222] border border-zinc-800 rounded-lg text-zinc-200 py-3 sm:py-4 px-3 sm:px-4 text-zinc-200 focus:border-zinc-500 outline-none transition-colors appearance-none cursor-pointer text-sm sm:text-base">
                    <option value="">Expected Attendees *</option>
                    <option value="small">1 - 100</option>
                    <option value="medium">100 - 500</option>
                    <option value="large">500 - 1,000</option>
                    <option value="xlarge">1,000+</option>
                  </select>
                </div>

                <div className={`${styles.formField} space-y-2`}>
                  <label className="text-zinc-400 text-xs sm:text-sm font-medium">Web3 / Blockchain Features? *</label>
                  <select name="investment" required className="w-full bg-[#222222] border border-zinc-800 rounded-lg text-zinc-200 py-3 sm:py-4 px-3 sm:px-4 text-zinc-200 focus:border-zinc-500 outline-none transition-colors appearance-none cursor-pointer text-sm sm:text-base">
                    <option value="">Web3 / Blockchain Features? *</option>
                    <option value="full">Yes - Full Integration</option>
                    <option value="tickets">Yes - Just Ticketing</option>
                    <option value="no">No</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>

                <div className={`${styles.formField} space-y-2`}>
                  <label className="text-zinc-400 text-xs sm:text-sm font-medium">Event details *</label>
                  <textarea
                    rows={4}
                    name="details"
                    required
                    placeholder="Event details (Tell us a bit about what you're planning)*"
                    className="w-full bg-[#222222] border border-zinc-800 rounded-lg text-zinc-200 py-3 sm:py-4 px-3 sm:px-4 focus:border-zinc-500 outline-none transition-colors resize-none placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:text-zinc-400"
                  ></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="flex items-center gap-3 text-lg sm:text-xl font-bold group pt-4 sm:pt-8 disabled:opacity-70 disabled:cursor-not-allowed transition-all w-full sm:w-auto">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-md flex-shrink-0">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>
                  {isSubmitting ? 'Sending...' : 'Send now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Success Popup Portal */}
      {isSuccess && <SuccessPopup onClose={() => setIsSuccess(false)} />}
    </div>
  );
};

export default Contact;