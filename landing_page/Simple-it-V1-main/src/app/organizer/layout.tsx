'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/ui/StateViews';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, CalendarDays, Settings } from 'lucide-react';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!user?.roles?.includes('ORGANIZER') && !user?.roles?.includes('ADMIN')) {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) return <LoadingState message="Verifying organizer credentials..." />;
  if (!isAuthenticated || (!user?.roles?.includes('ORGANIZER') && !user?.roles?.includes('ADMIN'))) return null;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        {/* Organizer Sidebar */}
        <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">Organizer Panel</h2>
            <p className="text-xs text-indigo-400">EventOne Dashboard</p>
          </div>
          
          <nav className="flex-1 space-y-2">
            <Link href="/organizer/events" className="flex items-center gap-3 text-gray-400 hover:text-white bg-white/5 p-3 rounded-lg transition-colors">
              <CalendarDays className="w-5 h-5" />
              <span className="font-medium">My Events</span>
            </Link>
            <Link href="/organizer/events/new" className="flex items-center gap-3 text-gray-400 hover:text-white p-3 rounded-lg transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Create Event</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  );
}