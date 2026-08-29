import React, { useLayoutEffect, useRef } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessPopupProps {
    onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ onClose }) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const gsap = window.gsap;
        if (!gsap) return;

        const ctx = gsap.context(() => {
            // Overlay fade in
            gsap.fromTo(overlayRef.current, { backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)" }, { backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", duration: 0.6, ease: "power2.out" });

            // Popup slide up and scale
            gsap.fromTo(popupRef.current,
                { y: 50, scale: 0.9, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, duration: 0.7, delay: 0.1, ease: "back.out(1.2)" }
            );

            // Icon bounce in
            gsap.fromTo(".success-icon-wrap",
                { scale: 0, rotation: -90 },
                { scale: 1, rotation: 0, duration: 0.8, delay: 0.3, ease: "elastic.out(1, 0.5)" }
            );

            // Text stagger up
            gsap.fromTo(".success-txt",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power3.out" }
            );
        });

        return () => ctx.revert();
    }, []);

    const handleClose = () => {
        const gsap = window.gsap;
        if (!gsap) {
            onClose();
            return;
        }

        const ctx = gsap.context(() => {
            gsap.to(popupRef.current, { scale: 0.95, y: 20, opacity: 0, duration: 0.3, ease: "power2.in" });
            gsap.to(overlayRef.current, { backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)", duration: 0.4, ease: "power2.in", onComplete: onClose });
        });
    };

    return (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={handleClose}></div>

            {/* Popup Box */}
            <div ref={popupRef} className="relative bg-[#1a1a1a] border border-zinc-800 rounded-[2.5rem] p-10 md:p-16 lg:p-20 shadow-2xl max-w-2xl w-full overflow-hidden">
                {/* Abstract background gradient */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#ecff33] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#ecff33] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 p-3 rounded-full"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                    <div className="success-icon-wrap bg-[#ecff33] text-zinc-900 rounded-[2rem] p-8 shadow-[0_0_40px_rgba(226,255,0,0.3)]">
                        <CheckCircle className="w-16 h-16" strokeWidth={2.5} />
                    </div>

                    <div className="space-y-4 max-w-lg">
                        <h3 className="success-txt text-4xl md:text-5xl font-black text-white tracking-tight">Got Your Message!</h3>
                        <p className="success-txt text-zinc-400 text-xl font-medium leading-relaxed">
                            Thanks for reaching out. Our team will review your inquiry and get back to you shortly.
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="success-txt mt-8 w-full max-w-sm bg-[#fcfcfc] text-[#1a1a1a] hover:bg-[#ecff33] py-5 rounded-full font-bold text-xl transition-colors shadow-xl"
                    >
                        Awesome, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPopup;
