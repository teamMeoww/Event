'use client';

import React, { useEffect, useState } from 'react';
import { getMyPassport, getMyCredentials } from '@/lib/api/passport';
import { CredentialCard } from '@/components/passport/CredentialCard';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/StateViews';
import { Card } from '@/components/ui/Card';
import { Award, Star, Shield } from 'lucide-react';

export default function PassportPage() {
  const [passport, setPassport] = useState<any>(null);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const passportData: any = await getMyPassport().catch(() => null);
      const credsData: any = await getMyCredentials().catch(() => []);
      setPassport(passportData);
      const credList = credsData?.content || credsData || [];
      setCredentials(credList);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch passport data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12">My Passport</h1>

        {loading ? (
          <LoadingState message="Loading your digital passport..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : (
          <>
            <Card className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10 mb-16 p-0 overflow-hidden bg-white/5 border-white/10">
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                <Star className="w-10 h-10 text-amber-400 mb-4" />
                <p className="text-4xl font-bold text-white mb-2">{passport?.reputationScore || 0}</p>
                <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">Reputation</p>
              </div>
              
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                <Shield className="w-10 h-10 text-indigo-400 mb-4" />
                <p className="text-4xl font-bold text-white mb-2">{passport?.verifiedEvents || 0}</p>
                <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">Verified Events</p>
              </div>

              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                <Award className="w-10 h-10 text-emerald-400 mb-4" />
                <p className="text-4xl font-bold text-white mb-2">{credentials.length}</p>
                <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">Credentials</p>
              </div>
            </Card>

            <h2 className="text-2xl font-bold text-white mb-8">Digital Credentials</h2>

            {credentials.length === 0 ? (
              <EmptyState 
                icon={Award}
                title="No credentials yet" 
                message="Attend your first event to earn a verifiable digital credential."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.map((cred) => (
                  <CredentialCard key={cred.id || cred.credentialId} credential={cred} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
