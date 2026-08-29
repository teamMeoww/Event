'use client';

import React, { useEffect, useState } from 'react';
import { getCredentialById } from '@/lib/api/passport';
import { LoadingState, ErrorState } from '@/components/ui/StateViews';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Award, Hexagon, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function CredentialDetailsPage({ params }: { params: { id: string } }) {
  const [credential, setCredential] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCredentialById(params.id);
      setCredential(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch credential');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [params.id]);

  if (loading) return <LoadingState message="Loading credential..." />;
  if (error || !credential) return <ErrorState message={error || 'Credential not found'} onRetry={fetchDetails} />;

  const date = format(new Date(credential.issuedAt || credential.createdAt || new Date()), 'MMMM do, yyyy');
  const isRevoked = credential.status === 'REVOKED';

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="container max-w-3xl">
        <Link href="/passport" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Passport
        </Link>

        <Card className="relative overflow-hidden bg-white/5 border-l-8 border-l-indigo-500 mb-8 p-10">
          <div className="flex flex-col items-center text-center mb-10 relative z-10">
            <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
              <Award className="w-12 h-12 text-indigo-400" />
            </div>
            
            <p className="text-sm text-indigo-400 font-mono tracking-widest uppercase mb-4">
              {credential.credentialType || 'PROOF OF ATTENDANCE'}
            </p>
            
            <h1 className="text-4xl font-bold text-white mb-6">{credential.eventName}</h1>
            
            <Badge 
              variant={isRevoked ? 'error' : 'success'} 
              className="px-4 py-2 text-sm flex items-center gap-2"
            >
              {isRevoked ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              {isRevoked ? 'REVOKED' : 'VERIFIED CREDENTIAL'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-10">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-2 uppercase">Issued Date</p>
              <p className="text-white font-medium">{date}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 font-medium mb-2 uppercase">Owned By Wallet</p>
              <p className="text-white font-mono break-all">{credential.walletAddress || 'N/A'}</p>
            </div>
          </div>
        </Card>

        {credential.tokenId && (
          <Card className="bg-indigo-900/10 border-indigo-500/20">
            <div className="flex items-center mb-6">
              <Hexagon className="w-6 h-6 text-indigo-400 mr-3" />
              <h2 className="text-xl font-bold text-white">Blockchain Proof</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs text-indigo-300 font-medium mb-2 uppercase">Token ID</p>
                <p className="text-white font-mono">{credential.tokenId}</p>
              </div>
              
              {credential.mintTransactionHash && (
                <div>
                  <p className="text-xs text-indigo-300 font-medium mb-2 uppercase">Transaction Hash</p>
                  <p className="text-indigo-400 font-mono break-all text-sm">{credential.mintTransactionHash}</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <Link href={`/verify/${credential.id || credential.credentialId}`} target="_blank">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Public Verification
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
