'use client';

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import TransitionLink from '@/components/atoms/TransitionLink';
import { useRouter } from 'next/navigation';
import { useTransition } from '@/contexts/TransitionContext';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  category: string;
  tags: string[];
  image: string;
  gridClass: string;
  client: string;
  duration: string;
  date: string;
  detailImage?: string;
  isPortrait?: boolean;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Google I/O Connect',
    category: 'Join us for Google I/O Connect. Build the future.',
    tags: ['TECH', 'AI', 'BENGALURU'],
    image: '/event/google-io.webp',
    gridClass: 'md:col-span-8',
    client: 'EventOne',
    duration: '24 Hours',
    date: 'Aug 2026'
  },
  {
    id: 2,
    title: 'Bengaluru Tech Summit',
    category: 'Explore the future of tech and intelligent systems.',
    tags: ['TECH', 'SUMMIT', 'BENGALURU'],
    image: '/event/tech-summit.jpg',
    gridClass: 'md:col-span-4',
    client: 'CryptoInd',
    duration: '2 Days',
    date: 'Sep 2026',
    isPortrait: true
  },
  {
    id: 3,
    title: 'Google Cloud Event',
    category: 'Learn how to build scalable and maintainable systems.',
    tags: ['CLOUD', 'DEV', 'BENGALURU'],
    image: '/event/google-cloud.jpg',
    gridClass: 'md:col-span-12',
    client: 'DesignX',
    duration: '1 Day',
    date: 'Oct 2026'
  },

];


export default function WorkProject(): React.JSX.Element {
  const router = useRouter();
  const { startTransition } = useTransition();

  const handleProjectClick = (project: Project): void => {
    // Start transition and navigate to project detail page
    startTransition();
    setTimeout(() => {
      router.push(`/project/${project.id}`);
    }, 800);
  };

  return (
    <section className="bg-white text-black py-20 md:py-40 px-4 sm:px-8 md:px-20">
      <div className="max-w-screen mx-auto">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-black">Selected Work</span>
            <h2 className="text-4xl sm:text-6xl md:text-8xl xl:text-9xl font-bold tracking-tighter leading-none ">
              Verified Events,<br />Immaculate Vibes
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 md:gap-y-12">
          {PROJECTS.map((project, i) => (
            <div
              key={i}
              className={`${project.gridClass} group cursor-pointer flex flex-col`}
              onClick={() => handleProjectClick(project)}
            >
              <div className="relative w-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-zinc-100 mb-6 md:mb-10 border border-gray-100 shadow-sm">
                <Image
                  src={project.image}
                  width={1200}
                  height={800}
                  className="block w-full h-auto transition-transform duration-1000 group-hover:scale-105"
                  alt={project.title}
                />
                <div className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all scale-100 md:scale-75 md:group-hover:scale-100 shadow-md md:shadow-xl">
                  <ArrowUpRight className="text-black w-6 h-6 md:w-7 md:h-7" strokeWidth={3} />
                </div>
              </div>
              <div className="space-y-4 px-1 md:px-0">
                <h4 className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl font-bold uppercase leading-none tracking-tighter">
                  {project.title}
                </h4>
                <p className="text-zinc-500 text-[16px] md:text-lg leading-snug md:leading-tight max-w-2xl font-medium">
                  {project.category}
                </p>
                <div className="flex gap-2 flex-wrap pt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-black tracking-widest border border-zinc-200 md:border-zinc-100 px-4 py-2 rounded-full text-zinc-500 md:text-zinc-300 md:group-hover:text-black md:group-hover:border-black transition-all uppercase bg-zinc-50 md:bg-transparent tracking-[0.1em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 md:mt-20 flex justify-end">
          <TransitionLink href="/project">
            <button className="text-4xl md:text-5xl font-bold uppercase tracking-tighter flex items-center gap-4 md:gap-6 group">
              Find Events <ArrowRight className="w-10 h-10 md:w-14 md:h-14 group-hover:translate-x-4 transition-transform" />
            </button>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
