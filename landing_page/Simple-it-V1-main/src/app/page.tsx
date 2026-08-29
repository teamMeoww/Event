'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMyTickets } from '@/lib/api/tickets';
import { getMyPassport } from '@/lib/api/passport';
import { getEvents } from '@/lib/api/events';
import { LoadingState } from '@/components/ui/StateViews';
import { EventCard } from '@/components/events/EventCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { Calendar, Ticket, Award, ArrowRight, Wallet, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [passport, setPassport] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const [tix, pass, evts] = await Promise.all([
            getMyTickets().catch(() => []),
            getMyPassport().catch(() => null),
            getEvents().catch(() => [])
          ]);
          setTickets(Array.isArray(tix) ? tix : ((tix as any)?.content || []));
          setPassport(pass);
          setEvents(Array.isArray(evts) ? evts : ((evts as any)?.content || []));
        } catch (error) {
          console.error("Failed to load dashboard data", error);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);

  if (isLoading || loadingData) return <LoadingState message="Loading your dashboard..." />;
  if (!isAuthenticated) return null;

  const activeTickets = tickets.filter(t => t.status !== 'CANCELLED' && t.status !== 'USED');
  const nextTicket = activeTickets.length > 0 ? activeTickets[0] : null;

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="container max-w-6xl">
        
        {/* Greeting */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Attendee'}
          </h1>
          <p className="text-gray-400 text-lg">Here's your EventOne overview.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Next Event</h2>
              {tickets.length > 0 && (
                <Link href="/tickets" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              )}
            </div>

            {nextTicket ? (
              <Card className="relative overflow-hidden border-indigo-500/30 bg-indigo-900/10 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl -mr-20 -mt-20 rounded-full" />
                <div className="p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest rounded-full mb-4">
                      UPCOMING
                    </span>
                    <h3 className="text-3xl font-bold text-white mb-2">{nextTicket.eventName || `Event #${nextTicket.eventId?.substring(0,6)}`}</h3>
                    <p className="text-gray-400 flex items-center">
                      <Ticket className="w-4 h-4 mr-2" />
                      Ticket #{nextTicket.id?.substring(0,8) || nextTicket.ticketId?.substring(0,8)}
                    </p>
                  </div>
                  <Link href={`/tickets/${nextTicket.id || nextTicket.ticketId}`}>
                    <Button size="lg" className="w-full md:w-auto shadow-lg shadow-indigo-500/20">
                      Open Ticket
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center border-dashed border-white/10 bg-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No upcoming events</h3>
                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                  You don't have any active tickets. Discover your first event to get started.
                </p>
                <Link href="/discover">
                  <Button>Discover Events</Button>
                </Link>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Passport Summary</h2>
            
            <Card className="p-6 bg-gradient-to-br from-gray-900 to-black border-white/10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <Link href="/passport" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold">
                  View Profile
                </Link>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-wider">Reputation Score</p>
                  <p className="text-4xl font-black text-white">{passport?.reputationScore || 0}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase">Verified Events</p>
                    <p className="text-xl font-bold text-white">{passport?.verifiedEventsCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase">Credentials</p>
                    <p className="text-xl font-bold text-white">{passport?.credentials?.length || 0}</p>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>

        {/* Recommended Events */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
          <Link href="/discover" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event: any) => (
              <EventCard key={event.id || event.eventId} event={event} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed border-white/10 bg-white/5">
             <p className="text-gray-400">Check back later for new events.</p>
          </Card>
        )}

      </div>
    </div>
  );
}
