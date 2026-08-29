'use client';

import React, { useEffect, useState } from 'react';
import { getEventById, registerForEvent } from '@/lib/api/events';
import { LoadingState, ErrorState } from '@/components/ui/StateViews';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Hexagon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEventById(params.id);
      setEvent(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const handleRegister = async () => {
    if (event?.isBlockchainEnabled) {
      if (confirm('This event issues tickets on the blockchain. We\'ll need to verify your wallet first. Go to Wallet?')) {
        router.push('/wallet');
      }
      return;
    }

    try {
      setRegistering(true);
      await registerForEvent(params.id, {});
      alert('Registration successful! Check your tickets.');
      router.push('/tickets');
    } catch (err: any) {
      alert(`Registration failed: ${err.message}`);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <LoadingState message="Loading event details..." />;
  if (error || !event) return <ErrorState message={error || 'Event not found'} onRetry={fetchEvent} />;

  const date = format(new Date(event.startAt || event.date || new Date()), 'EEEE, MMMM do, yyyy');

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="container max-w-4xl">
        <Link href="/discover" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Discover
        </Link>

        {event.imageUrl ? (
          <div className="w-full h-[400px] rounded-3xl overflow-hidden mb-12 relative border border-white/10">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-[300px] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-12">
            <Calendar className="w-24 h-24 text-white/10" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant="primary">{event.category || 'Event'}</Badge>
          {event.isBlockchainEnabled && (
            <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Hexagon className="w-3 h-3 mr-1" /> Web3 Ticket
            </Badge>
          )}
          <Badge variant={event.status === 'DRAFT' ? 'default' : 'success'}>
            {event.status}
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">{event.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start">
            <Calendar className="w-6 h-6 text-indigo-500 mr-4 shrink-0" />
            <div>
              <p className="text-sm text-gray-400 mb-1">Date</p>
              <p className="font-medium text-white">{date}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="w-6 h-6 text-indigo-500 mr-4 shrink-0" />
            <div>
              <p className="text-sm text-gray-400 mb-1">Location</p>
              <p className="font-medium text-white">{event.location}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Users className="w-6 h-6 text-indigo-500 mr-4 shrink-0" />
            <div>
              <p className="text-sm text-gray-400 mb-1">Availability</p>
              <p className="font-medium text-white">
                {event.capacity ? `${event.registeredCount || 0} / ${event.capacity} registered` : 'Open Entry'}
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-white">About This Event</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {event.description || 'No description available for this event.'}
          </p>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/80 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="container max-w-4xl flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Registration</p>
            <p className="font-medium text-white">
              {event.status === 'DRAFT' ? 'Not Available' : 'Open'}
            </p>
          </div>
          <Button 
            size="lg" 
            onClick={handleRegister} 
            isLoading={registering}
            disabled={event.status === 'DRAFT'}
            className="w-full md:w-auto md:min-w-[200px]"
          >
            {event.status === 'DRAFT' ? 'Coming Soon' : 'Register Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
