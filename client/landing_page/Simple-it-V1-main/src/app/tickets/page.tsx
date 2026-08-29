'use client';

import React, { useEffect, useState } from 'react';
import { getMyTickets } from '@/lib/api/tickets';
import { TicketCard } from '@/components/tickets/TicketCard';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/StateViews';
import { Ticket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: any = await getMyTickets();
      const ticketList = data?.content || data || [];
      setTickets(ticketList);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12">My Tickets</h1>

        {loading ? (
          <LoadingState message="Loading your tickets..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchTickets} />
        ) : tickets.length === 0 ? (
          <EmptyState 
            icon={Ticket}
            title="No tickets yet" 
            message="Register for an event to get your first ticket."
            actionText="Find Events"
            onAction={() => window.location.href = '/discover'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id || ticket.ticketId} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
