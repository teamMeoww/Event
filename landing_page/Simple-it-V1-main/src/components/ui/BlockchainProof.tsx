import React, { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Hexagon, ChevronDown, ChevronUp, Link as LinkIcon, Database, Hash, FileText } from 'lucide-react';

interface BlockchainProofProps {
  status: string;
  tokenId?: string;
  transactionHash?: string;
  chainId?: string | number;
  contractAddress?: string;
}

export const BlockchainProof: React.FC<BlockchainProofProps> = ({ 
  status, 
  tokenId, 
  transactionHash, 
  chainId, 
  contractAddress 
}) => {
  const [expanded, setExpanded] = useState(false);

  // If there's no blockchain interaction at all for this item
  if (!status || status === 'NOT_ENABLED') {
    return null;
  }

  // Shorten a hash or address for display
  const shorten = (str?: string) => {
    if (!str) return 'N/A';
    if (str.length < 15) return str;
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
  };

  return (
    <Card className="p-4 border-emerald-500/20 bg-emerald-500/5 mt-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Hexagon className="w-5 h-5 text-emerald-400 mr-3" />
          <span className="font-semibold text-emerald-400">
            {status === 'VERIFIED' || status === 'ISSUED' || status === 'ACTIVE' 
              ? 'Blockchain Verified' 
              : `Blockchain Status: ${status}`}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-emerald-400/70" />
        ) : (
          <ChevronDown className="w-5 h-5 text-emerald-400/70" />
        )}
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-emerald-500/20 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-emerald-400/70 mb-1 flex items-center">
                <Database className="w-3 h-3 mr-1" /> Network Chain ID
              </p>
              <p className="text-sm text-emerald-200 font-mono">{chainId || 'Pending'}</p>
            </div>
            
            <div>
              <p className="text-xs text-emerald-400/70 mb-1 flex items-center">
                <Hash className="w-3 h-3 mr-1" /> Token ID
              </p>
              <p className="text-sm text-emerald-200 font-mono">{tokenId || 'Pending'}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-emerald-400/70 mb-1 flex items-center">
              <FileText className="w-3 h-3 mr-1" /> Contract Address
            </p>
            <p className="text-sm text-emerald-200 font-mono bg-black/40 p-2 rounded truncate">
              {contractAddress || 'Pending'}
            </p>
          </div>

          <div>
            <p className="text-xs text-emerald-400/70 mb-1 flex items-center">
              <LinkIcon className="w-3 h-3 mr-1" /> Transaction Hash
            </p>
            <p className="text-sm text-emerald-200 font-mono bg-black/40 p-2 rounded truncate">
              {transactionHash || 'Pending'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
