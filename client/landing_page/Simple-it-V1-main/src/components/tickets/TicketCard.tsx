import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Hexagon } from 'lucide-react';

export const TicketCard = ({ ticket }: { ticket: any }) => {
  if (!ticket) return null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'success';
      case 'BLOCKCHAIN_PENDING': return 'warning';
      case 'USED': 
      case 'CHECKED_IN': return 'primary';
      case 'CANCELLED': 
      case 'REVOKED': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => status?.replace('_', ' ') || 'UNKNOWN';

  return (
    <Link href={`/tickets/${ticket.id || ticket.ticketId}`} className="block group">
      <Card className="transition-all hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs text-gray-400 font-mono">TICKET #{ticket.id || ticket.ticketId}</p>
          <Badge variant={getStatusColor(ticket.status)}>
            {getStatusLabel(ticket.status)}
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{ticket.eventName || 'EventOne Event'}</h3>
        
        {ticket.tokenId && (
          <div className="inline-flex items-center px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-medium">
            <Hexagon className="w-3 h-3 mr-1" />
            Token ID: {ticket.tokenId}
          </div>
        )}
      </Card>
    </Link>
  );
};
