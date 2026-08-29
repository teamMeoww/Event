'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from '@/contexts/TransitionContext';
import { ComponentProps, MouseEvent } from 'react';

type TransitionLinkProps = ComponentProps<typeof Link> & {
  transitionLabel?: string;
};

// Maps href paths → human-readable page names
function labelFromHref(href: string): string {
  const map: Record<string, string> = {
    '/': 'Home',
    '/services': 'Services',
    '/project': 'Work',
    '/about': 'About',
    '/contact': 'Contact',
    '/book': 'Book',
    '/book/calendar': 'Calendar',
    '/blog': 'Blog',
  };
  return (map[href] ?? href.replace(/^\//, '').replace(/-/g, ' ')) || 'Home';
}

export default function TransitionLink({ href, transitionLabel, children, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { startTransition } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Execute any onClick handler passed from parent (like closing mobile menus)
    if (props.onClick) {
      props.onClick(e);
    }

    const targetHref = typeof href === 'string' ? href : href.pathname || '/';

    // Don't animate same-page clicks
    if (targetHref === pathname) {
      return;
    }

    e.preventDefault();

    const label = transitionLabel || labelFromHref(targetHref);
    startTransition(label);

    // Navigate EXACTLY when the curtain finishes dropping (500ms).
    // This perfectly hides any heavy React rendering lag out of view.
    setTimeout(() => {
      router.push(targetHref);
    }, 500);
  };

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
