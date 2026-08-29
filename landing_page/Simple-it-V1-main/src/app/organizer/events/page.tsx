'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/StateViews';
import { getEvents } from '@/lib/api/events';
import { EventCard } from '@/components/events/EventCard';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function OrganizerEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        const allEvents = Array.isArray(response) ? response : ((response as any)?.content || []);
        // In a real app we'd filter by the organizer's ID, but for now just show all if ADMIN/ORGANIZER
        setEvents(allEvents);
      } catch (err) {
        console.error("Failed to load organizer events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user]);

  if (loading) return <LoadingState message="Loading events..." />;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Events</h1>
          <p className="text-gray-400">Manage your events, view registrations, and handle live check-ins.</p>
        </div>
        <Link href="/organizer/events/new">
          <Button className="flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id || event.eventId} className="relative group">
               <EventCard event={event} />
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center gap-3">
                 <Link href={`/organizer/events/${event.id || event.eventId}/live`}>
                   <Button variant="primary">Live Check-in</Button>
                 </Link>
                 <Link href={`/organizer/events/${event.id || event.eventId}/attendees`}>
                   <Button variant="secondary">View Attendees</Button>
                 </Link>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-dashed border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto">
            You haven't created any events yet.
          </p>
          <Link href="/organizer/events/new">
            <Button>Create your first event</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}