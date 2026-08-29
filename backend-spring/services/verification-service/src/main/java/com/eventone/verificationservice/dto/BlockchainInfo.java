package com.eventone.verificationservice.dto;
public class BlockchainInfo {
    private boolean enabled = true;
    private String status;
    private String tokenId;
    private String transactionHash;
    private int chainId;
    private String contractAddress;
    private String reconciliation; // e.g. PENDING if mismatch
    
    // Getters and setters
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getTokenId() { return tokenId; }
    public void setTokenId(String tokenId) { this.tokenId = tokenId; }
    public String getTransactionHash() { return transactionHash; }
    public void setTransactionHash(String transactionHash) { this.transactionHash = transactionHash; }
    public int getChainId() { return chainId; }
    public void setChainId(int chainId) { this.chainId = chainId; }
    public String getContractAddress() { return contractAddress; }
    public void setContractAddress(String contractAddress) { this.contractAddress = contractAddress; }
    public String getReconciliation() { return reconciliation; }
    public void setReconciliation(String reconciliation) { this.reconciliation = reconciliation; }
}
