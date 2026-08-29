const { ethers } = require('ethers');

// Mock ABIs for ticket and credential contracts
const TicketABI = [
  "function mintTicket(address to, string memory tokenURI) public returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)"
];

const CredentialABI = [
  "function mintCredential(address to, string memory tokenURI) public returns (uint256)"
];

class BlockchainService {
  constructor() {
    this.enabled = process.env.BLOCKCHAIN_ENABLED === 'true';
    
    if (this.enabled) {
      try {
        this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545');
        this.wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, this.provider);
        
        if (process.env.EVENTONE_TICKET_CONTRACT) {
          this.ticketContract = new ethers.Contract(process.env.EVENTONE_TICKET_CONTRACT, TicketABI, this.wallet);
        }
        
        if (process.env.EVENTONE_CREDENTIAL_CONTRACT) {
          this.credentialContract = new ethers.Contract(process.env.EVENTONE_CREDENTIAL_CONTRACT, CredentialABI, this.wallet);
        }
      } catch (error) {
        console.error('Failed to initialize BlockchainService:', error);
        this.enabled = false;
      }
    }
  }

  async mintTicketAsync(walletAddress, metadataUri) {
    if (!this.enabled || !this.ticketContract) {
      console.log(`[Blockchain Disabled] Mock minting ticket for ${walletAddress}`);
      return { success: true, mocked: true, transactionHash: '0xmockTxHash' };
    }

    try {
      const tx = await this.ticketContract.mintTicket(walletAddress, metadataUri);
      return { success: true, mocked: false, transactionHash: tx.hash };
    } catch (error) {
      console.error('Error minting ticket:', error);
      return { success: false, error: error.message };
    }
  }

  async mintCredentialAsync(walletAddress, metadataUri) {
    if (!this.enabled || !this.credentialContract) {
      console.log(`[Blockchain Disabled] Mock minting credential for ${walletAddress}`);
      return { success: true, mocked: true, transactionHash: '0xmockTxHash' };
    }

    try {
      const tx = await this.credentialContract.mintCredential(walletAddress, metadataUri);
      return { success: true, mocked: false, transactionHash: tx.hash };
    } catch (error) {
      console.error('Error minting credential:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new BlockchainService();
