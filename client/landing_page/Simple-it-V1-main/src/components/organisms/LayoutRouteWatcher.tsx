'use client';

import { usePathname } from 'next/navigation';
import { useTransition } from '@/contexts/TransitionContext';
import { useEffect, useRef } from 'react';

export default function LayoutRouteWatcher({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isTransitioning, setIsTransitioning } = useTransition();
    const prevPathname = useRef(pathname);

    useEffect(() => {
        // Only lift the curtain if the pathname actually changed AND we are currently transitioning.
        if (isTransitioning && pathname !== prevPathname.current) {
            // Whenever the pathname completes changing, wait a beat for React to inject 
            // the new component tree into the DOM, then lift the curtain.
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                prevPathname.current = pathname;
            }, 150);

            return () => clearTimeout(timer);
        }
    }, [pathname, isTransitioning, setIsTransitioning]);

    return <>{children}</>;
}
