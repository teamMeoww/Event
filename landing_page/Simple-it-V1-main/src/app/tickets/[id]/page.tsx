'use client';

import React, { useEffect, useState } from 'react';
import { getTicketById, getTicketQr } from '@/lib/api/tickets';
import { LoadingState, ErrorState } from '@/components/ui/StateViews';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, QrCode, Hexagon } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { BlockchainProof } from '@/components/ui/BlockchainProof';

export default function TicketDetailsPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<any>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const ticketData: any = await getTicketById(params.id);
      const qrResponse: any = await getTicketQr(params.id).catch(() => null);
      
      setTicket(ticketData);
      if (qrResponse && qrResponse.qrToken) {
        setQrData(qrResponse.qrToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [params.id]);

  if (loading) return <LoadingState message="Loading ticket details..." />;
  if (error || !ticket) return <ErrorState message={error || 'Ticket not found'} onRetry={fetchDetails} />;

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="container max-w-2xl">
        <Link href="/tickets" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tickets
        </Link>

        <Card className="overflow-hidden bg-white">
          <div className="p-8 text-center border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{ticket.eventName || 'EventOne Event'}</h1>
            <Badge variant={ticket.status === 'ACTIVE' ? 'success' : 'default'} className="mx-auto">
              {ticket.status}
            </Badge>
          </div>

          <div className="p-12 flex flex-col items-center justify-center bg-gray-50">
            {qrData ? (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-64 h-64 flex items-center justify-center rounded-lg">
                  <QRCodeSVG value={qrData} size={256} />
                </div>
                <p className="text-center text-gray-400 text-sm mt-4">Present this QR code for scanning</p>
              </div>
            ) : (
              <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400">
                <QrCode className="w-16 h-16 mb-4" />
                <p className="text-sm">QR Code not available</p>
                {ticket.blockchainStatus === 'PENDING' && (
                  <p className="text-xs mt-2 text-center px-4">Waiting for blockchain confirmation</p>
                )}
              </div>
            )}
          </div>

          <div className="p-8 bg-white flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">TICKET ID</p>
              <p className="text-sm font-mono text-gray-900">#{ticket.id || ticket.ticketId}</p>
            </div>
            
            <div className="md:text-right">
              <p className="text-xs text-gray-400 font-medium mb-1">WALLET</p>
              <p className="text-sm font-mono text-gray-900 max-w-[200px] truncate">
                {ticket.walletAddress || 'N/A'}
              </p>
            </div>
          </div>

          {ticket.blockchainStatus && ticket.blockchainStatus !== 'NOT_ENABLED' && (
            <div className="px-8 py-6 bg-indigo-50 border-t border-indigo-100 flex items-center justify-center">
               <div className="w-full">
                  <BlockchainProof 
                    status={ticket.blockchainStatus}
                    tokenId={ticket.tokenId}
                    transactionHash={ticket.transactionHash}
                    chainId={ticket.chainId}
                    contractAddress={ticket.contractAddress}
                  />
               </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
