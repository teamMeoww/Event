'use client';

import React, { useEffect, useState } from 'react';
import { getEvents } from '@/lib/api/events';
import { EventCard } from '@/components/events/EventCard';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/StateViews';
import { Search } from 'lucide-react';

export default function DiscoverPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: any = await getEvents();
      // Spring Data REST Page unwrapping
      const eventList = data?.content || data || [];
      setEvents(eventList);
    } catch (err: any) {
      setError(err.message || 'Failed to discover events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => 
    (e.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Discover Events</h1>
          
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {loading ? (
          <LoadingState message="Finding events..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchEvents} />
        ) : filteredEvents.length === 0 ? (
          <EmptyState 
            title="No events found" 
            message="We couldn't find any events matching your search criteria. Try adjusting your filters."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id || event.eventId} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
