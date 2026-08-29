import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Hexagon } from 'lucide-react';

export const EventCard = ({ event }: { event: Record<string, any> }) => {
  if (!event) return null;

  const date = format(new Date((event.startAt as string) || (event.date as string) || new Date()), 'MMM dd, yyyy');

  return (
    <Link href={`/events/${event.id || event.eventId}`} className="block group">
      <Card className="p-0 overflow-hidden transition-all hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
        <div className="h-48 bg-white/5 relative flex items-center justify-center overflow-hidden">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          ) : (
            <Calendar className="w-16 h-16 text-white/10" />
          )}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <Badge variant="primary">{event.category || 'Event'}</Badge>
            {event.blockchainEnabled && (
              <Badge variant="success" className="bg-emerald-500/20"><Hexagon className="w-3 h-3 mr-1" /> Web3</Badge>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{event.title}</h3>
          
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
              {date}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-indigo-400" />
              {event.capacity ? `${event.registeredCount || 0} / ${event.capacity} spots` : 'Open Entry'}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
