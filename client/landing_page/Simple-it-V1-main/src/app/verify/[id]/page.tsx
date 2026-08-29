'use client';

import React, { useEffect, useState } from 'react';
import { verifyCredentialPublic } from '@/lib/api/passport';
import { verifyTicketPublic } from '@/lib/api/passport'; // Using same API structure
import { LoadingState, ErrorState } from '@/components/ui/StateViews';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, ShieldAlert, XCircle, FileWarning } from 'lucide-react';
import { format } from 'date-fns';

export default function PublicVerificationPage({ params, searchParams }: { params: { id: string }, searchParams: { type?: string } }) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const type = searchParams.type === 'ticket' ? 'ticket' : 'credential';

  const verify = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (type === 'ticket') {
         data = await verifyTicketPublic(params.id);
      } else {
         data = await verifyCredentialPublic(params.id);
      }
      setResult(data);
    } catch (err: any) {
      // Don't just throw error, as 404 means NOT FOUND which is a valid verification result
      if (err.message.includes('404')) {
        setResult({ status: 'NOT_FOUND', valid: false });
      } else {
        setError(err.message || 'Verification service failed');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verify();
  }, [params.id, type]);

  if (loading) return <LoadingState message="Verifying authenticity on the blockchain..." />;
  if (error) return <ErrorState message={error} onRetry={verify} />;

  const status = result?.status || 'UNKNOWN';
  
  const getVerificationUI = () => {
    switch (status) {
      case 'VERIFIED':
      case 'ACTIVE':
        return {
          icon: <ShieldCheck className="w-16 h-16 text-emerald-400 mb-6" />,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          title: 'Authentic & Valid',
          desc: `This ${type} has been cryptographically verified and is currently valid.`
        };
      case 'REVOKED':
      case 'CANCELLED':
        return {
          icon: <XCircle className="w-16 h-16 text-red-400 mb-6" />,
          color: 'text-red-400',
          bg: 'bg-red-500/10 border-red-500/20',
          title: 'Revoked',
          desc: `This ${type} is authentic but has been explicitly revoked or cancelled by the issuer.`
        };
      case 'USED':
      case 'CHECKED_IN':
        return {
          icon: <ShieldAlert className="w-16 h-16 text-amber-400 mb-6" />,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/20',
          title: 'Already Used',
          desc: `This ${type} is authentic but has already been used/checked-in.`
        };
      case 'NOT_FOUND':
        return {
          icon: <FileWarning className="w-16 h-16 text-gray-400 mb-6" />,
          color: 'text-gray-300',
          bg: 'bg-white/5 border-white/10',
          title: 'Not Found',
          desc: `No ${type} was found with this identifier. It may be fake or invalid.`
        };
      default:
        return {
          icon: <ShieldAlert className="w-16 h-16 text-orange-400 mb-6" />,
          color: 'text-orange-400',
          bg: 'bg-orange-500/10 border-orange-500/20',
          title: 'Status Pending/Unknown',
          desc: `The status of this ${type} cannot be conclusively verified right now. (${status})`
        };
    }
  };

  const ui = getVerificationUI();

  return (
    <div className="min-h-screen pt-24 pb-32 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Public Verification</h1>
          <p className="text-gray-400">Verifying EventOne Assets</p>
        </div>

        <Card className={`text-center p-12 border ${ui.bg}`}>
          <div className="flex justify-center">{ui.icon}</div>
          <h2 className={`text-3xl font-bold mb-4 ${ui.color}`}>{ui.title}</h2>
          <p className="text-gray-300 text-lg mb-8">{ui.desc}</p>
          
          {result && status !== 'NOT_FOUND' && (
            <div className="bg-black/40 rounded-xl p-6 text-left border border-white/5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1 uppercase">Identifier</p>
                <p className="text-white font-mono break-all">{params.id}</p>
              </div>
              
              {result.eventName && (
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1 uppercase">Event</p>
                  <p className="text-white">{result.eventName}</p>
                </div>
              )}
              
              {result.tokenId && (
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1 uppercase">Blockchain Token ID</p>
                  <p className="text-indigo-400 font-mono">{result.tokenId}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
