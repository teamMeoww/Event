import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Hexagon, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export const CredentialCard = ({ credential }: { credential: any }) => {
  if (!credential) return null;

  const date = format(new Date(credential.issuedAt || credential.createdAt || new Date()), 'MMM dd, yyyy');
  const isRevoked = credential.status === 'REVOKED';

  return (
    <Link href={`/credentials/${credential.id || credential.credentialId}`} className="block group">
      <Card className="transition-all hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] border-l-4 border-l-indigo-500">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs text-gray-400 font-mono tracking-wider">
            {credential.credentialType || 'PROOF OF ATTENDANCE'}
          </p>
          <Badge 
            variant={isRevoked ? 'error' : 'success'} 
            className="flex items-center gap-1 px-2"
          >
            {isRevoked ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
            {isRevoked ? 'REVOKED' : 'VERIFIED'}
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{credential.eventName}</h3>
        <p className="text-sm text-gray-400 mb-6">Issued {date}</p>
        
        <div className="flex items-center">
          <Hexagon className="w-4 h-4 text-indigo-400 mr-2" />
          <span className="text-sm text-gray-300 font-mono">
            {credential.tokenId ? `Token #${credential.tokenId}` : 'Processing...'}
          </span>
        </div>
      </Card>
    </Link>
  );
};
