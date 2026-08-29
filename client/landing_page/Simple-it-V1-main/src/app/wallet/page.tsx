'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getWalletStatus, requestWalletChallenge, verifyWalletSignature, disconnectWallet } from '@/lib/api/wallet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState, ErrorState } from '@/components/ui/StateViews';
import { ethers } from 'ethers';
import { Shield, ShieldCheck, Wallet, User } from 'lucide-react';

export default function WalletPage() {
  const { user, logout } = useAuth();
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWalletStatus();
      setWalletInfo(data);
    } catch (err: any) {
      if (err.message.includes('404') || err.message.toLowerCase().includes('not found')) {
        setWalletInfo(null);
      } else {
        setError(err.message || 'Failed to load wallet status');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnectAndVerify = async () => {
    try {
      setVerifying(true);
      setError(null);

      // Check if MetaMask or another provider is available
      if (!(window as any).ethereum) {
        throw new Error('No Web3 wallet found. Please install MetaMask or another Web3 wallet.');
      }

      // Request account access
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];

      if (!address) {
        throw new Error('No address found from wallet.');
      }

      const network = await provider.getNetwork();
      const expectedChainId = process.env.NEXT_PUBLIC_CHAIN_ID || 31337; 
      if (network.chainId !== BigInt(expectedChainId)) {
        throw new Error(`Wrong Network. Please switch your wallet to network ${expectedChainId}.`);
      }

      const signer = await provider.getSigner();

      // Request EIP-712 Challenge from backend
      const challengeResponse: any = await requestWalletChallenge(address);
      const { nonce, message } = challengeResponse;

      // Request signature from user
      const signature = await signer.signMessage(message);

      // Submit signature for verification
      await verifyWalletSignature(address, nonce, signature);

      alert("Success! Wallet connected and verified.");
      fetchStatus();
    } catch (err: any) {
      alert(`Verification Failed: ${err.message || "Something went wrong."}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setVerifying(true);
      await disconnectWallet();
      fetchStatus();
    } catch (err: any) {
      alert(`Disconnect Failed: ${err.message}`);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <LoadingState message="Loading your digital identity..." />;

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-10">Digital Identity</h1>

        <Card className="flex items-center p-8 mb-12 bg-white/5 border-white/10">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mr-6">
            <User className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{user?.name || 'Attendee'}</h2>
            <p className="text-gray-400">{user?.email || 'email@example.com'}</p>
          </div>
          <Button variant="secondary" onClick={logout}>
            Log Out
          </Button>
        </Card>

        <h2 className="text-2xl font-bold text-white mb-6">Web3 Wallet</h2>

        <Card className="p-8 border-white/10 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {error && <div className="mb-6"><ErrorState message={error} onRetry={fetchStatus} /></div>}

          {walletInfo && walletInfo.verified ? (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <Wallet className="w-6 h-6 text-indigo-400 mr-3" />
                  <span className="text-lg font-medium text-white">Wallet Connected</span>
                </div>
                <Badge variant="success" className="px-3 py-1 text-sm bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4 mr-1 inline" /> Verified
                </Badge>
              </div>
              
              <div className="mb-8 p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-xs text-gray-500 font-medium mb-2 uppercase">Connected Address</p>
                <p className="text-gray-200 font-mono break-all">{walletInfo.address}</p>
              </div>
              
              <Button 
                variant="destructive" 
                onClick={handleDisconnect} 
                isLoading={verifying}
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 relative z-10">
              <div className="mx-auto w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Wallet Connected</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Connect and cryptographically verify your wallet to register for Web3-enabled events and receive soulbound tickets.
              </p>
              <Button 
                size="lg"
                onClick={handleConnectAndVerify} 
                isLoading={verifying}
                className="min-w-[200px]"
              >
                Connect & Verify
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
