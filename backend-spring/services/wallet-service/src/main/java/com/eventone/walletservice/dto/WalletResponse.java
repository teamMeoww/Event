package com.eventone.walletservice.dto;
public class WalletResponse {
    private boolean connected;
    private String address;
    private String chain;
    private String chainId;
    private String walletType;
    private boolean verified;
    
    public WalletResponse() {}

    // Getters and Setters
    public boolean isConnected() { return connected; }
    public void setConnected(boolean connected) { this.connected = connected; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getChain() { return chain; }
    public void setChain(String chain) { this.chain = chain; }
    public String getChainId() { return chainId; }
    public void setChainId(String chainId) { this.chainId = chainId; }
    public String getWalletType() { return walletType; }
    public void setWalletType(String walletType) { this.walletType = walletType; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
